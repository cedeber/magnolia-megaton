import { Vue, Component } from "vue-property-decorator";

@Component
export default class ToggleItem extends Vue {
    isActive = false;
    content = "";

    toggleActive() {
        if (this.content === "") {
            this.isActive = !this.isActive;
        }
    }
}
