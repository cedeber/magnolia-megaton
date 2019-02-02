import {Component, Prop, Vue} from "vue-property-decorator";

@Component
export default class CustomForm extends Vue {
    @Prop({ type: String })
    uuid!: string;

    @Prop({ type: String })
    fromEmail!: string;

    @Prop({ type: String })
    recipient!: string;

    @Prop({ type: String })
    subject!: string;

    @Prop({ type: String })
    privacyPage!: string;

    @Prop({ type: String })
    termsConditionsPage!: string;

    @Prop({ type: String })
    fileUploadText!: string;

    fileUploadTextPlaceholder = this.fileUploadText;

    error = false;
    success = false;
    missingRequired = false;
    onceSubmitted = false;

    mounted() {
        // Remove Honeypot text
        const honeypotField = document.querySelector("#winnie") as HTMLInputElement;

        if (honeypotField) {
            honeypotField.value = "";
        }
    }

    async sendMail() {
        this.onceSubmitted = true;

        const data = this.validateForm();

        if (data) {
            return fetch(
                window.mgnlContextPath + "/.servlet/CustomForm/",
                {
                    method: "POST",
                    credentials: "include",
                    body: JSON.stringify(data),
                },
            ).then(response => {
                if (response.ok) {
                    response.text()
                } else {
                    throw new Error(response.statusText)
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
        return
    }

    validateForm() {
        let data: FormData = new FormData();
        const defaultForm = this.$el.querySelector("form") as HTMLFormElement;

        this.onceSubmitted = true;

        if (defaultForm) {
            this.error = false;
            this.missingRequired = false;

            if (CustomForm.checkEachFieldOfForm(defaultForm)) {
                data = new FormData(defaultForm);
            } else {
                this.missingRequired = true;
                return null;
            }
        }
        return data;
    }

    static checkEachFieldOfForm(form: HTMLFormElement): boolean {
        if (form && form.checkValidity()) {
            return true;
        }

        if (form) {
            const elements = form.querySelectorAll("input, select, textarea") as NodeListOf<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;

            for (const element of elements) {
                if (!element.checkValidity()) {
                    element.classList.add("invalid");
                } else {
                    element.classList.remove("invalid");
                }
            }
        }

        return false;
    }

    validateFile (file) {
        if ( file.size > 30000000 ) { return false; }

        const regex = new RegExp("(.*?)\.(docx|doc|pdf|zip)$");
        return regex.test( file.name );
    }

    handleFileUpload() {
        const fileUpload = this.$el.querySelector("#file-upload") as any;
        const fileUploadText = this.$el.querySelector(".file-upload-text");

        if (fileUpload && fileUploadText) {
            if (fileUpload.files[0]) {
                if (this.validateFile(fileUpload.files[0])) {
                    this.fileUploadTextPlaceholder = fileUpload.files[0].name;
                } else {
                    fileUpload.files[0] = null;
                    this.fileUploadTextPlaceholder = this.fileUploadText;
                }
            } else {
                this.fileUploadTextPlaceholder = this.fileUploadText;
            }
        }
    }

    checkFormClasses() {
        return {
            '-once-submitted' : this.onceSubmitted
        }
    }

    delegateFileUpload() {
        const fileUpload = this.$el.querySelector("#file-upload") as any;
        fileUpload.click()
    }
}
