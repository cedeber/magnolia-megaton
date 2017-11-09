import Vue from "vue";
import Component from "vue-class-component";

import "./lazy-media.css";

/*
interface LazyResult {
    height: number; // Height of the fetched image
    source: string; // Source of the fetched image
    width: number; // Width of the fetched image
}
*/

@Component
class LazyMedia extends Vue {
    public source = "";
    public width: string | number = "100%";
    public height: string | number = "100%";

    public mounted() {
        const observer = new IntersectionObserver(entries => {
            // [FIXME] remove <any> once IntersectionObserver will be valid
            if (!(<any>entries[0]).isIntersecting) { return; }

            observer.disconnect();

            this.source = this.getSource();

            /*
            this.fetch().then(result => {
                this.source = result.source;
                this.width = result.width;
                this.height = result.height;
            });
            */
        });
        observer.observe(this.$el);
    }

    /*
    public updated() {
        if (typeof window.objectFitPolyfill === "function") {
            const image = this.$el.querySelector("img");
            if (image) { window.objectFitPolyfill(image); }
        }
    }
    */

    /*
    public fetch(): Promise<LazyResult> {
        const source = this.getSource();

        return new Promise((resolve, reject) => {
            const image = new Image();

            async function onLoad(this: HTMLImageElement) {
                let width = this.naturalWidth;
                let height = this.naturalHeight;

                // Firefox doesn't support .natural* getter for SVG
                if (width === 0 && height === 0) {
                    const parser = new DOMParser();
                    const file = await fetch(this.src, { credentials: "include" });
                    const fileAsText = await file.text();
                    const fileAsSvg = parser.parseFromString(fileAsText, "image/svg+xml");
                    const svg = fileAsSvg.getElementsByTagName("svg")[0];

                    if (svg) {
                        width = svg.width.baseVal.value || svg.viewBox.baseVal.width;
                        height = svg.height.baseVal.value || svg.viewBox.baseVal.height;
                    }
                }

                resolve({ height, source, width } as LazyResult);
            }

            image.addEventListener("load", onLoad);
            image.addEventListener("error", reject);
            image.src = source;
        });
    }
    */

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

export { LazyMedia };
