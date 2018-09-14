import { Vue, Component, Prop } from "vue-property-decorator";
import serialize from "../helpers/form_serialize";

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

    firstname = "";
    lastname = "";
    company = "";
    email = "";
    message = "";
    privacy = false;
    termsConditions = false;

    address = "";
    city = "";
    zip = "";
    country = "";
    phone = "";

    errorMessage = "";

    async sendMail() {
        const data = this.validateForm();

        if (data) {
            return fetch(
                window.mgnlContextPath + "/.mail/",
                {
                    method: "POST",
                    credentials: "include",
                    body: JSON.stringify(data),
                },
            )
                .then(response => response.text())
                .catch(() => {
                    this.errorMessage = "Something went wrong. Please try again later.";
                    throw new Error("Unable send the request.");
                });
        }

        this.errorMessage = "Please fill the form.";
        throw new Error("Form not filled.");
    }

    validateForm() {
        let data: any = null;
        const defaultForm = this.$el.querySelector("form") as HTMLFormElement;

        if (defaultForm) {
            this.errorMessage = "";

            if (CustomForm.checkEachFieldOfForm(defaultForm)) {
                data = serialize(defaultForm as HTMLFormElement);
            } else {
                this.errorMessage = "Please fill in all the required fields.";
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
}
