import "./styles/main.css";
import Vue from "vue";
import VueScroll from "./plugins/vue-scroll";
Vue.use(VueScroll);
import CookieBanner from './components/cookie-banner.vue';
import LazyMedia from "./components/lazy-media.vue";
import SingleCarousel from "./components/single-carousel.vue";
import GoogleMap from "./components/google-map.vue";
import FormSelect from "./components/form-select.vue";
import CustomForm from "./components/customForm";
import ToggleField from "./components/toggle-field";
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
            }
            else {
                document.documentElement.classList.remove("is-not-scrollable");
            }
        },
    },
});
Vue.component("cookie-banner", CookieBanner);
Vue.component("lazy-media", LazyMedia);
Vue.component("single-carousel", SingleCarousel);
Vue.component("google-map", GoogleMap);
Vue.component("custom-form", CustomForm);
Vue.component("toggle-field", ToggleField);
Vue.component('form-select', FormSelect);
vm.$mount("#view");
//# sourceMappingURL=main.js.map