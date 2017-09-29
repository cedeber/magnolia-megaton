import * as VueInterface from "vue";
import "../utils/scroll-into-viewport";

interface Scroll {
    speed?: number;
    marginTop?: number;
    callback?: string | Function;
    scrollable?: Element | Window;
}

const Scroll = {
    install(Vue, options) {
        Vue.directive("scroll", {
            bind(el: HTMLElement, binding: any) {
                const goto = document.querySelector(binding.value);

                if (!goto) { return; }

                el.addEventListener("click", event => {
                    event.preventDefault();
                    goto.scrollIntoViewport(options || {});
                });
            },
        });
    },
} as VueInterface.PluginObject<Scroll>;

export { Scroll };
