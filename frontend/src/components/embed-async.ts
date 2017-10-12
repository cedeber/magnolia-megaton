import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({
    template: `<div embed-async="true" v-html="content"></div>`,
})
class EmbedAsync extends Vue {
    @Prop({ type: String, required: true }) public href: string; // File link to load
    public content: string = ""; // File content

    public mounted() {
        fetch(this.href, { credentials: "include" }).
            then(response => response.ok ? response.text() : Promise.reject(response.statusText)).
            then(text => this.content = text).
            catch(_unusedError => { /* empty */ });
    }
}

export { EmbedAsync };
