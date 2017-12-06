/* --- Styles --- */
import "./css-shell/main.css";
import "./page-styles/base.css";
import "./page-styles/article.css";
import "./page-styles/breadcrumbs.css";

/* --- Application --- */
import Vue from "vue";
import LazyMedia from "./components/lazy-media";
import { Carousel } from "./components/carousel";

import LoadingPage from "./components/loading-page.vue";

const vm = new Vue({});

Vue.component("lazy-media", LazyMedia);
Vue.component("multi-carousel", Carousel);
Vue.component("loading-page", LoadingPage);

vm.$mount("#view");

/* Service Workers */
async function registerServiceWorker() {
    try {
        const registration = await navigator.serviceWorker.register("/sw.js", {scope: "/"});

        console.log(`ServiceWorker registration successful with scope: ${registration.scope}`);
    }
    catch (error) {
        console.log(`ServiceWorker registration failed: ${error}`);
    }
}

if ("serviceWorker" in navigator) { registerServiceWorker(); }
