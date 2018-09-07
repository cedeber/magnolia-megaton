import { Vue, Component, Prop } from "vue-property-decorator";
import { serializeArray } from "./form";
import assign from "lodash-es/assign";

declare global {
    interface Window {
        mgnlContextPath: string;
    }
}

@Component
class CustomForm extends Vue {
    @Prop({ type: String })
    public uuid!: string;

    @Prop({ type: String })
    public fromEmail!: string;

    @Prop({ type: String })
    public recipient!: string;

    @Prop({ type: String })
    public subject!: string;

    @Prop({ type: String })
    public privacyPage!: string;

    @Prop({ type: String })
    public termsConditionsPage!: string;

    public firstname = "";
    public lastname = "";
    public company = "";
    public email = "";
    public message = "";
    public privacy = false;
    public termsConditions = false;

    public address = "";
    public city = "";
    public zip = "";
    public country = "";
    public phone = "";

    public errorMessage = "";


    public async sendMail() {
        const data = this.validateForm();

        if (data) {
            const request = await fetch(
                window.mgnlContextPath + "/.mail/",
                {
                    method: "POST",
                    credentials: "include",
                    body: JSON.stringify(data),
                },
            );

            if (request.ok) {
                return await request.text();
            } else {
                this.errorMessage = "Something went wrong. Please try again later";
                throw new Error("Unable send the request");
            }
        }
    }

    public validateForm() {
        let data = null;
        const defaultForm = this.$el.querySelector(".js-default-form",) as HTMLFormElement;

        if (defaultForm) {
            this.errorMessage = "";

            if (this.checkEachFieldOfForm(defaultForm)) {
                data = assign(
                    {},
                    serializeArray(defaultForm as HTMLFormElement),
                );
            } else {
                this.errorMessage = "Please fill in all the required fields.";
                return null;
            }
        }
        return data;
    }

    private checkEachFieldOfForm(form: HTMLFormElement): boolean {
        if (form && form.checkValidity()) return true;

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
}

export default CustomForm;
