var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
var ToggleField = (function (_super) {
    __extends(ToggleField, _super);
    function ToggleField() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.isActive = false;
        _this.content = "";
        return _this;
    }
    ToggleField.prototype.mounted = function () {
        if (this.defaultValue !== "") {
            this.content = this.defaultValue;
            this.isActive = !this.isActive;
        }
    };
    ToggleField.prototype.onContentChange = function (value) {
        this.$parent[this.reportTo] = value;
    };
    ToggleField.prototype.toggleActive = function () {
        if (this.content === "") {
            this.isActive = !this.isActive;
        }
    };
    __decorate([
        Prop({ type: String, default: "" }),
        __metadata("design:type", String)
    ], ToggleField.prototype, "defaultValue", void 0);
    __decorate([
        Prop({ default: null }),
        __metadata("design:type", Object)
    ], ToggleField.prototype, "reportTo", void 0);
    __decorate([
        Watch('content'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], ToggleField.prototype, "onContentChange", null);
    ToggleField = __decorate([
        Component
    ], ToggleField);
    return ToggleField;
}(Vue));
export default ToggleField;
//# sourceMappingURL=toggle-field.js.map