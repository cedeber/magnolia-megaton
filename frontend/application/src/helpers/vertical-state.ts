/*! Vertical State v1.0 */

/**
 * @param {number} [marginTop=0]
 * @param {number} [marginBottom=marginTop]
 * @returns {function(HTMLElement): Object}
 */
export default function verticalState(
    marginTop: number = 0,
    marginBottom: number = marginTop,
): (arg0: HTMLElement) => Object {
    /**
     * @param {HTMLElement} domElement
     * @returns {Object}
     */
    return function(domElement: HTMLElement): Object {
        const wTop = window.pageYOffset;
        const wHeight = window.innerHeight;
        const topPosition = getTopPosition(domElement);
        const topProgress = getTopProgress();
        const bottomProgress = getBottomProgress();

        return {
            topPosition,
            topProgress,
            bottomProgress,
            ahead: topProgress < 0,
            entering: topProgress > 0 && topProgress < 1 && bottomProgress < 0,
            contained:
                (topProgress < 1 && bottomProgress > 0) ||
                (topProgress > 1 && bottomProgress < 0),
            exiting:
                topProgress > 1 && bottomProgress > 0 && bottomProgress < 1,
            behind: bottomProgress > 1,
        };

        /**
         * Position of the top border of the element depending on the viewport visibility
         * @return {number} 0 => bottom of the viewport, 1 => top of the viewport
         */
        function getTopProgress(): number {
            return (
                1 -
                (topPosition - (wTop + marginTop)) /
                    (wHeight - marginTop - marginBottom)
            );
        }

        /**
         * Position of the bottom border of the element depending on the viewport visibility
         * @return {number} 0 => bottom of the viewport, 1 => top of the viewport
         */
        function getBottomProgress(): number {
            return (
                1 -
                (topPosition + domElement.offsetHeight - (wTop + marginTop)) /
                    (wHeight - marginTop - marginBottom)
            );
        }
    };
}

/**
 * Get top position of an element in the page
 * @param {HTMLElement} element
 * @param {Element|Window} [boundary=window]
 * @returns {number} the top position in pixels
 */
function getTopPosition(element: HTMLElement, boundary = window): number {
    let top = element.offsetTop;

    while (
        (element = element.offsetParent as HTMLElement) !== null &&
        (element as HTMLElement | Window) !== boundary
    ) {
        top += element.offsetTop;
    }

    return top;
}
