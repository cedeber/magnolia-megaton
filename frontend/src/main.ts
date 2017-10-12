import Vue from "vue";
import { LazyPicture } from "./components/lazy-picture";
import { Carousel } from "./components/carousel";

import LoadingPage from "./components/loading-page.vue";

import "./css-shell/main.css";
import "./page-styles/base.css";
import "./page-styles/article.css";
import "./page-styles/breadcrumbs.css";

const vm = new Vue({});

Vue.component("lazy-picture", LazyPicture);
Vue.component("multi-carousel", Carousel);
Vue.component("loading-page", LoadingPage);

vm.$mount("#view");
