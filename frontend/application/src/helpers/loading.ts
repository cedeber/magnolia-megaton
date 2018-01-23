import taggr from "../devtools/taggr";

const log = taggr("loading");

/**
 * A too short loading effect looks buggy.
 * @param {number?} time Time to wait in ms
 * @returns {Promise<*>}
 */
function simulateLoading(time?: number): Promise<any> {
    log.info(`simulate a loading for ${time || 600}ms`);

    return new Promise(resolve => {
        setTimeout(() => {
            log.success("simulated loading done");
            resolve();
        }, time || 600);
    });
}

/**
 * onload with Promises
 * @returns {Promise<Event|undefined>}
 */
function pageLoaded(): Promise<any> {
    return new Promise(resolve => {
        if (document.readyState === "complete") {
            log.success("page already loaded");
            resolve();
        } else {
            window.addEventListener("load", () => {
                log.success("page loaded");
                resolve();
            });
        }
    });
}

export { simulateLoading, pageLoaded };
