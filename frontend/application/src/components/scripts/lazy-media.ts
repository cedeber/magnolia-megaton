import { Vue, Component, Prop } from "vue-property-decorator";
import getPictureSource from "../../helpers/picture-source";
import validateSchema from "../../schemas/validate";
import mediaSchema from "../../schemas/media.json";
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
const IEdgeMatches = /(Edge|Trident)\/(\d.)/i.exec(navigator.userAgent);
const isOutdatedBrowser = IEdgeMatches && parseInt(IEdgeMatches[2], 10) < 16;

/**
 * @todo Save the result in a sessionStorage?
 */

@Component
class LazyMedia extends Vue {
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

    private log = taggr("async-media");

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
                // [FIXME] remove <any> once IntersectionObserver will be valid
                if (!(<any>entries[0]).isIntersecting) { return; }

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

export default LazyMedia;
