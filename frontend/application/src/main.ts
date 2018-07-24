/* --- Shell --- */
// Extracted separately by webpack, see webpack.config.js. Injected by FreeMarker
import "./shell/shell.css";

/* --- Styles --- */
import "./styles/base.css";
import "./styles/article.css";

/* --- Application --- */
import Vue from "vue";
import taggr from "./devtools/taggr";

/* --- Components --- */
// If a Vue (*.vue) component exists, import only it.
// The related CSS and TS are linked into the Vue component
import LazyMedia from "./components/lazy-media.vue";
import Carousel from "./components/carousel";
import GoogleMap from "./components/google-map.vue";

// Keep it! If you build the app with NODE_ENV == "production", it won't log.
taggr().warning("Your application is running in development mode.");

// Create the vue instance
const vm = new Vue({
    data() {
        return {
            isMenuOpen: false,
        };
    },
    methods: {
        toggleMenu() {
            this.isMenuOpen = !this.isMenuOpen;

            if (this.isMenuOpen) {
                document.documentElement.classList.add("is-not-scrollable");
            } else {
                document.documentElement.classList.remove("is-not-scrollable");
            }
        },
    },
});

// Declare all components, on all pages
Vue.component("lazy-media", LazyMedia);
Vue.component("multi-carousel", Carousel);
Vue.component("google-map", GoogleMap);

// Connect the Vue intance to the whole <main id="view"> container
// Avoid to use the standard DOM API as a virtual-dom will handle it
vm.$mount("#view");
