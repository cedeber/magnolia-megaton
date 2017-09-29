import { applyBeforeQuit, simulateLoading, pageLoaded } from "../utils/loading";

const loadingElement = document.getElementById("loading");

function animateQuit() {
    return new Promise((resolve, _reject) => {
        if (loadingElement) {
            loadingElement.classList.remove("js-hidden");
        }
        setTimeout(() => { resolve(); }, 135);
    });
}

function animateEnter() {
    if (loadingElement) {
        loadingElement.classList.add("js-hidden");
        loadingElement.classList.remove("js-loading");
    }
}

Promise.all([simulateLoading(), pageLoaded()]).then(animateEnter);
applyBeforeQuit(animateQuit);
