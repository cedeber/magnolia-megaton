///<reference path="./workbox.d.ts"/>

importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.0.0-alpha.3/workbox-sw.js');

workbox.setConfig({ debug: true });
workbox.core.setCacheNameDetails({
  prefix: 'megaton',
  suffix: 'v1',
  precache: 'pre-cache',
  runtime: 'runtime-cache'
});

const imageFallbackUrl = "/sw-assets/error-connection-failure.svg";
const pageFallbackUrl = "/offline";

const preCacheName = workbox.core.cacheNames.precache;
const runtimeCacheName = workbox.core.cacheNames.runtime;
const globalCacheNames = [
    "megaton-app-cache-v1",
    "megaton-image-cache-v1",
    "megaton-page-cache-v1",
];

globalCacheNames.push(preCacheName, runtimeCacheName);

// Clear all unused caches
self.addEventListener("activate", event => {
    event.waitUntil(caches.keys().then(
        cacheNames => cacheNames
            .filter(cacheName => globalCacheNames.indexOf(cacheName) < 0)
            .map(cacheName => caches.delete(cacheName))
    ));
});

// Pre-cache static content
fetch("/app-manifest.json")
    .then(response => response.json())
    .then(data => {
        const urls = [
            imageFallbackUrl,
            pageFallbackUrl,
        ];

        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const filename = data[key];

                if (!filename.endsWith(".css") && !filename.endsWith(".js")) {
                    urls.push(`/app/${data[key]}`);
                }
            }
        }

        workbox.precaching.precacheAndRoute(urls, { directoryIndex: null });
    });

// Cache JS & CSS
workbox.routing.registerRoute(
    /\.(?:js|css)$/,
    workbox.strategies.staleWhileRevalidate({
        cacheName: globalCacheNames[0],
    }),
);

// Cache pages
workbox.routing.registerRoute(
    ({url, event}) => {
        const acceptHeader = event.request.headers.get("accept");

        return acceptHeader.indexOf("text/html") >= 0;
    },
    workbox.strategies.staleWhileRevalidate({
        cacheName: globalCacheNames[2],
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 60,
                maxAgeSeconds: 7 * 24 * 60 * 60,
            }),
        ],
    })
);

// Cache image files
const imagesHandler = workbox.strategies.cacheFirst({
    cacheName: globalCacheNames[1],
    plugins: [
        new workbox.expiration.Plugin({
            maxEntries: 60,
            maxAgeSeconds: 7 * 24 * 60 * 60,
        }),
    ],
});

workbox.routing.registerRoute(
    /.*\.(?:png|jpg|jpeg|svg|gif)$/,
    ({event}) => imagesHandler.handle(event)
        .catch(() => caches.match(imageFallbackUrl, {cacheName: preCacheName}))
);

// Fallback
workbox.routing.setCatchHandler(({url, event, params}) => {
    const acceptHeader = event.request.headers.get("accept");

    if (acceptHeader.indexOf("image/*") >= 0) {
        return caches.match(imageFallbackUrl, {cacheName: preCacheName});
    }

    if (acceptHeader.indexOf("text/html") >= 0) {
        return caches.match(pageFallbackUrl, {cacheName: preCacheName});
    }
});
