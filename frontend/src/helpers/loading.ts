function applyBeforeQuit(callback: () => Promise<any>) {
    document.addEventListener("click", async (event: MouseEvent) => {
        if (event.button !== 0) { return; }
        let element = event.target as Element | null;

        while (element && !element.hasAttribute("href")) {
            element = element.parentElement;
        }

        if (element) {
            const location = element.getAttribute("href");

            if (location && /^((mailto|tel):|#)/.test(location)) { return; }
            event.preventDefault();

            try { await callback(); }
            catch (_unusedError) { /* empty */ }

            if (location) { window.location.assign(location); }
        }
    });
}

// A too short loading effect looks buggy.
function simulateLoading(): Promise<any> {
    return new Promise(resolve => {
        setTimeout(resolve, 1000);
    });
}

function pageLoaded(): Promise<any> {
    return new Promise(resolve => {
        if (document.readyState === "complete") { resolve(); }
        else { window.addEventListener("load", resolve); }
    });
}

export { applyBeforeQuit, simulateLoading, pageLoaded };
