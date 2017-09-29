import * as Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component
class ImportAsync extends Vue {
    @Prop({ type: String, required: true }) public href: string;

    public render(createElement: Vue.CreateElement): Vue.VNode | undefined {
        const url: string = (<any>window).encodeURI(this.href);

        if (url != undefined) {
            // get file extension
            const ext = url.slice((url.lastIndexOf(".") - 1 >>> 0) + 2);

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

        return;
    }
}

export { ImportAsync };
