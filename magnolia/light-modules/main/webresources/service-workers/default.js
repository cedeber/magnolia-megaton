/**
 *
 * @param {string} cacheName
 * @param {Map<string, string>} urlMap
 * @returns {Promise<true|Error>}
 */
function preCache(cacheName, urlMap) {
    return new Promise( async (resolve, reject) => {
        try {
            const cache = await caches.open(cacheName);

            for (const url of urlMap.values()) {
                const match = await caches.match(url, {cacheName: cacheName});

                if (match == undefined) {
                    try {
                        const response = await fetch(url);

                        if (response.ok) {
                            await cache.put(url, response);
                        }
                    }
                    catch(_error) { /* unused */ }
                }
            }

            resolve(true);
        }
        catch (error) { reject(error); }
    });
}

/**
 *
 * @param {FetchEvent} fetchEvent
 * @param {string} fallback
 * @param {string|undefined} cacheName
 * @returns {Promise<Response>|undefined}
 */
async function fetchOrFallback(fetchEvent, fallback, cacheName) {
    try {
        const response = await fetch(fetchEvent.request);

        if (!response.ok) { throw new Error(); }

        return response;
    }
    catch (_error) {
        return cacheName ? caches.match(fallback, { cacheName }) : caches.match(fallback);
    }
}

/**
 *
 * @param {FetchEvent} fetchEvent
 * @param {string} cacheName
 * @returns {Promise<Response>|undefined}
 */
async function fetchAndCache(fetchEvent, cacheName) {
    try {
        const response = await fetch(fetchEvent.request);
        const cache = await caches.open(cacheName);

        if (!response.ok) { throw new Error(); }
        await cache.put(fetchEvent.request, response.clone());

        return response;
    }
    catch (_error) {
        return caches.match(fetchEvent.request, { cacheName });
    }
}


/*
 * ┌────────────────────────┐
 * │                        │
 * │     Fallback Image     │
 * │                        │
 * └────────────────────────┘
 */
const fallbackCacheName = "fallback-cache-v1";
const fallbackImagesMap = new Map();

fallbackImagesMap.set("error", "/sw-assets/error-connection-failure.svg");


/*
 * ┌─────────────────────┐
 * │                     │
 * │     Application     │
 * │                     │
 * └─────────────────────┘
 */
const appCacheName = "app-cache-v1";
const pageCacheMap = new Map();

pageCacheMap.set("offline", "/offline");
pageCacheMap.set("manifest", "/manifest.json");


/*
 * ┌────────────────────────┐
 * │                        │
 * │     SERVICE WORKER     │
 * │                        │
 * └────────────────────────┘
 */
// Pre-cache
self.addEventListener("install", event => {
    event.waitUntil(Promise.all([
        preCache(fallbackCacheName, fallbackImagesMap),
        preCache(appCacheName, pageCacheMap),
    ]));
});

// Clear all unused caches
self.addEventListener("activate", event => {
    event.waitUntil(caches.keys().then(
        cacheNames => cacheNames
            .filter(cacheName => cacheName !== fallbackCacheName && cacheName !== appCacheName)
            .map(cacheName => caches.delete(cacheName))
    ));
});

self.addEventListener("fetch", event => {
    const acceptHeader = event.request.headers.get("accept");
    const url = new URL(event.request.url);

    // web pages fallback
    if (acceptHeader.indexOf("text/html") >= 0) {
        event.respondWith(fetchOrFallback(event, pageCacheMap.get("offline"), appCacheName));
    }
    // app assets
    else if (url.pathname.match(/^\/app\/[\w0-9\-_]+.(css|js|woff|woff2|svg|png|jpg)$/)) {
        event.respondWith(fetchAndCache(event, appCacheName));
    }
    // images fallback
    else if (acceptHeader.indexOf("image/*") >= 0) {
        event.respondWith(fetchOrFallback(event, fallbackImagesMap.get("error"), fallbackCacheName));
    }
});
