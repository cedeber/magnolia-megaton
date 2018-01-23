import Ajv from "ajv";

export default function(schema: any) {
    const ajv = new Ajv();
    return function(data: any) {
        return new Promise((resolve, reject) => {
            const valid = ajv.validate(schema, data);

            if (!valid) {
                reject(ajv.errors);
                return;
            }

            resolve(data);
        });
    }
}
