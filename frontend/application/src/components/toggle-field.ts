import { Vue, Component, Prop, Watch } from "vue-property-decorator";

@Component
export default class ToggleField extends Vue {
    @Prop({ type: String, default: "" })
    defaultValue!: string;

    @Prop({ default: null })
    reportTo!: any;

    isActive = false;
    content = "";

    mounted() {
        if (this.defaultValue !== "") {
            this.content = this.defaultValue;
            this.isActive = !this.isActive;
        }
    }

    @Watch('content')
    onContentChange(value) {
        this.$parent[this.reportTo] = value;
    }

    toggleActive() {
        if (this.content === "") {
            this.isActive = !this.isActive;
        }
    }
}
