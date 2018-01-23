import Ajv from "ajv";

export default function(schema: any) {
    return function(data: any): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const ajv = new Ajv();
            const valid = ajv.validate(schema, data);

            if (!valid) {
                reject(ajv.errors);
                return;
            }

            resolve(true);
        });
    }
}
