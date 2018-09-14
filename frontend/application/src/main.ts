/* --- Shell --- */
// Extracted separately by webpack, see webpack.config.js. Injected by FreeMarker
import "./shell/shell.css";

/* --- Styles --- */
import "./styles/base.css";
import "./styles/article.css";
import "./styles/form.css";

/* --- Application --- */
import Vue from "vue";
import VueScroll from "./plugins/vue-scroll";

Vue.use(VueScroll);

/* --- Components --- */
// If a Vue (*.vue) component exists, import only it.
// The related CSS and TS are linked into the Vue component
import LazyMedia from "./components/lazy-media.vue";
import SingleCarousel from "./components/single-carousel.vue";
import GoogleMap from "./components/google-map.vue";
import FormSelect from "./components/form-select.vue";
import CustomForm from "./components/customForm";
import ToggleField from "./components/toggle-field";

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
Vue.component("single-carousel", SingleCarousel);
Vue.component("google-map", GoogleMap);
Vue.component("custom-form", CustomForm);
Vue.component("toggle-field", ToggleField);
Vue.component('form-select', FormSelect);

// Connect the Vue intance to the whole <main id="view"> container
// Avoid to use the standard DOM API as a virtual-dom will handle it
vm.$mount("#view");
