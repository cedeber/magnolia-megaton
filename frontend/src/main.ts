import Vue from "vue";
import { LazyPicture } from "./scripts/components/lazy-picture";
import { Carousel } from "./scripts/components/carousel";

import LoadingPage from "./scripts/components/loading-page.vue";

import "./styles/_shell.css";
import "./styles/base.css";

const vm = new Vue({});

Vue.component("lazy-picture", LazyPicture);
Vue.component("multi-carousel", Carousel);
Vue.component("loading-page", LoadingPage);

vm.$mount("#view");
