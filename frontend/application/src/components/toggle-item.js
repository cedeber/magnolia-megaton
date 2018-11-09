var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Vue, Component, Prop } from "vue-property-decorator";
let ToggleItem = class ToggleItem extends Vue {
    constructor() {
        super(...arguments);
        this.isActive = false;
        this.content = "";
    }
    mounted() {
        if (this.defaultValue !== "") {
            this.content = this.defaultValue;
            this.isActive = !this.isActive;
        }
    }
    toggleActive() {
        if (this.content === "") {
            this.isActive = !this.isActive;
        }
    }
};
__decorate([
    Prop({ type: String, default: 0 }),
    __metadata("design:type", String)
], ToggleItem.prototype, "defaultValue", void 0);
ToggleItem = __decorate([
    Component
], ToggleItem);
export default ToggleItem;
//# sourceMappingURL=toggle-item.js.map