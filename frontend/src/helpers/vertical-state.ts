interface PropertiesInterface {
    [index: string]: any;
    margins: number[];
    current: HTMLElement | Window;
    getBoundedState(stateName: string, [marginTop, marginBottom]: [number, number], scrollabe?: Element | Window): any;
    top: number;
    topProgress: number;
    bottomProgress: number;
    ahead: boolean;
    entering: boolean;
    contained: boolean;
    exiting: boolean;
    behind: boolean;
}

interface Object {
    verticalState: PropertiesInterface;
}

/**
 * Add information about vertical position depending on the viewport
 */
Object.defineProperty(Element.prototype, "verticalState", {
    configurable: true,

    /**
     * Vertical state object
     * @todo SPLIT into contained & spanning
     * @returns All properties
     */
    get(): PropertiesInterface {
        const self = this as HTMLElement;
        const properties = <PropertiesInterface>{};
        properties.margins = [0, 0];
        properties.current = window;

        /**
         * Get verticalState properties delimited with margins
         * @param stateName - verticalState property name
         * @param [marginTop, marginBottom] - viewport top/bottom desired margin
         * @param scrollable - scrollable container
         * @returns all properties, modified by the options
         */
        properties.getBoundedState = function(
            stateName: string,
            [marginTop = 0, marginBottom = marginTop]: number[] = [],
            scrollable: HTMLElement | Window = window,
        ): PropertiesInterface {
            this.margins = [marginTop, marginBottom];
            this.current = scrollable;

            return properties[stateName];
        };

        Object.defineProperties(properties, {
            top: {
                /**
                 * @returns the Y top position in pixels of the element in the page.
                 */
                get(): number {
                    let element = self;
                    let top: number = element.offsetTop;

                    // tslint:disable-next-line:no-conditional-assignment
                    while ((element = element.offsetParent as HTMLElement) !== null && element !== properties.current) {
                        top += element.offsetTop;
                    }

                    return top;
                },
            },
            topProgress: {
                /**
                 * @returns current position progress on the page from the element's top
                 * 0 a the bottom, 1 at the top
                 */
                get(): number {
                    const wTop: number = properties.current === window ? window.pageYOffset : (<HTMLElement>properties.current).scrollTop;
                    const wHeight: number = properties.current === window ? window.innerHeight : (<HTMLElement>properties.current).offsetHeight;

                    return 1 - (properties.top - (wTop + properties.margins[0])) / (wHeight - properties.margins[0] - properties.margins[1]);
                },
            },
            bottomProgress: {
                /**
                 * @returns current position progress on the page from the element's bottom
                 * 0 a the bottom, 1 at the top
                 */
                get(): number {
                    const wTop: number = properties.current === window ? window.pageYOffset : (<HTMLElement>properties.current).scrollTop;
                    const wHeight: number = properties.current === window ? window.innerHeight : (<HTMLElement>properties.current).offsetHeight;

                    return 1 - (properties.top + self.offsetHeight - (wTop +
                        properties.margins[0])) / (wHeight - properties.margins[0] - properties.margins[1]);
                },
            },
            ahead: {
                /**
                 * @returns true if the element is below the fold
                 */
                get(): boolean {
                    const wTop: number = properties.current === window ? window.pageYOffset : (<HTMLElement>properties.current).scrollTop;
                    const wHeight: number = properties.current === window ? window.innerHeight : (<HTMLElement>properties.current).offsetHeight;

                    return wTop - properties.margins[1] + wHeight < properties.top;
                },
            },
            entering: {
                /**
                 * @returns true if the element is entering the viewport.
                 */
                get(): boolean {
                    const top: number = properties.top;
                    const wHeight: number = (properties.current === window ? window.innerHeight : (<HTMLElement>properties.current).offsetHeight) - properties.margins[1];
                    const wTop: number = properties.current === window ? window.pageYOffset : (<HTMLElement>properties.current).scrollTop;
                    const height: number = Math.min(self.offsetHeight, wHeight);

                    return wTop + wHeight > top && wTop + wHeight < top + height;
                },
            },
            contained: {
                /**
                 * @returns true if the element is totally visible in the viewport.
                 */
                get(): boolean {
                    const elTop: number = properties.top;
                    const elHeight: number = self.offsetHeight;
                    const wTop: number = properties.current === window ? window.pageYOffset : (<HTMLElement>properties.current).scrollTop;
                    const wHeight: number = properties.current === window ? window.innerHeight : (<HTMLElement>properties.current).offsetHeight;
                    const diff: number = elHeight > wHeight ? elHeight - wHeight : 0;

                    return wTop + wHeight - properties.margins[1] + diff > elTop + elHeight &&
                        wTop + properties.margins[0] - diff < elTop || this.entering && this.exiting;
                },
            },
            exiting: {
                /**
                 * @returns true if the element is existing the viewport.
                 */
                get(): boolean {
                    const elTop: number = properties.top;
                    const elHeight: number = self.offsetHeight;
                    const wHeight: number = properties.current === window ? window.innerHeight : (<HTMLElement>properties.current).offsetHeight;
                    const top: number = Math.max(elTop - properties.margins[0], elTop + elHeight - wHeight);
                    const wTop: number = properties.current === window ? window.pageYOffset : (<HTMLElement>properties.current).scrollTop;

                    return wTop > top && wTop + properties.margins[0] < elTop + elHeight;
                },
            },
            behind: {
                /**
                 * @returns true if the element is above the fold.
                 */
                get(): boolean {
                    const wTop: number = properties.current === window ? window.pageYOffset : (<HTMLElement>properties.current).scrollTop;

                    return wTop + properties.margins[0] > properties.top + self.offsetHeight;
                },
            },
        });

        return properties;
    },
});
