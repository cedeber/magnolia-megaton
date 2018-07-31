import { Vue, Component, Prop, Watch } from "vue-property-decorator";
// import validateSchema from "../../schemas/validate";
// import mediaSchema from "../../schemas/media.json";
// import sourcesSchema from "../../schemas/picture-sources.json";

// [TODO] Remove unnecessary Promises (from JSON validation)
// [TODO] divided option (multiple the query by divided for cell-1ofX)
// [TODO] make the JSON request when visible in viewport (optimize number of requests)

interface LazyJSON {
    picture?: {
        link: string;
        id: string;
        extension: string;
        width: number;
        height: number;
        sources: {
            [propName: string]: string;
        };
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

// const validateMedia = validateSchema(mediaSchema);
// const validateSources = validateSchema(sourcesSchema);

// Edge doesn't support object-fit for video...
// https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/13603873/#comment-14
const IEdgeMatches = /(Edge|Trident)\/(\d.)/i.exec(navigator.userAgent);
const isOutdatedBrowser = IEdgeMatches != null; // && parseInt(IEdgeMatches[2], 10) < 17;

/**
 * @todo Save the result in a sessionStorage?
 */

@Component
export default class LazyMedia extends Vue {
    @Prop({ type: Boolean, default: false })
    isInstantly!: boolean;

    @Prop({ type: Boolean, default: false })
    isCover!: boolean;

    @Prop({ type: Boolean, default: false })
    hasCaption!: boolean;

    @Prop({ type: Boolean, default: false })
    isAutoplay!: boolean;

    @Prop({ type: String, default: "is-center" })
    position!: string;

    // need to return JSON
    @Prop({ type: String, default: "" })
    path!: string;

    // if content == null, fetch the content with 'path' (JSON)
    @Prop({ type: Object, default: null })
    content!: LazyJSON | null;

    @Prop({ type: Object, default: null })
    ratio!: any;

    @Prop({ type: Object, default: null })
    simRatio!: any;

    @Prop({ type: Boolean, default: false })
    scaled!: boolean;

    @Prop({ type: Number, default: -1 })
    maxWidth!: number;

    source = "";
    width: string | number = "100%";
    height: string | number = "100%";
    isLoaded = false;
    observer: IntersectionObserver | null = null;

    video: any = null;
    picture: any = null;
    metadata: any = {};

    @Watch("path")
    onPathChanged() {
        this.init();
    }

    mounted() {
        this.init();
    }

    /**
     * @returns {Promise<void>}
     */
    async init(): Promise<void> {
        let data = this.content;
        let source = "";

        if (data == undefined) {
            const response = await fetch(this.path, { credentials: "include" });
            data = await response.json();
        }

        if (!data) {
            throw new Error("json is void");
        }

        // await validateMedia(data);

        this.video = data.video || null;
        this.picture = data.picture || null;
        this.metadata = data.metadata || null;

        if (this.maxWidth && this.maxWidth > 0 && this.picture) {
            this.picture.sources = restrictSources(
                this.picture.sources,
                this.maxWidth,
            );
        }

        source = this.video
            ? this.video.link || ""
            : await getPictureSource(this.picture.sources);

        // Helper for object-fit polyfill
        if (!this.ratio && this.isCover && this.simRatio && isOutdatedBrowser) {
            this.ratio = this.simRatio;
        }

        if (this.ratio) {
            this.$el.style.paddingTop =
                `calc(1 / (${this.ratio.w} / ${this.ratio.h}) * 100%)`;
        }

        if (this.isInstantly) {
            this.source = source;
        } else {
            // [TODO] Create only one observer for all lazy components
            if (this.observer != null) {
                this.observer.disconnect();
                this.observer = null;
            }

            this.observer = new IntersectionObserver(
                entries => {
                    if (!entries[0].isIntersecting) {
                        return;
                    }

                    if (this.observer != null) {
                        this.observer.disconnect();
                        this.observer = null;
                    }

                    this.source = source;
                },
                {
                    rootMargin: "100px 100px 667px 100px", // 1 viewport height of an iPhone 7/8
                },
            );

            this.observer.observe(this.$el);
        }
    }

    updated() {
        const image = this.$el.querySelector("img");

        if (image) {
            const source = image.getAttribute("src") || "";
            // tslint:disable-next-line:no-bitwise
            const ext = source.slice(((source.lastIndexOf(".") - 1) >>> 0) + 2);

            // [TODO] Add @load with Vue?

            image.addEventListener("load", async () => {
                let width = image.naturalWidth;
                let height = image.naturalHeight;

                if (ext === "svg") {
                    const parser = new DOMParser();
                    const file = await fetch(this.source, {
                        credentials: "include",
                    });
                    const fileAsText = await file.text();
                    const fileAsSvg = parser.parseFromString(
                        fileAsText,
                        "image/svg+xml",
                    );
                    const svg = fileAsSvg.getElementsByTagName("svg")[0];

                    if (svg) {
                        width =
                            svg.width.baseVal.value ||
                            svg.viewBox.baseVal.width;
                        height =
                            svg.height.baseVal.value ||
                            svg.viewBox.baseVal.height;
                    }
                }

                this.width = width;
                this.height = height;

                if (this.scaled) {
                    const imageParent = image.parentElement;

                    if (imageParent) {
                        const imageRatio = width / height;
                        const pictureWidth = imageParent.offsetWidth;
                        const pictureHeight = imageParent.offsetHeight;
                        const pictureArea = pictureWidth * pictureHeight;
                        const pictureRatio = pictureWidth / pictureHeight;
                        const area =
                            imageRatio >= pictureRatio
                                ? pictureWidth * height * (pictureWidth / width)
                                : pictureHeight * width * (pictureHeight / height);
                        const areaRatio = area / pictureArea;
                        const minScale = 0.4;
                        const scale =
                            Math.round(
                                ((1 - areaRatio) * (1 - minScale) + minScale) *
                                    100,
                            ) / 100;

                        image.style.transform = `scale(${scale})`;
                        image.style.transformOrigin = "center";
                    }
                }

                // remove the placeholder (v-else triggers too early)
                if (this.$slots.default && this.$slots.default.length > 0) {
                    for (const slot of this.$slots.default) {
                        (slot.elm as HTMLElement).style.display = "none";
                    }
                }

                // object-fit polyfill
                if (
                    typeof window.objectFitPolyfill === "function" &&
                    isOutdatedBrowser &&
                    ext !== "svg" &&
                    this.isCover
                ) {
                    window.objectFitPolyfill(image);
                }

                this.isLoaded = true;
            });
        }

        if (this.video) {
            const video = this.$el.querySelector("video");

            if (video) {
                // object-fit polyfill
                if (
                    typeof window.objectFitPolyfill === "function" &&
                    isOutdatedBrowser &&
                    this.isCover
                ) {
                    window.objectFitPolyfill(video);
                }
            }
        }
    }
}

function getNumber(value: string | number): number | undefined {
    const result = /^(\d)+/.exec(value.toString());

    return result ? parseInt(result[0], 10) : undefined;
}

function restrictSources(data: any, max: number | string): any {
    const maxWidth = getNumber(max);

    if (maxWidth == undefined || maxWidth === 0) {
        return data;
    }

    const newSources: { [propName: string]: string } = {};
    const sourcesKeys = Object.keys(data);
    const sortedKeys = sourcesKeys.sort(
        (a: string, b: string): number => {
            const aNum = a === "all" ? Infinity : getNumber(a) || 0;
            const bNum = b === "all" ? Infinity : getNumber(b) || 0;

            return aNum <= bNum ? -1 : 1;
        },
    );

    for (const key of sortedKeys) {
        const keyNumber = getNumber(key) || Infinity;

        if (keyNumber <= maxWidth) {
            newSources[key] = data[key];
        } else {
            // tslint:disable-next-line:no-string-literal
            newSources["all"] = data[key];

            break;
        }
    }

    return newSources;
}

async function getPictureSource(data: any): Promise<string> {
    // await validateSources(data);

    const pixelRatio = window.devicePixelRatio || 1;
    const sourcesInfos: Array<{ pxr: number; src: string }> = [];
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
        throw new Error("no srcset found");
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
        } else if (rules.length > 1) {
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

            if (pxr1 < pxr2) {
                return -1;
            }
            if (pxr1 > pxr2) {
                return 1;
            }

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

        return validatedSource;
    }

    throw new Error("unable to define a source");
}
