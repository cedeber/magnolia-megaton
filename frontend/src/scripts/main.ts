import Vue from "vue";
import { LazyPicture } from "./components/lazy-picture";
import { Carousel } from "./components/carousel";

import LoadingPage from "./components/loading-page.vue";

const vm = new Vue({});

Vue.component("lazy-picture", LazyPicture);
Vue.component("multi-carousel", Carousel);
Vue.component("loading-page", LoadingPage);

vm.$mount("#view");
