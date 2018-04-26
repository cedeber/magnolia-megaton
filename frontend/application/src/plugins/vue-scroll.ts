import { PluginObject } from "vue";
import taggr from "../devtools/taggr";
import scrollIntoViewport from "../helpers/scroll-into-viewport";

interface Scroll {
    speed?: number;
    topMargin?: number;
    bezier?: number[];
    callback?: Function;
}

const log = taggr("vue-scroll");

/**
 * Create a new v-scroll directive
 * Take the value as CSS selector and create a click event to the current DOM Node
 * On click, will scroll to the declared Element
 * @example <div v-scroll="#anId .aClass">go to</div>
 * @type {PluginObject<Scroll>}
 */
const Scroll: PluginObject<Scroll> = {
    install(Vue, options) {
        log.info("plugin installed");

        Vue.directive("scroll", {
            bind(el: HTMLElement, binding: any) {
                const goto = document.querySelector(binding.value);

                if (!goto) {
                    log.error(`'${binding.value}' was not found`);
                    return;
                }

                el.addEventListener("click", event => {
                    log.list(goto).info("go flight");
                    event.preventDefault();
                    options = options || {};
                    scrollIntoViewport(
                        options.topMargin,
                        options.speed,
                        options.bezier,
                    )(goto).then((done: boolean) => {
                        if (
                            done &&
                            typeof (options as any).callback === "function"
                        ) {
                            (options as any).callback();
                        }
                    });
                });
            },
        });
    },
};

export default Scroll;
