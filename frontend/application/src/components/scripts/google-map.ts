import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import loadJS from "../../helpers/load-js";
import taggr from "../../devtools/taggr";

const log = taggr("google-map");

/* [TODO] Watch slot changes */

@Component
class GoogleMap extends Vue {
    @Prop({ type: Number, default: 0 })
    public lat!: number;

    @Prop({ type: Number, default: 0 })
    public long!: number;

    @Prop({ type: Number, default: 50 })
    public scale!: number;

    @Prop({ type: Number, default: 15 })
    public zoom!: number;

    @Prop({ type: String, default: null })
    public apiKey!: string | null;

    @Prop({ type: String, default: null })
    public markerIcon!: string | null;

    @Prop({ type: Number, default: 0 })
    public markerWidth!: number;

    @Prop({ type: Number, default: 0 })
    public markerHeight!: number;

    public isLoaded: boolean = false;
    public map?: google.maps.Map;
    public marker?: google.maps.Marker;

    @Watch("lat")
    public onLatChanged(newVal: number) {
        if (this.isLoaded && newVal !== 0 && this.long !== 0) {
            this.moveMap();
        }
    }

    @Watch("long")
    public onLongChanged(newVal: number) {
        if (this.isLoaded && newVal !== 0 && this.lat !== 0) {
            this.moveMap();
        }
    }

    public async mounted() {
        if (!this.apiKey) {
            log.error("no API key provided. https://console.developers.google.com/apis/");
            return;
        }

        window.google = window.google || {};

        if (!window.google.isMapsAlreadyLoading && !window.google.maps) {
            window.google.isMapsAlreadyLoading = true;
            await loadJS(`https://maps.googleapis.com/maps/api/js?key=${this.apiKey!}`);
        }

        this.initMap();
    }

    /**
     * Center the map in case lat, long or other properties changed
     */
    public moveMap() {
        const coords = new google.maps.LatLng(this.lat, this.long);
        google.maps.event.trigger(this.map, "resize");

        if (this.map) {
            this.map.setCenter(coords);
        }

        if (this.marker) {
            this.marker.setPosition(coords);
        }
    }

    /**
     * Setup Google Map
     */
    public initMap() {
        // Create Map
        this.map = new google.maps.Map(this.$el.querySelector(".map"), {
            gestureHandling: "cooperative",
            clickableIcons: false,
            zoom: this.zoom,
            center: { lat: 0, lng: 0 },
            // Custom styling from https://mapstyle.withgoogle.com/
            // styles: [],
        });

        // Create Icon
        const icon =
            this.markerIcon && typeof this.markerIcon === "string"
                ? ({
                      url: this.markerIcon,
                      scaledSize: new google.maps.Size(this.markerWidth, this.markerHeight),
                      anchor: new google.maps.Point(this.markerWidth / 2, this.markerHeight),
                  } as google.maps.Icon)
                : undefined;

        this.marker = new google.maps.Marker({
            position: { lat: 0, lng: 0 },
            icon,
            map: this.map,
            optimized: false,
        });

        if (icon) {
            log.info(`Personalized marker (${this.markerWidth}×${this.markerHeight}px)`);
        }

        // Create Info Window
        const infoElement = this.$slots.default[0].elm as HTMLElement;

        if (infoElement && infoElement.innerText.trim() !== "") {
            const content = infoElement.cloneNode(true) as HTMLElement;
            content.removeAttribute("hidden");

            const infoWindow = new google.maps.InfoWindow({ content });
            google.maps.event.addListener(this.marker, "click", () => infoWindow.open(this.map, this.marker));

            log.list(content).info("info window opened");
        }

        log.list(this.$el).success("initialized");

        this.isLoaded = true;
        if (this.lat !== 0 && this.long !== 0) {
            this.moveMap();
        }
    }
}

export default GoogleMap;
