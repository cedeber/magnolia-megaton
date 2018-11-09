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
import { serializeArray } from "./form";
import assign from "lodash-es/assign";
let CustomForm = class CustomForm extends Vue {
    constructor() {
        super(...arguments);
        this.firstname = "";
        this.lastname = "";
        this.company = "";
        this.email = "";
        this.message = "";
        this.privacy = false;
        this.termsConditions = false;
        this.address = "";
        this.city = "";
        this.zip = "";
        this.country = "";
        this.phone = "";
        this.errorMessage = "";
    }
    async sendMail() {
        const data = this.validateForm();
        if (data) {
            const request = await fetch(window.mgnlContextPath + "/.mail/", {
                method: "POST",
                credentials: "include",
                body: JSON.stringify(data),
            });
            if (request.ok) {
                return await request.text();
            }
            else {
                this.errorMessage = "Something went wrong. Please try again later";
                throw new Error("Unable send the request");
            }
        }
    }
    validateForm() {
        let data = null;
        const defaultForm = this.$el.querySelector(".js-default-form");
        if (defaultForm) {
            this.errorMessage = "";
            if (this.checkEachFieldOfForm(defaultForm)) {
                data = assign({}, serializeArray(defaultForm));
            }
            else {
                this.errorMessage = "Please fill in all the required fields.";
                return null;
            }
        }
        return data;
    }
    checkEachFieldOfForm(form) {
        if (form && form.checkValidity())
            return true;
        if (form) {
            const elements = form.querySelectorAll("input, select, textarea");
            elements.forEach(element => {
                element.classList.remove("invalid");
                if (!element.checkValidity()) {
                    element.classList.add("invalid");
                }
            });
        }
        return false;
    }
};
__decorate([
    Prop({ type: String }),
    __metadata("design:type", String)
], CustomForm.prototype, "uuid", void 0);
__decorate([
    Prop({ type: String }),
    __metadata("design:type", String)
], CustomForm.prototype, "fromEmail", void 0);
__decorate([
    Prop({ type: String }),
    __metadata("design:type", String)
], CustomForm.prototype, "recipient", void 0);
__decorate([
    Prop({ type: String }),
    __metadata("design:type", String)
], CustomForm.prototype, "subject", void 0);
__decorate([
    Prop({ type: String }),
    __metadata("design:type", String)
], CustomForm.prototype, "privacyPage", void 0);
__decorate([
    Prop({ type: String }),
    __metadata("design:type", String)
], CustomForm.prototype, "termsConditionsPage", void 0);
CustomForm = __decorate([
    Component
], CustomForm);
export default CustomForm;
//# sourceMappingURL=customForm.js.map