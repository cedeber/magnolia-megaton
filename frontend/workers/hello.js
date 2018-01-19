/// <reference path="../node_modules/typescript/lib/lib.webworker.d.ts" />

onmessage = function(event) {
    postMessage("Hello, " + event.data + "!");
    close();
};
