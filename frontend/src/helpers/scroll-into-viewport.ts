interface Element {
    scrollIntoViewport({}: { speed?: number, marginTop?: number, callback?: string | Function, scrollable?: Element | Window }): Function | number;
}

interface Window {
    [callback: string]: any;
}

let scrollIntoViewportAnimationId: number = 0;

/**
 * Get top position of an element in the page
 * @returns the top position in pixels
 */
function getTopPosition(element: Element, boundary: Element | Window = window): number {
    let top = (<HTMLElement>element).offsetTop;

    while ((element = (<HTMLElement>element).offsetParent) !== null && element !== boundary) {
        top += (<HTMLElement>element).offsetTop;
    }

    return top;
}

/**
 * Easing functions: easeOutCubic
 * @param time Current time / current frame
 * @param begin Start value
 * @param change Change in value
 * @param duration Duration / number of frames
 * @returns the next value
 */
function easeOutCubic(time: number, begin: number, change: number, duration: number): number {
    return change * ((time = time / duration - 1) * time * time + 1) + begin;
}

/**
 * like element.scrollIntoView({block: "top", behavior: "smooth"});
 * @param speed Average pixel per frame (~ 60fps)
 * @param marginTop Top margin decal in pixel
 * @param callback Callback function
 * @param scrollable Element to scroll
 * @returns the callback if any
 */
Element.prototype.scrollIntoViewport = function({ speed = 35, marginTop = 0, callback = null, scrollable = window }:
    { speed?: number, marginTop?: number, callback?: string | Function, scrollable?: Element | Window } = {}): Function | number {
    const start = Date.now();
    const offset = scrollable === window ? window.pageYOffset : (<Element>scrollable).scrollTop; // or pageYOffset=scrollY
    const goTo = getTopPosition(this, scrollable) - marginTop - (scrollable === window ? 0 : getTopPosition((<Element>scrollable), scrollable));
    const pageHeight = scrollable === window ? Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight) :
            (<Element>scrollable).scrollHeight;
    const windowHeight = scrollable === window ? window.innerHeight : (<Element>scrollable).clientHeight;
    const next = pageHeight - goTo;

    let toGo = offset;
    let delta = goTo - offset;
    let change = delta;

    // Prevent win declaration to an element without Y scroll overflow
    if (scrollable !== window && (<Element>scrollable).clientHeight === (<Element>scrollable).scrollHeight) {
        scrollable = window;
    }

    window.cancelAnimationFrame(scrollIntoViewportAnimationId);

    if (next < windowHeight) {
        delta = delta - (windowHeight - next);
        change = delta;
    }

    /**
     * Scroll to the element
     * @returns the callback if any
     */
    function step(): Function | number {
        const whereAmI = scrollable === window ? window.pageYOffset : (<Element>scrollable).scrollTop;

        if (toGo < whereAmI - 1 || toGo > whereAmI + 1) {
            // for high definition screens, some browsers doesn't return a integer if
            // the screen's definition is not an integer, unlike Retina displays.
            try {
                scrollable.dispatchEvent(new Event("scrollcancel"));
            }
            catch (e) { }

            return 1;
        }

        change = speed > 0 ? change - easeOutCubic(
            Date.now() - start, 0, change, Math.abs(delta) / speed * 1000) : 0;
        toGo = Math.floor(offset + delta - change + 1);

        if (Math.abs(Math.abs(delta) - Math.abs(change)) < Math.abs(delta) - 1) {
            if (scrollable === window) { window.scrollTo(0, toGo); } // or scroll()
            else { (<Element>scrollable).scrollTop = toGo; }
            scrollIntoViewportAnimationId = window.requestAnimationFrame(step);
        }
        else if (typeof callback === "function") { return callback(); }
        else if (typeof callback === "string" && typeof window[callback] === "function") { return window[callback](); }

        return 1;
    }

    if (change === 0) {
        if (typeof callback === "function") { return callback(); }
        if (typeof callback === "string" && typeof window[callback] === "function") { return window[callback](); }
    }
    else {
        scrollIntoViewportAnimationId = window.requestAnimationFrame(step);
    }

    return 0;
};
