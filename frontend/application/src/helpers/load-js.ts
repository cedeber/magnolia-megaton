import taggr from "../devtools/taggr";

const log = taggr("load-js");

/**
 * Load JS asynchronously.
 * @param {string} src
 * @returns {Promise<Event>}
 */
function loadJS(src: string): Promise<any> {
    return new Promise((resolve, reject) => {
        const script = window.document.createElement("script");

        script.src = src;
        script.async = true;
        document.head.appendChild(script);

        script.onload = function(event) {
            log.success(`${src} loaded`);
            resolve(event);
        };

        script.onerror = function(event) {
            log.error(`${src} fails to load`);
            reject(event);
        };
    });
}

export default loadJS;
