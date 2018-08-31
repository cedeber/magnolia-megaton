import { Vue, Component } from "vue-property-decorator";

@Component
export default class ToggleItem extends Vue {
    public isActive = false;
    public content = "";

    public toggleActive() {
        if(this.content === ""){
            this.isActive = !this.isActive;
        }
    }
}
