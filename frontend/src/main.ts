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
