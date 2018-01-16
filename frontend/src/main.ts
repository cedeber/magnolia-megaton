/* --- Shell --- */
import "./shell.css"; // Extracted separatly by webpack, see webpack.config.js. Injected by FreeMarker

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
import GoogleMap from "./components/google-map.vue";

// Keep it! If you build the app with NODE_ENV = "production", it won't log.
taggr().info("Your application is running in development mode.");

const vm = new Vue({});

Vue.component("lazy-media", LazyMedia);
Vue.component("multi-carousel", Carousel);
Vue.component("loading-page", LoadingPage);
Vue.component("google-map", GoogleMap);

vm.$mount("#view");
