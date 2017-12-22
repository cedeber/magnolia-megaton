declare var process: any;

function getStyle(lvl: number, tag?: boolean) {
    const bgColor = [undefined, undefined, "#99cc99", "#ffcc66", "#f2777a"];

    return tag ?
        lvl > 0 ? `background: ${bgColor[lvl] || "#393939"}; color: ${bgColor[lvl] ? "#2d2d2d" : "#f2f0ec"}; padding: 2px 0.9em 2px 0.7em; border-top-right-radius: 1.5em; border-bottom-right-radius: 1.5em; font-weight: normal; margin-right: 0.5em;`
            : `background: ${bgColor[lvl] || "#393939"}; color: ${bgColor[lvl] ? "#2d2d2d" : "#ffcc66"}; padding: 2px 0.7em 2px 0.9em; border-top-left-radius: 1.5em; border-bottom-left-radius: 1.5em; font-weight: bold; margin-right: 1px;`
        : `background: ${bgColor[lvl] || "#393939"}; color: ${bgColor[lvl] ? "#2d2d2d" : "#ffcc66"}; padding: 2px 0.8em; border-radius: 1.5em; font-weight: bold; margin-right: 0.5em;`;
}

function paint(level: number, tag: string | undefined, message: string | undefined, ...args: any[]) {
    const defaultLogArgs = tag == undefined ? [
        `%cfrontools%c${message || ""}`,
        getStyle(level),
        "color: #2d2d2d; font-weight: bold",
    ] : [
        `%cfrontools%c${tag}%c${message || ""}`,
        getStyle(0, true),
        getStyle(level, true),
        "color: #2d2d2d; font-weight: bold",
    ];

    if (process.env.NODE_ENV === "development") {
        if (args.length > 0) {
            console.groupCollapsed(...defaultLogArgs);
            for (const arg of args) {
                console.log(arg);
            }
            console.groupEnd();
        }
        else {
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

    private spray(level: number, message?: string) {
        paint(level, this.tag, message, ...[...this.keptArgs, ...this.args]);
        this.args = [];

        return this;
    }

    public info(message?: string) { return this.spray(1,  message); }
    public success(message?: string) { return this.spray(2,  message); }
    public warning(message?: string) { return this.spray(3,  message); }
    public error(message?: string) { return this.spray(4,  message); }

    public list(...args: any[]) { this.args.push(...args); return this; }
    public keep(...args: any[]) { this.keptArgs.push(...args); return this; }
}

function taggr(tag?: string) {
    return new Tagger(tag);
}

export default taggr;
