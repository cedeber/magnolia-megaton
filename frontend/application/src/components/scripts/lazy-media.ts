import { Vue, Component, Prop } from "vue-property-decorator";
import validateSchema from "../../schemas/validate";
import mediaSchema from "../../schemas/media.json";
import sourcesSchema from "../../schemas/picture-sources.json";
import taggr from "../../devtools/taggr";

interface LazyJSON {
    picture?: {
        link: string;
        id: string;
        extension: string;
        width: number;
        height: number;
        sources: {
            [propName: string]: string;
        }
    };

    video?: {
        link: string;
        id: string;
        extension: string;
    };

    metadata: {
        mimetype: string;
        title: string;
        description: string;
        caption: string;
    };
}

declare global {
    interface Window { objectFitPolyfill: any; }
}

const validateMedia = validateSchema(mediaSchema);
const validateSources = validateSchema(sourcesSchema);
const IEdgeMatches = /(Edge|Trident)\/(\d.)/i.exec(navigator.userAgent);
const isOutdatedBrowser = IEdgeMatches && parseInt(IEdgeMatches[2], 10) < 16;

/**
 * @todo Save the result in a sessionStorage?
 */

@Component
export default class LazyMedia extends Vue {
    @Prop({ type: Boolean, default: false })
    public isInstantly!: boolean;

    @Prop({ type: Boolean, default: false })
    public isCover!: boolean;

    @Prop({ type: Boolean, default: false })
    public hasCaption!: boolean;

    @Prop({ type: Boolean, default: false })
    public isAutoplay!: boolean;

    @Prop({ type: String, default: "is-center" })
    public position!: string;

    // need to return JSON
    @Prop({ type: String, default: "" })
    public path!: string;

    // if content == null, fetch the content with 'path' (JSON)
    @Prop({ type: Object, default: null })
    public content!: LazyJSON | null;

    @Prop({ type: Object, default: null })
    public ratio!: any;

    public source = "";
    public width: string | number = "100%";
    public height: string | number = "100%";
    public isLoaded = false;

    public video: any = null;
    public picture: any = null;
    public metadata: any = {};

    private log = taggr("lazy-media");

    public async mounted() {
        this.log.keep(this.$el);

        let data = this.content;
        let source = "";

        try {
            if (data == undefined) {
                const response = await fetch(this.path, { credentials: "include" });
                data = await response.json();
            }
        } catch (error) {
            this.log.list(error).error("error while fetching content");
            return;
        }

        try {
            if (!data) { throw new Error("json is void"); }

            await validateMedia(data);
            this.log.info("json is valid");

            this.video = data.video;
            this.picture = data.picture;
            this.metadata = data.metadata;
        } catch (errors) {
            this.log.list(errors).error(`json not valid: ${errors[0].message} in ${errors[0].schemaPath}`);
            return;
        }

        try {
            source = this.video
                ? this.video.link || ""
                : await getPictureSource(this.picture.sources);
            this.log.info(`default source: '${source}'`);
        } catch (error) {
            this.log.list(error).error("error while getting correct source");
            return;
        }

        if (this.isInstantly) {
            this.source = source;
        } else {
            // [TODO] Create only one observer for all lazy components
            const observer = new IntersectionObserver(entries => {
                if (!entries[0].isIntersecting) { return; }

                observer.disconnect();
                this.source = source;
            }, {
                    rootMargin: "100px 100px 667px 100px", // 1 viewport height of an iPhone 7/8
                });
            observer.observe(this.$el);
        }
    }

    public updated() {
        const image = this.$el.querySelector("img");

        if (image) {
            const source = image.getAttribute("src") || "";
            // tslint:disable-next-line:no-bitwise
            const ext = source.slice((source.lastIndexOf(".") - 1 >>> 0) + 2);

            // [TODO] Add @load with Vue?

            image.addEventListener("load", async () => {
                let width = image.naturalWidth;
                let height = image.naturalHeight;

                if (ext === "svg") {
                    const parser = new DOMParser();
                    const file = await fetch(this.source, { credentials: "include" });
                    const fileAsText = await file.text();
                    const fileAsSvg = parser.parseFromString(fileAsText, "image/svg+xml");
                    const svg = fileAsSvg.getElementsByTagName("svg")[0];

                    if (svg) {
                        width = svg.width.baseVal.value || svg.viewBox.baseVal.width;
                        height = svg.height.baseVal.value || svg.viewBox.baseVal.height;
                    }
                }

                this.width = width;
                this.height = height;

                // object-fit polyfill for IEdge <= 15
                if (
                    typeof window.objectFitPolyfill === "function" &&
                    isOutdatedBrowser && ext !== "svg" &&
                    this.isCover) {
                    window.objectFitPolyfill(image);
                }

                this.isLoaded = true;
            });
        }
    }
}

function getPictureSource(data: any): Promise<string> {
    return new Promise(async (resolve, reject) => {
        try {
            await validateSources(data);
        } catch (errors) {
            reject(errors);
        }

        const pixelRatio = window.devicePixelRatio || 1;
        const sourcesInfos: Array<{pxr: number, src: string}> = [];
        let srcset: string = "";

        // Get the srcset that match the media query
        for (const key of Object.keys(data)) {
            const media = key === "all" ? key : `(max-width:${key})`;

            if (window.matchMedia(media).matches) {
                srcset = data[key];
                break;
            }
        }

        if (srcset === "") {
            reject(new Error("no srcset found"));
            return;
        }

        // Split the srcset between pixel ratio rules
        const sourceDefinitions = srcset.split(",");

        for (const definition of sourceDefinitions) {
            const def = definition.trim().replace(/\s{2,}/g, " ");
            const rules = def.split(" ");

            if (rules.length === 1) {
                // Pixel ratio 1
                sourcesInfos.push({
                    pxr: 1,
                    src: rules[0],
                });
            }
            else if (rules.length > 1) {
                // Other pixel ratios
                for (let i = 1, l = rules.length; i < l; i += 1) {
                    if (rules[i].endsWith("x")) {
                        sourcesInfos.push({
                            pxr: Number(rules[i].slice(0, -1)),
                            src: rules[0],
                        });
                    }
                }
            }
        }

        if (sourcesInfos.length > 0) {
            // Sort the pixel ratios
            sourcesInfos.sort((hash1: any, hash2: any) => {
                const pxr1 = hash1.pxr;
                const pxr2 = hash2.pxr;

                if (pxr1 < pxr2) { return -1; }
                if (pxr1 > pxr2) { return 1; }

                return 0;
            });

            // Extract the good version
            let validatedSource = sourcesInfos[sourcesInfos.length - 1].src;

            for (let i = 0, l = sourcesInfos.length; i < l; i += 1) {
                const source = sourcesInfos[i];

                validatedSource = source.src;
                if (source.pxr >= pixelRatio) {
                    break;
                }
            }

            resolve(validatedSource);
            return;
        }

        reject(new Error("unable to define a source"));
        return;
    });
}
