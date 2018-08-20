/*! DevTools Taggr v1.3 */
// tslint:disable:no-console

declare var process: any;

class Tagger {
    private tag: string | undefined;
    private args: any[];
    private keptArgs: any[];

    constructor(tag?: string) {
        this.tag = tag;
        this.args = [];
        this.keptArgs = [];
    }

    /**
     * Not designed to be used directly
     * Print to the console and clear the group list
     * @param {number} level
     * @param {string} message
     * @returns {Tagger} This Tagger instance
     */
    private print(level: number, message?: string): Tagger {
        spray(level, this.tag, message, ...[...this.keptArgs, ...this.args]);

        // Clean the list
        this.args = [];

        return this;
    }

    /**
     * Print a simple default message
     * @param {string} message
     * @returns {Tagger} This Tagger instance
     */
    public info(message?: string): Tagger {
        return this.print(1, message);
    }

    /**
     * Print a success message
     * @param {string} message
     * @returns {Tagger} This Tagger instance
     */
    public success(message?: string): Tagger {
        return this.print(2, message);
    }

    /**
     * Print a warning message
     * @param {string} message
     * @returns {Tagger} This Tagger instance
     */
    public warning(message?: string): Tagger {
        return this.print(3, message);
    }

    /**
     * Print an error message
     * @param {string} message
     * @returns {Tagger} This Tagger instance
     */
    public error(message?: string): Tagger {
        return this.print(4, message);
    }

    /**
     * Add stuff to output into a console group
     * To output the group you need to send a message after having listed some other information
     * The list is cleaned each time you send a message
     * @param args
     * @returns {Tagger} This Tagger instance
     */
    public list(...args: any[]): Tagger {
        this.args.push(...args);

        return this;
    }

    /**
     * Add stuff to output into a console group
     * To output the group you need to send a message after having listed some other information
     * The kept arguments won't be deleted after you send a message
     * @param args
     * @returns {Tagger} This Tagger instance
     */
    public keep(...args: any[]): Tagger {
        this.keptArgs.push(...args);
        return this;
    }
}

/**
 * Create a new tagged Tagger
 * @param {string} [tag]
 * @returns {Tagger} A new Tagger instance
 */
export default function taggr(tag?: string): Tagger {
    return new Tagger(tag);
}

/**
 * Print the messages to the console
 * @param {number} level Error level
 * @param {string | undefined} tag
 * @param {string | undefined} message
 * @param args
 */
function spray(
    level: number,
    tag: string | undefined,
    message: string | undefined,
    ...args: any[]
) {
    // Only print message in development mode
    if (process.env.NODE_ENV === "development") {
        const defaultLogArgs = [
            `%ctaggr%c${tag || "»"}%c${message || ""}`,
            getStyle(0),
            getStyle(level),
            "color: #2d2d2d; font-weight: bold",
        ];

        if (args && args.length > 0) {
            // Create a console group if you list stuff to output
            console.groupCollapsed(...defaultLogArgs);

            for (const arg of args) {
                console.log(arg);
            }

            // Close the group
            console.groupEnd();
        } else {
            // or simply print the message of nothing need to be listed
            console.log(...defaultLogArgs);
        }
    }
}

/**
 * Stylings for the log
 * @param {number} lvl Error level
 * @returns {string} Developer tools console stylings
 */
function getStyle(lvl: number) {
    const bgColor = ["#2d2d2d", "#6699cc", "#99cc99", "#ffcc66", "#f2777a"];
    const txtColor = ["#ffcc66", "#f2f0ec", "#2d2d2d", "#2d2d2d", "#f2f0ec"];

    return lvl > 0
        ? `background: ${bgColor[lvl] || bgColor[0]};` +
              `color: ${txtColor[lvl] || txtColor[0]};` +
              "padding: 2px 0.9em 2px 0.7em;" +
              "border-top-right-radius: 1.5em;" +
              "border-bottom-right-radius: 1.5em;" +
              "font-weight: normal;" +
              "margin-right: 0.5em;"
        : `background: ${bgColor[lvl] || bgColor[0]};` +
              `color: ${txtColor[lvl] || txtColor[0]};` +
              `padding: 2px 0.7em 2px 0.9em;` +
              `border-top-left-radius: 1.5em;` +
              `border-bottom-left-radius: 1.5em;` +
              `font-weight: bold;` +
              `margin-right: 1px;`;
}