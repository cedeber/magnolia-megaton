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
 * @param {string} cacheName
 * @param {FetchEvent} fetchEvent
 * @param {string} fallback
 * @returns {Promise<Response>|undefined}
 */
async function fetchOrFallback(cacheName, fetchEvent, fallback) {
    console.log("fetchOrFallback", fetchEvent.request.url);
    try {
        const response = await fetch(fetchEvent.request);

        // Magnolia admin returns an error 401 if not logged in
        if (!response.ok && fetchEvent.request.url.indexOf("magnolia") === -1) { throw new Error(); }

        return response;
    }
    catch (_error) {
        return caches.match(fallback, { cacheName });
    }
}

/**
 *
 * @param {string} cacheName
 * @param {FetchEvent} fetchEvent
 * @returns {Promise<Response>|undefined}
 */
async function fetchAndCache(cacheName, fetchEvent) {
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

/**
 *
 * @param {string} cacheName
 * @param {FetchEvent} fetchEvent
 * @returns {Promise<Response>|undefined}
 */
function cacheOrFetch(cacheName, fetchEvent) {
    return caches.match(fetchEvent.request, { cacheName }).then(
        response => response || fetchAndCache(fetchEvent, cacheName)
    );
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
        event.respondWith(fetchOrFallback(appCacheName, event, pageCacheMap.get("offline")));
    }
    // app assets
    else if (url.pathname.match(/^\/app\/[\w0-9\-_]+.(css|js|woff|woff2|svg|png|jpg)$/)) {
        event.respondWith(cacheOrFetch(appCacheName, event));
    }
    // images fallback
    else if (acceptHeader.indexOf("image/*") >= 0) {
        event.respondWith(fetchOrFallback(fallbackCacheName, event, fallbackImagesMap.get("error")));
    }
});
