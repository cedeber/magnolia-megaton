var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
const IEdgeMatches = /(Edge|Trident)\/(\d.)/i.exec(navigator.userAgent);
const isOutdatedBrowser = IEdgeMatches != null;
let LazyMedia = class LazyMedia extends Vue {
    constructor() {
        super(...arguments);
        this.source = "";
        this.width = "100%";
        this.height = "100%";
        this.isLoaded = false;
        this.observer = null;
        this.video = null;
        this.picture = null;
        this.metadata = {};
    }
    onPathChanged() {
        this.init();
    }
    mounted() {
        this.init();
    }
    async init() {
        let data = this.content;
        let source = "";
        if (data == undefined) {
            const response = await fetch(this.path, { credentials: "include" });
            data = await response.json();
        }
        if (!data) {
            throw new Error("json is void");
        }
        this.video = data.video || null;
        this.picture = data.picture || null;
        this.metadata = data.metadata || null;
        if (this.maxWidth && this.maxWidth > 0 && this.picture) {
            this.picture.sources = restrictSources(this.picture.sources, this.maxWidth);
        }
        source = this.video
            ? this.video.link || ""
            : await getPictureSource(this.picture.sources);
        if (!this.ratio && this.isCover && this.simRatio && isOutdatedBrowser) {
            this.ratio = this.simRatio;
        }
        if (this.ratio) {
            this.$el.style.paddingTop =
                `calc(1 / (${this.ratio.w} / ${this.ratio.h}) * 100%)`;
        }
        if (this.isInstantly) {
            this.source = source;
        }
        else {
            if (this.observer != null) {
                this.observer.disconnect();
                this.observer = null;
            }
            this.observer = new IntersectionObserver(entries => {
                if (!entries[0].isIntersecting) {
                    return;
                }
                if (this.observer != null) {
                    this.observer.disconnect();
                    this.observer = null;
                }
                this.source = source;
            }, {
                rootMargin: "100px 100px 667px 100px",
            });
            this.observer.observe(this.$el);
        }
    }
    updated() {
        const image = this.$el.querySelector("img");
        if (image) {
            const source = image.getAttribute("src") || "";
            const ext = source.slice(((source.lastIndexOf(".") - 1) >>> 0) + 2);
            image.addEventListener("load", async () => {
                let width = image.naturalWidth;
                let height = image.naturalHeight;
                if (ext === "svg") {
                    const parser = new DOMParser();
                    const file = await fetch(this.source, {
                        credentials: "include",
                    });
                    const fileAsText = await file.text();
                    const fileAsSvg = parser.parseFromString(fileAsText, "image/svg+xml");
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
                        const area = imageRatio >= pictureRatio
                            ? pictureWidth * height * (pictureWidth / width)
                            : pictureHeight * width * (pictureHeight / height);
                        const areaRatio = area / pictureArea;
                        const minScale = 0.4;
                        const scale = Math.round(((1 - areaRatio) * (1 - minScale) + minScale) *
                            100) / 100;
                        image.style.transform = `scale(${scale})`;
                        image.style.transformOrigin = "center";
                    }
                }
                if (this.$slots.default && this.$slots.default.length > 0) {
                    for (const slot of this.$slots.default) {
                        slot.elm.style.display = "none";
                    }
                }
                if (typeof window.objectFitPolyfill === "function" &&
                    isOutdatedBrowser &&
                    ext !== "svg" &&
                    this.isCover) {
                    window.objectFitPolyfill(image);
                }
                this.isLoaded = true;
            });
        }
        if (this.video) {
            const video = this.$el.querySelector("video");
            if (video) {
                if (typeof window.objectFitPolyfill === "function" &&
                    isOutdatedBrowser &&
                    this.isCover) {
                    window.objectFitPolyfill(video);
                }
            }
        }
    }
};
__decorate([
    Prop({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], LazyMedia.prototype, "isInstantly", void 0);
__decorate([
    Prop({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], LazyMedia.prototype, "isCover", void 0);
__decorate([
    Prop({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], LazyMedia.prototype, "hasCaption", void 0);
__decorate([
    Prop({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], LazyMedia.prototype, "isAutoplay", void 0);
__decorate([
    Prop({ type: String, default: "is-center" }),
    __metadata("design:type", String)
], LazyMedia.prototype, "position", void 0);
__decorate([
    Prop({ type: String, default: "" }),
    __metadata("design:type", String)
], LazyMedia.prototype, "path", void 0);
__decorate([
    Prop({ type: Object, default: null }),
    __metadata("design:type", Object)
], LazyMedia.prototype, "content", void 0);
__decorate([
    Prop({ type: Object, default: null }),
    __metadata("design:type", Object)
], LazyMedia.prototype, "ratio", void 0);
__decorate([
    Prop({ type: Object, default: null }),
    __metadata("design:type", Object)
], LazyMedia.prototype, "simRatio", void 0);
__decorate([
    Prop({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], LazyMedia.prototype, "scaled", void 0);
__decorate([
    Prop({ type: Number, default: -1 }),
    __metadata("design:type", Number)
], LazyMedia.prototype, "maxWidth", void 0);
__decorate([
    Watch("path"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LazyMedia.prototype, "onPathChanged", null);
LazyMedia = __decorate([
    Component
], LazyMedia);
export default LazyMedia;
function getNumber(value) {
    const result = /^(\d)+/.exec(value.toString());
    return result ? parseInt(result[0], 10) : undefined;
}
function restrictSources(data, max) {
    const maxWidth = getNumber(max);
    if (maxWidth == undefined || maxWidth === 0) {
        return data;
    }
    const newSources = {};
    const sourcesKeys = Object.keys(data);
    const sortedKeys = sourcesKeys.sort((a, b) => {
        const aNum = a === "all" ? Infinity : getNumber(a) || 0;
        const bNum = b === "all" ? Infinity : getNumber(b) || 0;
        return aNum <= bNum ? -1 : 1;
    });
    for (const key of sortedKeys) {
        const keyNumber = getNumber(key) || Infinity;
        if (keyNumber <= maxWidth) {
            newSources[key] = data[key];
        }
        else {
            newSources["all"] = data[key];
            break;
        }
    }
    return newSources;
}
async function getPictureSource(data) {
    const pixelRatio = window.devicePixelRatio || 1;
    const sourcesInfos = [];
    let srcset = "";
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
    const sourceDefinitions = srcset.split(",");
    for (const definition of sourceDefinitions) {
        const def = definition.trim().replace(/\s{2,}/g, " ");
        const rules = def.split(" ");
        if (rules.length === 1) {
            sourcesInfos.push({
                pxr: 1,
                src: rules[0],
            });
        }
        else if (rules.length > 1) {
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
        sourcesInfos.sort((hash1, hash2) => {
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
//# sourceMappingURL=lazy-media.js.map