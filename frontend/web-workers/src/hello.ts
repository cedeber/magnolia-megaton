onmessage = function(event: MessageEvent) {
    postMessage("Hello, " + event.data + "!");
    close();
};
