import taggr from "../devtools/taggr";

const log = taggr("loading");

/**
 * Replace all links events to run the callback before loading the new page
 * @param {() => Promise<any>} callback
 */
function applyBeforeQuit(callback: () => Promise<any>) {
    log.info("A loading click Event is added to the document");

    document.addEventListener("click", async (event: MouseEvent) => {
        log.info("You click on the document");

        // Test for left click.
        if (event.button !== 0) {
            log.error("Not a left click");
            return;
        }

        let element = event.target as Element | null;

        // Go up through the DOM tree to search for a link
        while (element && !element.hasAttribute("href")) {
            element = element.parentElement;
        }

        if (element) {
            const location = element.getAttribute("href");

            // If the link is for e-mail, phone or new window, do nothing
            if ((location && /^((mailto|tel):|#)/.test(location)) || element.hasAttribute("target")) {
                log.info("This link is for e-mail, phone or a new window");
                return;
            }

            event.preventDefault();

            try {
                await callback();
            } catch {
                log.error(`The callback '${callback.name}' failed`)
            }

            // Once callback returns a promise, go to the new page
            if (location) {
                log.info(`Navigate to the new page '${location}'`);
                window.location.assign(location);
            }
        }
    });
}

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

export { applyBeforeQuit, simulateLoading, pageLoaded };
