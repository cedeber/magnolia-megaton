import Vue, { CreateElement, VNode } from "vue";
import { Component, Prop } from "vue-property-decorator";
import taggr from "../devtools/taggr";

const log = taggr("import-async");

/**
 * @example
 * <import-async href="./a-file.css"></import-async>
 */
@Component
class ImportAsync extends Vue {
    @Prop({ type: String, required: true })
    public href?: string; // src or href, js or css

    /**
     *
     * @param {CreateElement} createElement Render function
     * @returns {VNode | undefined}
     */
    public render(createElement: CreateElement): VNode | undefined {
        if (this.href != undefined) {
            const url: string = window.encodeURI(this.href);
            // tslint:disable-next-line:no-bitwise
            const ext = url.slice(((url.lastIndexOf(".") - 1) >>> 0) + 2);

            log.info(`'${this.href}' will be loaded`);

            switch (ext) {
                case "css":
                    return createElement("link", {
                        attrs: {
                            href: url,
                            rel: "stylesheet",
                        },
                    });

                case "js":
                    return createElement("script", {
                        attrs: {
                            src: url,
                        },
                    });
            }
        }

        log.error("no href");
        return;
    }
}

export { ImportAsync };
