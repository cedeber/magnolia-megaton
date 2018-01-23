/* --- Shell --- */
// Extracted separatly by webpack, see webpack.config.js. Injected by FreeMarker
import "./shell.css";

/* --- Styles --- */
// In webpack.config.js you can choose to extract it thanks to the `extractCSS` var
// If extractCSS == false, the CSS is injected into the HTML by style-loader
import "./styles/webfonts.css";
import "./styles/base.css";
import "./styles/article.css";
import "./styles/breadcrumbs.css";

/* --- Application --- */
import Vue from "vue";
import taggr from "./devtools/taggr";

/* --- Components --- */
// If a Vue (*.vue) component exists, import only it.
// The related CSS and TS are linked into the Vue component
import LazyMedia from "./components/lazy-media";
import Carousel from "./components/carousel";
import GoogleMap from "./components/google-map.vue";

// Keep it! If you build the app with NODE_ENV == "production", it won't log.
taggr().info("Your application is running in development mode.");

// Create the vue instance
const vm = new Vue({});

// Declare all components, on all pages
Vue.component("lazy-media", LazyMedia);
Vue.component("multi-carousel", Carousel);
Vue.component("google-map", GoogleMap);

// Connect the Vue intance to the whole <main id="view"> container
// Avoid to use the standard DOM API as a virtual-dom will handle it
vm.$mount("#view");

/* --- Web Worker --- */
const helloWorker = new Worker("/worker-hello.js");
const logw = taggr("worker-demo");

helloWorker.onmessage = (event: MessageEvent) => {
    logw.info(event.data);
};

helloWorker.postMessage("world");
