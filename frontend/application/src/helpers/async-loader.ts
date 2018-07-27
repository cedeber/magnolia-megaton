/**
 * Load JS asynchronously
 * @param {string} src
 * @returns {Promise<*>}
 */
export function loadJS(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");

        script.onload = event => resolve(event);
        script.onerror = event => reject(event);
        script.async = true;
        script.src = src;

        document.head.appendChild(script);
    });
}


/**
 * Load CSS asynchronously
 * @param {string} src
 * @param {string} [media="screen"]
 * @returns {Promise<*>}
 */
export function loadCSS(src, media = "screen") {
    return new Promise((resolve, reject) => {
        const link = document.createElement("link");

        link.addEventListener("load", event => resolve(event));
        link.addEventListener("error", event => reject(event));
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("media", media);
        link.setAttribute("href", src);

        document.head.appendChild(link);
    });
}
