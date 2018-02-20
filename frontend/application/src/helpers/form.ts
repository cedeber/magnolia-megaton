function mergeFormData(form1: FormData, form2: FormData): FormData {
    function merge(toForm: FormData, fromForm: FormData) {
        for (const key of fromForm.keys()) {
            const value = fromForm.get(key);

            if (value) { toForm.append(key, value); }
        }
    }

    const newFromData = new FormData();

    merge(newFromData, form1);
    merge(newFromData, form2);

    return newFromData;
}

function serializeArray(form: HTMLFormElement): any {
    const inputs = form.querySelectorAll("input");
    const fields: any = {};

    for (const input of inputs) {
        if (input.name && !input.disabled && input.type !== "file" && input.type !== "reset" && input.type !== "submit" && input.type !== "button") {
            if ((input.type !== "checkbox" && input.type !== "radio") || input.checked) {
                fields[input.name] = input.value;
            }
        }
    }

    return fields;
}

export { mergeFormData, serializeArray };
