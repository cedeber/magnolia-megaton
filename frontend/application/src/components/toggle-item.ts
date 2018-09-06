import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class ToggleItem extends Vue {
    @Prop({ type: String, default: 0 })
    defaultValue!: string;

    isActive = false;
    content = "";

    mounted(){
        if(this.defaultValue !== ""){
            this.content = this.defaultValue;
            this.isActive = !this.isActive;
        }
    }

    toggleActive() {
        if (this.content === "") {
            this.isActive = !this.isActive;
        }
    }
}
