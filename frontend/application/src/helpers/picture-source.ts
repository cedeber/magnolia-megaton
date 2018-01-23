import validateSchema from "../schemas/validate";
import sourcesSchema from "../schemas/picture-sources.json";

const validateSources = validateSchema(sourcesSchema);

export default function(data: any): Promise<string> {
    return new Promise(async (resolve, reject) => {
        try {
            await validateSources(data);
        } catch (errors) {
            reject(errors);
        }

        const pixelRatio = window.devicePixelRatio || 1;
        const sourcesInfos: Array<{pxr: number, src: string}> = [];
        let srcset: string = "";

        // Get the srcset that match the media query
        for(const key of Object.keys(data)) {
            const media = key === "all" ? key : `(max-width:${key})`;

            if (window.matchMedia(media).matches) {
                srcset = data[key];
                break;
            }
        }

        if (srcset === "") {
            reject(new Error("no srcset found"));
            return;
        }

        // Split the srcset between pixel ratio rules
        const sourceDefinitions = srcset.split(",");

        for (const definition of sourceDefinitions) {
            const def = definition.trim().replace(/\s{2,}/g, " ");
            const rules = def.split(" ");

            if (rules.length === 1) {
                // Pixel ratio 1
                sourcesInfos.push({
                    pxr: 1,
                    src: rules[0],
                });
            }
            else if (rules.length > 1) {
                // Other pixel ratios
                for (let i = 1, l = rules.length; i < l; i += 1) {
                    if (rules[i].endsWith("x")) {
                        sourcesInfos.push({
                            pxr: Number(rules[i].slice(0, -1)),
                            src: rules[0],
                        });
                    }
                }
            }
        }

        if (sourcesInfos.length > 0) {
            // Sort the pixel ratios
            sourcesInfos.sort((hash1: any, hash2: any) => {
                const pxr1 = hash1.pxr;
                const pxr2 = hash2.pxr;

                if (pxr1 < pxr2) { return -1; }
                if (pxr1 > pxr2) { return 1; }

                return 0;
            });

            // Extract the good version
            let validatedSource = sourcesInfos[sourcesInfos.length - 1].src;

            for (let i = 0, l = sourcesInfos.length; i < l; i += 1) {
                const source = sourcesInfos[i];

                validatedSource = source.src;
                if (source.pxr >= pixelRatio) {
                    break;
                }
            }

            resolve(validatedSource);
            return;
        }

        reject(new Error("unable to define a source"));
        return;
    });
}
