import * as Vue from "vue";
import "./config/loading-animations";
import { LazyPicture } from "./components/lazy-picture";
import { Carousel } from "./components/carousel";

const vm = new Vue({});

Vue.component("lazy-picture", LazyPicture);
Vue.component("multi-carousel", Carousel);

vm.$mount("#view");
