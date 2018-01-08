import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import loadJS from "../helpers/load-js";

import "./gmap.css";

@Component
class GMap extends Vue {
    @Prop({ type: Number, default: 0 }) public lat: number;
    @Prop({ type: Number, default: 0 }) public long: number;
    @Prop({ type: Number, default: 50 }) public scale: number;
    @Prop({ type: Number, default: 15 }) public zoom: number;
    @Prop({ type: String, default: null }) public apiKey: string | null;
    @Prop({ type: String, default: null }) public infoWindowContent: string | null;
    @Prop({ type: String, default: null }) public markerIcon: string | null;
    @Prop({ type: Number, default: 20 }) public markerWidth: number;
    @Prop({ type: Number, default: 30 }) public markerHeight: number;

    public isLoaded: boolean = false;
    public map: google.maps.Map;
    public marker: google.maps.Marker;
    public icon: google.maps.Icon;

    @Watch("lat")
    public onLatChanged(newVal: number) {
        if (this.isLoaded && newVal !== 0 && this.long !== 0) { this.moveMap(); }
    }

    @Watch("long")
    public onLongChanged(newVal: number) {
        if (this.isLoaded && newVal !== 0 && this.lat !== 0) { this.moveMap(); }
    }

    public async mounted() {
        if (!this.apiKey) { return; }

        window.google = {};
        await loadJS(`https://maps.googleapis.com/maps/api/js?key=${this.apiKey!}`);
        this.initMap();
    }

    public moveMap() {
        const coords = new google.maps.LatLng(this.lat, this.long);
        google.maps.event.trigger(this.map, "resize");
        this.map.setCenter(coords);
        this.marker.setPosition(coords);
    }

    public initMap() {
        this.map = new google.maps.Map(this.$el, {
            gestureHandling: "cooperative",
            clickableIcons: false,
            zoom: this.zoom,
            center: { lat: 0, lng: 0 },
            // Add custom styling with https://mapstyle.withgoogle.com/
            /* styles: [
                {
                    elementType: "geometry",
                    stylers: [
                        {
                            color: "#f5f5f5",
                        },
                    ],
                },
             ], */
        });

        if(this.markerIcon !== null) {
            this.icon = {
                url: window.$$currentPath + this.markerIcon,
                scaledSize: new google.maps.Size(this.markerWidth, this.markerHeight),
            };
        }


        // Create markers.
        this.marker = new google.maps.Marker({
            position: { lat: 0, lng: 0 },
            icon: this.icon,
            map: this.map,
        });


        // Create info window
        if (this.infoWindowContent !== null){
            const infoWindow = new google.maps.InfoWindow({
                content: this.infoWindowContent,
            });

            const marker = this.marker;
            const map = this.map;
            const infoWindowContent = this.infoWindowContent;
            google.maps.event.addListener(this.marker, "click", function() {
                map.setCenter(marker.getPosition());
                infoWindow.setContent(infoWindowContent);
                infoWindow.open(map, marker);
            });
        }

        this.isLoaded = true;
        if (this.lat !== 0 && this.long !== 0) { this.moveMap(); }
    }
}

export default GMap;
