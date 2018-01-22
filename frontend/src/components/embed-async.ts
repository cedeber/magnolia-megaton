import { Vue, Component, Prop } from "vue-property-decorator";
import taggr from "../devtools/taggr";

const log = taggr("embed-async");

/**
 * @example
 * <embed-async href="a-file.html"></embed-async>
 */
@Component
class EmbedAsync extends Vue {
    @Prop({ type: String, required: true })
    public href: string; // File link to load

    public content: string = ""; // File content

    public mounted() {
        if (this.href != undefined) {
            fetch(this.href, {credentials: "include"})
                .then(response => (response.ok ? response.text() : Promise.reject(response.statusText)))
                .then(text => {
                    this.content = text;
                    log.info(`'${this.href}' embed`);
                })
                .catch(error => {
                    log.list(error).error("error occured");
                });
        } else {
            log.error("no href");
        }
    }
}

export default EmbedAsync;
