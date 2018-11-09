var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var CustomForm_1;
import { Component, Prop, Vue } from "vue-property-decorator";
let CustomForm = CustomForm_1 = class CustomForm extends Vue {
    constructor() {
        super(...arguments);
        this.fileUploadTextPlaceholder = this.fileUploadText;
        this.error = false;
        this.success = false;
        this.missingRequired = false;
        this.onceSubmitted = false;
    }
    async sendMail() {
        this.onceSubmitted = true;
        const data = this.validateForm();
        if (data) {
            return fetch(window.mgnlContextPath + "/.servlet/CustomForm/", {
                method: "POST",
                credentials: "include",
                body: data,
            }).then(response => {
                if (response.ok) {
                    response.text();
                }
                else {
                    throw new Error(response.statusText);
                }
            })
                .then(() => this.success = true)
                .catch(() => {
                this.success = false;
                this.error = true;
                throw new Error("Unable send the request.");
            });
        }
        this.error = !this.missingRequired;
        return;
    }
    validateForm() {
        let data = new FormData();
        const defaultForm = this.$el.querySelector("form");
        this.onceSubmitted = true;
        if (defaultForm) {
            this.error = false;
            this.missingRequired = false;
            if (CustomForm_1.checkEachFieldOfForm(defaultForm)) {
                data = new FormData(defaultForm);
            }
            else {
                this.missingRequired = true;
                return null;
            }
        }
        return data;
    }
    static checkEachFieldOfForm(form) {
        if (form && form.checkValidity()) {
            return true;
        }
        if (form) {
            const elements = form.querySelectorAll("input, select, textarea");
            for (const element of elements) {
                if (!element.checkValidity()) {
                    element.classList.add("invalid");
                }
                else {
                    element.classList.remove("invalid");
                }
            }
        }
        return false;
    }
    validateFile(file) {
        if (file.size > 30000000) {
            return false;
        }
        const regex = new RegExp("(.*?)\.(docx|doc|pdf|zip)$");
        return regex.test(file.name);
    }
    handleFileUpload() {
        const fileUpload = this.$el.querySelector("#file-upload");
        const fileUploadText = this.$el.querySelector(".file-upload-text");
        if (fileUpload && fileUploadText) {
            if (fileUpload.files[0]) {
                if (this.validateFile(fileUpload.files[0])) {
                    this.fileUploadTextPlaceholder = fileUpload.files[0].name;
                }
                else {
                    fileUpload.files[0] = null;
                    this.fileUploadTextPlaceholder = this.fileUploadText;
                }
            }
            else {
                this.fileUploadTextPlaceholder = this.fileUploadText;
            }
        }
    }
    checkFormClasses() {
        return {
            '-once-submitted': this.onceSubmitted
        };
    }
    delegateFileUpload() {
        const fileUpload = this.$el.querySelector("#file-upload");
        fileUpload.click();
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
__decorate([
    Prop({ type: String }),
    __metadata("design:type", String)
], CustomForm.prototype, "fileUploadText", void 0);
CustomForm = CustomForm_1 = __decorate([
    Component
], CustomForm);
export default CustomForm;
//# sourceMappingURL=customForm.js.map