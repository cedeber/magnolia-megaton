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
import { loadJS } from '../../helpers/async-loader';
let GoogleMap = class GoogleMap extends Vue {
    constructor() {
        super(...arguments);
        this.isLoaded = false;
    }
    onLatChanged(newVal) {
        if (this.isLoaded && newVal !== 0 && this.long !== 0) {
            this.moveMap();
        }
    }
    onLongChanged(newVal) {
        if (this.isLoaded && newVal !== 0 && this.lat !== 0) {
            this.moveMap();
        }
    }
    async mounted() {
        if (!this.apiKey) {
            return;
        }
        window.google = window.google || {};
        if (!window.google.isMapsAlreadyLoading && !window.google.maps) {
            await loadJS(`https://maps.googleapis.com/maps/api/js?key=${this.apiKey}`);
            window.google.isMapsAlreadyLoading = true;
        }
        this.initMap();
    }
    moveMap() {
        const coords = new google.maps.LatLng(this.lat, this.long);
        google.maps.event.trigger(this.map, "resize");
        if (this.map) {
            this.map.setCenter(coords);
        }
        if (this.marker) {
            this.marker.setPosition(coords);
        }
    }
    async initMap() {
        let styles;
        if (this.personalized) {
            styles = await fetch(this.stylesPath, { credentials: "include" })
                .then(response => response.json())
                .catch(() => { });
        }
        this.map = new google.maps.Map(this.$el.querySelector(".map"), {
            gestureHandling: "cooperative",
            clickableIcons: false,
            zoom: this.zoom,
            center: { lat: 0, lng: 0 },
            styles,
        });
        const icon = this.markerIcon && typeof this.markerIcon === "string"
            ? {
                url: this.markerIcon,
                scaledSize: new google.maps.Size(this.markerWidth, this.markerHeight),
                anchor: new google.maps.Point(this.markerWidth / 2, this.markerHeight),
            }
            : undefined;
        this.marker = new google.maps.Marker({
            position: { lat: 0, lng: 0 },
            icon,
            map: this.map,
            optimized: false,
        });
        const infoElement = this.$slots.default[0].elm;
        if (infoElement && infoElement.innerText.trim() !== "") {
            const content = infoElement.cloneNode(true);
            content.removeAttribute("hidden");
            const infoWindow = new google.maps.InfoWindow({ content });
            google.maps.event.addListener(this.marker, "click", () => infoWindow.open(this.map, this.marker));
        }
        this.isLoaded = true;
        if (this.lat !== 0 && this.long !== 0) {
            this.moveMap();
        }
    }
};
__decorate([
    Prop({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], GoogleMap.prototype, "lat", void 0);
__decorate([
    Prop({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], GoogleMap.prototype, "long", void 0);
__decorate([
    Prop({ type: Number, default: 50 }),
    __metadata("design:type", Number)
], GoogleMap.prototype, "scale", void 0);
__decorate([
    Prop({ type: Number, default: 15 }),
    __metadata("design:type", Number)
], GoogleMap.prototype, "zoom", void 0);
__decorate([
    Prop({ type: String, default: null }),
    __metadata("design:type", Object)
], GoogleMap.prototype, "apiKey", void 0);
__decorate([
    Prop({ type: String, default: null }),
    __metadata("design:type", Object)
], GoogleMap.prototype, "markerIcon", void 0);
__decorate([
    Prop({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], GoogleMap.prototype, "markerWidth", void 0);
__decorate([
    Prop({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], GoogleMap.prototype, "markerHeight", void 0);
__decorate([
    Prop({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], GoogleMap.prototype, "personalized", void 0);
__decorate([
    Prop({ type: String, default: "" }),
    __metadata("design:type", String)
], GoogleMap.prototype, "stylesPath", void 0);
__decorate([
    Watch("lat"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], GoogleMap.prototype, "onLatChanged", null);
__decorate([
    Watch("long"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], GoogleMap.prototype, "onLongChanged", null);
GoogleMap = __decorate([
    Component
], GoogleMap);
export default GoogleMap;
//# sourceMappingURL=google-map.js.map