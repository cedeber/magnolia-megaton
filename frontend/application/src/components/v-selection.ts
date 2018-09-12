import {Vue, Component, Prop} from "vue-property-decorator";

@Component
export default class VSelection extends Vue {
    @Prop({ type: String, default: "" })
    public selectId: string;
    public isActive = false;
    public isOpen = false;
    public content = "";
    public selected: string = "";

    public toggleActive() {
        if(this.content === ""){
            this.isActive = !this.isActive;
        }
        this.isOpen = !this.isOpen;
    }

    public setSelected(content: string) {
        this.selected = content;
        this.content = content;
    }

    public focusSelect() {
        const select = document.getElementById(this.selectId);
        if(select !== null) {
            select.focus();
        }
    }

    public unfocusSelect() {
        const self = this;
        window.setTimeout(function(){self.toggleActive();},200);
    }

    public changeSelect() {
        this.setSelected(this.selected);
    }
}
