// tslint:disable:no-console

declare var process: any;

function getStyle(lvl: number) {
    const bgColor = ["#2d2d2d", "#6699cc", "#99cc99", "#ffcc66", "#f2777a"];
    const txtColor = ["#ffcc66", "#f2f0ec", "#2d2d2d", "#2d2d2d", "#f2f0ec"];

    return lvl > 0
        ? `background: ${bgColor[lvl] || bgColor[0]}; color: ${txtColor[lvl] ||
              txtColor[0]}; padding: 2px 0.9em 2px 0.7em; border-top-right-radius: 1.5em; border-bottom-right-radius: 1.5em; font-weight: normal; margin-right: 0.5em;`
        : `background: ${bgColor[lvl] || bgColor[0]}; color: ${txtColor[lvl] ||
              txtColor[0]}; padding: 2px 0.7em 2px 0.9em; border-top-left-radius: 1.5em; border-bottom-left-radius: 1.5em; font-weight: bold; margin-right: 1px;`;
}

function spray(level: number, tag: string | undefined, message: string | undefined, ...args: any[]) {
    if (process.env.NODE_ENV === "development") {
        const defaultLogArgs = [
            `%cfrontools%c${tag || "…"}%c${message || ""}`,
            getStyle(0),
            getStyle(level),
            "color: #2d2d2d; font-weight: bold",
        ];

        if (args.length > 0) {
            console.groupCollapsed(...defaultLogArgs);

            for (const arg of args) {
                console.log(arg);
            }

            console.groupEnd();
        } else {
            console.log(...defaultLogArgs);
        }
    }
}

class Tagger {
    private tag: string | undefined;
    private args: any[];
    private keptArgs: any[];

    constructor(tag?: string) {
        this.tag = tag;
        this.args = [];
        this.keptArgs = [];
    }

    private print(level: number, message?: string) {
        spray(level, this.tag, message, ...[...this.keptArgs, ...this.args]);
        this.args = [];

        return this;
    }

    public info(message?: string) {
        return this.print(1, message);
    }

    public success(message?: string) {
        return this.print(2, message);
    }

    public warning(message?: string) {
        return this.print(3, message);
    }

    public error(message?: string) {
        return this.print(4, message);
    }

    public list(...args: any[]) {
        this.args.push(...args);
        return this;
    }

    public keep(...args: any[]) {
        this.keptArgs.push(...args);
        return this;
    }
}

function taggr(tag?: string) {
    return new Tagger(tag);
}

export default taggr;
