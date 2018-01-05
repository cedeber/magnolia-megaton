/* --- Styles --- */
import "./styles/webfonts.css";
import "./styles/base.css";
import "./styles/article.css";
import "./styles/breadcrumbs.css";

/* --- Application --- */
import Vue from "vue";
import LazyMedia from "./components/lazy-media";
import { Carousel } from "./components/carousel";
import LoadingPage from "./components/loading-page.vue";
import taggr from "./devtools/taggr";

// Keep it! If you build the app with NODE_ENV = "production", it won't log.
taggr().info("Your application is running in development mode.");

const vm = new Vue({});

Vue.component("lazy-media", LazyMedia);
Vue.component("multi-carousel", Carousel);
Vue.component("loading-page", LoadingPage);

vm.$mount("#view");

/* Service Workers */
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw-default.js", {scope: "/"})
}
