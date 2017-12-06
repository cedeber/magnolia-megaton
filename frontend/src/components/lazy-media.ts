import "./lazy-media.css";

import { Vue, Component, Prop } from "vue-property-decorator";
import { isOutdatedBrowser } from "../helpers/outdated-browser";

@Component
class LazyMedia extends Vue {
    @Prop({type: Boolean, default: false}) public instantly: boolean;
    @Prop({type: Boolean, default: false}) public isCover: boolean;

    public source = "";
    public width: string | number = "100%";
    public height: string | number = "100%";
    public isLoaded = false;

    public mounted() {
        if (this.instantly) { this.source = this.getSource(); }
        else {
            const observer = new IntersectionObserver(entries => {
                // [FIXME] remove <any> once IntersectionObserver will be valid
                if (!(<any>entries[0]).isIntersecting) { return; }

                observer.disconnect();
                this.source = this.getSource();
            });
            observer.observe(this.$el);
        }
    }

    public updated() {
        const image = this.$el.querySelector("img");

        if (image) {
            const source = image.getAttribute("src") || "";
            const ext = source.slice((source.lastIndexOf(".") - 1 >>> 0) + 2);

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
                if (typeof window.objectFitPolyfill === "function" && isOutdatedBrowser && ext !== "svg" && this.isCover) {
                    window.objectFitPolyfill(image);
                }

                this.isLoaded = true;
            });
        }
    }

    public getSource(): string {
        const sources = this.$el.querySelectorAll("source");
        const pixelRatio = window.devicePixelRatio || 1;
        const sourcesInfos: Array<{pxr: number, src: string}> = [];
        let srcset: string = "";

        // Get the srcset that match the media query
        for (const source of <HTMLSourceElement[]><any>sources) {
            const media = source.getAttribute("media");

            if (window.matchMedia(media || "all").matches) {
                srcset = source.getAttribute("srcset") || "";
                break;
            }
        }

        if (srcset === "") { return ""; }

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
            let ret = sourcesInfos[sourcesInfos.length - 1].src;

            for (let i = 0, l = sourcesInfos.length; i < l; i += 1) {
                const source = sourcesInfos[i];

                ret = source.src;
                if (source.pxr >= pixelRatio) {
                    break;
                }
            }

            return ret;
        }

        return "";
    }
}

export default LazyMedia;