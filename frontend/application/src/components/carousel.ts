import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import debounce from "lodash-es/debounce";

import "./carousel.css";

enum RenderType {
    Linear = "linear",
    Continue = "continue",
    Async = "async",
}

enum Orientation {
    Horizontal = "horizontal",
    Vertical = "vertical",
}

@Component
export default class Carousel extends Vue {
    @Prop({ type: Boolean, default: false })
    public asHero!: boolean; // calculate height from top position, at render

    @Prop({ type: Boolean, default: false })
    public autoplay!: boolean; // play automatically

    @Prop({ type: Number, default: 0 })
    public columns!: number; // number of colums, overwrite minWidth

    @Prop({ type: Number, default: 5000 })
    public delay!: number; // time to show a slide

    @Prop({
        type: Number,
        default: 0,
        validator(value: number) {
            return value >= 0;
        },
    })
    public maxWidth!: number; // items maximum width

    @Prop({
        type: Number,
        default: 0,
        validator(value: number) {
            return value >= 0;
        },
    })
    public minWidth!: number; // items minimum width

    @Prop({ type: String, default: "linear" })
    public imageRatio!: string; // image ratio

    @Prop({ type: String, default: "linear" })
    public renderType!: RenderType;

    @Prop({ type: String, default: "horizontal" })
    public orientation!: Orientation;

    @Prop({ type: Number, default: 0 })
    public startAt!: number; // first item to show

    @Prop({ type: Number, default: 1500 })
    public transitionDelay!: number; // duration of the transition animation

    // Variables
    public carouselWidth = 0; // used to control the resize event
    public currentItem = -1; // currently shown item, currently badly used
    public currentPage = 1; // currently shown page
    public decal = 0; // used to calculate page start position depending on items per page
    public doDecal = true;
    public itemsPerPage = 1; // number of items per page depending on min-width
    public itemsQuantity = 0; // number of items
    public itemWidth = 0; // items min width
    public occurrence = 0; // number of changes. Used to detect "js-first"
    public pagesQuantity = 1; // number of pages depending on min-width
    public playIntervalID = 0; // setInterval UID fot the animation
    public sliderRatio = "10";

    // State
    public isLoaded = false;
    // public isMoving = false;
    public isReverse = false;
    public isSinglePage = false;
    public isTransitioning = false;
    public onFirstPage = false;
    public onLastPage = false;
    public isVisible = false;

    // Content
    public items?: HTMLCollection | any[];
    public itemsContainer: Element | null = null;
    public itemsContainerStyles = {
        width: "0px",
        transform: "",
    };

    // Swipe
    public blockClickEventDistance = 0;
    public swipe = {
        move: false,
        time: 0,
        x: 0,
        y: 0,
    };
    public hasCursorDown = false;

    public mounted() {
        // As Hero (property)
        const setHeroHeight = function(this: Carousel) {
            const carouselTop: number = function(this: Carousel) {
                let element = this.$el;
                let top = (element as HTMLElement).offsetTop;

                while (
                    // tslint:disable-next-line:no-conditional-assignment
                    (element = element.offsetParent as HTMLElement) !== null &&
                    element !== document.body
                ) {
                    top += element.offsetTop;
                }

                return top;
            }.call(this);

            this.$el.style.height = `${window.innerHeight - carouselTop}px`;
        };

        if (this.asHero) {
            if (document.readyState !== "complete") {
                window.addEventListener("load", setHeroHeight.bind(this));
            } else {
                setHeroHeight.call(this);
            }
        }

        this.setupDOM();
        this.init();

        // Reset the Carousel after the resize
        // The Carousel's height shouldn't be changed because making the window bigger means you want to see more content
        function resize(this: Carousel) {
            if (this.isLoaded) {
                this.isLoaded = false;
                this.init();
            }
        }

        window.addEventListener("resize", debounce(resize.bind(this), 300));

        // Pause if not visible in the viewport
        const observer = new IntersectionObserver(entries => {
            const carousel = entries[0];

            this.isVisible = carousel.isIntersecting;

            clearInterval(this.playIntervalID);
            if (this.isVisible) {
                if (this.autoplay) {
                    if (this.pagesQuantity > 1 && this.delay > 0) {
                        this.playIntervalID = setInterval(
                            this.nextPage.bind(this, new MouseEvent("void")),
                            this.delay,
                        );
                    }
                }
            }
        });

        observer.observe(this.$el);
    }

    public updateSliderH() {
        return `padding-top:${this.sliderRatio}%`;
    }

    public setupDOM() {
        this.itemsContainer = this.$el.querySelector(".slides");
        this.items =
            this.itemsContainer == undefined
                ? undefined
                : this.itemsContainer.children;
        this.itemsQuantity = this.items == undefined ? 0 : this.items.length;
    }

    public init() {
        this.carouselWidth = this.$el.offsetWidth;

        if (this.carouselWidth <= 0) {
            this.isLoaded = true;
            return;
        }

        const getWidth = (n: number) =>
            Math.min(
                this.columns > 0
                    ? this.carouselWidth / this.columns
                    : n || this.carouselWidth,
                this.carouselWidth,
            );

        this.itemsPerPage = Math.max(
            Math.floor(this.carouselWidth / getWidth(this.minWidth)),
            Math.ceil(this.carouselWidth / getWidth(this.maxWidth)),
        );
        this.pagesQuantity = Math.ceil(this.itemsQuantity / this.itemsPerPage);
        this.itemWidth = this.carouselWidth / this.itemsPerPage;

        this.onFirstPage = false;
        this.onLastPage = false;
        this.isSinglePage = false;

        switch (this.renderType) {
            case RenderType.Linear:
                this.itemsContainerStyles.width =
                    `${this.pagesQuantity * 100}%`;
                break;
        }

        // [TODO] Could have been done with another component or template?
        if (!(this.items == undefined)) {
            const rest = this.itemsQuantity % this.itemsPerPage;

            for (let i = 0; i < this.itemsQuantity; ) {
                for (
                    let j = 0;
                    j < this.itemsPerPage && i < this.itemsQuantity;
                    j += 1
                ) {
                    const item = this.items[i];

                    if (!(item instanceof HTMLElement) && !("styles" in item)) {
                        item.styles = {};
                    }

                    const itemStyles: HTMLElement["style"] =
                        item instanceof HTMLElement ? item.style : item.styles;

                    switch (this.renderType) {
                        case RenderType.Linear:
                            itemStyles.position = "relative";
                            itemStyles.flex = "0 1 auto";
                            itemStyles.width = `calc(100% / ${
                                (this.pagesQuantity > 1
                                    ? this.itemsPerPage
                                    : this.itemsQuantity) *
                                this.pagesQuantity})`;
                            itemStyles.left = "";
                            break;

                        case RenderType.Async:
                            itemStyles.position = "absolute";

                            if (i < this.itemsQuantity - rest) {
                                itemStyles.width = `${this.carouselWidth /
                                    this.itemsPerPage}px`;
                                itemStyles.left = `${this.carouselWidth /
                                    this.itemsPerPage * j}px`;
                            } else {
                                itemStyles.width =
                                    `${this.carouselWidth / rest}px`;
                                itemStyles.left =
                                    `${this.carouselWidth / rest * j}px`;
                            }

                            break;
                    }

                    i += 1;
                }
            }
        }

        // Set class if it is a single page Carousel
        this.isSinglePage = this.pagesQuantity === 1;

        // Calculate Slider Height
        let slidesPadding = 0;

        if (this.items) {
            const slideStyle =
                this.items[0].currentStyle ||
                window.getComputedStyle(this.items[0]);
            const slidePadding =
                parseFloat(slideStyle.paddingLeft) +
                parseFloat(slideStyle.paddingRight);

            slidesPadding = slidePadding * this.itemsPerPage;
        }

        const contentW =
            (this.carouselWidth - slidesPadding) / this.itemsPerPage;
        this.sliderRatio = (
            contentW *
            Number(this.imageRatio) /
            this.carouselWidth
        ).toFixed(2);

        // Set class if it is a single page Carousel
        this.isSinglePage = this.pagesQuantity === 1;
        this.decal = 100;
        this.isLoaded = true;
        this.gotoPage(
            Math.floor(
                (this.currentItem < 0 ? this.startAt : this.currentItem) /
                    this.itemsPerPage,
            ),
        );
    }

    public gotoPage(page: number) {
        if (this.isTransitioning && this.renderType !== RenderType.Linear) {
            return;
        }

        this.isTransitioning = true;

        // Reverse mode
        this.isReverse =
            page < 0 && this.renderType === RenderType.Linear
                ? false
                : page < this.currentPage;

        // Current page in the possible range
        this.currentPage =
            page < 0
                ? this.pagesQuantity - 1
                : page >= this.pagesQuantity
                    ? 0
                    : page;

        // Do we show the last page?
        const lastPage =
            this.currentPage >=
                this.pagesQuantity - (this.itemWidth === 0 ? 0 : 1) &&
            this.itemsQuantity % this.itemsPerPage !== 0;

        // Calculate the last page decal depending on haw many least item do we have. Sometimes there are less than itemsPerPage
        this.decal = lastPage
            ? 100 / this.itemsPerPage * (this.itemsQuantity % this.itemsPerPage)
            : this.currentPage === 0
                ? 100
                : this.decal;
        this.doDecal = lastPage
            ? true
            : this.currentPage === 0
                ? false
                : this.doDecal;

        // Move the slider
        switch (this.renderType) {
            case RenderType.Linear:
                const move = -((this.currentPage - 1) * 100 + this.decal);

                this.currentItem =
                    this.currentPage * this.itemsPerPage -
                    (this.doDecal ? this.itemsQuantity % this.itemsPerPage : 0);
                this.itemsContainerStyles.transform = `translateX(${
                    this.pagesQuantity > 1 ? move / this.pagesQuantity : 0
                }%)`;
                break;

            case RenderType.Async:
            default:
                this.currentItem = this.currentPage * this.itemsPerPage;
                break;
        }

        // Page Style
        this.onFirstPage = this.currentPage <= 0;
        this.onLastPage =
            this.pagesQuantity === 1 ||
            this.currentPage >=
                this.pagesQuantity - (this.itemWidth === 0 ? 0 : 1);

        // Set current active item, independant from visible elements
        // [TODO] forEach + single component?
        // [TODO] set isActive & isLast
        if (!(this.items == undefined)) {
            for (let i = 0; i < this.itemsQuantity; i += 1) {
                const item = this.items[i];

                if (
                    i >= this.currentItem &&
                    i < this.currentItem + this.itemsPerPage
                ) {
                    if (item.classList.contains("js-active")) {
                        // Already there, so no transition at all
                        this.isTransitioning = false;
                    } else {
                        item.classList.add("js-active");
                    }
                } else if (item.classList.contains("js-active")) {
                    item.classList.add("js-last");
                    item.classList.remove("js-active");

                    setTimeout(() => {
                        item.classList.remove("js-last");
                        this.isTransitioning = false;
                    }, this.transitionDelay);
                }
            }

            // Set "js-first" class
            this.occurrence += 1;
            if (this.occurrence < 2) {
                for (let i = 0; i < this.itemsQuantity; i += 1) {
                    const item = this.items[i];

                    if (
                        i >= this.currentItem &&
                        i < this.currentItem + this.itemsPerPage
                    ) {
                        item.classList.add("js-first");
                        setTimeout(() => {
                            item.classList.remove("js-first");
                            this.isTransitioning = false;
                        }, this.transitionDelay);
                    }
                }
            }
        }

        clearInterval(this.playIntervalID);
        if (this.autoplay && this.isVisible) {
            if (this.pagesQuantity > 1 && this.delay > 0) {
                this.playIntervalID = setInterval(
                    this.nextPage.bind(this, new MouseEvent("void")),
                    this.delay,
                );
            }
        }
    }

    public nextPage(event: MouseEvent | Touch) {
        const page =
            event instanceof MouseEvent || this.renderType === RenderType.Async
                ? this.currentPage + 1
                : this.currentPage +
                  (this.currentPage < this.pagesQuantity - 1 ? 1 : 0);

        this.gotoPage(page);
    }

    public previousPage(event: MouseEvent | Touch) {
        const page =
            event instanceof MouseEvent || this.renderType === RenderType.Async
                ? this.currentPage - 1
                : this.currentPage - (this.currentPage > 0 ? 1 : 0);

        this.gotoPage(page);
    }

    /* --- Swipe --- */
    public blockClick(event: MouseEvent) {
        if (this.blockClickEventDistance > 30) {
            event.preventDefault();
        } else {
            this.swipe.move = false;
        }
    }

    public touchStart(event: MouseEvent | Touch) {
        const startEvent =
            "TouchEvent" in window && event instanceof TouchEvent
                ? event.changedTouches[0]
                : event;

        this.swipe.x = startEvent.clientX;
        this.swipe.y = startEvent.clientY;
        this.swipe.time = Date.now();
        this.swipe.move = true;
        this.blockClickEventDistance = 0;
        this.hasCursorDown = true;
    }

    public touchMove(event: MouseEvent | Touch) {
        if (this.swipe.move) {
            const moveEvent =
                "TouchEvent" in window && event instanceof TouchEvent
                    ? event.changedTouches[0]
                    : event;
            // [TODO] Move the carousel to follow the touch/mouse move
            const detail = {
                x: moveEvent.clientX - this.swipe.x,
                y: moveEvent.clientY - this.swipe.y,
            };

            this.blockClickEventDistance = Math.max(
                Math.abs(detail.x),
                Math.abs(detail.y),
                this.blockClickEventDistance,
            );
        }
    }

    public touchEnd(event: MouseEvent | Touch) {
        this.hasCursorDown = false;

        if (this.swipe.move) {
            const endEvent =
                "TouchEvent" in window && event instanceof TouchEvent
                    ? event.changedTouches[0]
                    : event;
            const now = Date.now();
            const detail = {
                x: endEvent.clientX - this.swipe.x,
                y: endEvent.clientY - this.swipe.y,
            };

            // Horizontal swipe
            if (this.orientation === Orientation.Horizontal) {
                if (
                    Math.abs(endEvent.clientY - this.swipe.y) < 30 &&
                    now - this.swipe.time < 1000
                ) {
                    if (detail.x > 30) {
                        // swipe left
                        this.autoplay = false;
                        this.previousPage(event);
                    } else if (detail.x < -30) {
                        // swipe right
                        this.autoplay = false;
                        this.nextPage(event);
                    }
                }
            }

            // Vertical Swipe
            if (this.orientation === Orientation.Vertical) {
                if (
                    Math.abs(endEvent.clientX - this.swipe.x) < 30 &&
                    now - this.swipe.time < 1000
                ) {
                    if (detail.y > 30) {
                        // swipe down
                        this.previousPage(event);
                    } else if (detail.y < -30) {
                        // swipe up
                        this.nextPage(event);
                    }
                }
            }

            this.swipe.move = false;
        }
    }

    public onWheel(event: WheelEvent) {
        // Vertical Swipe
        if (this.orientation === Orientation.Vertical) {
            if (event.deltaY > 0) {
                // swipe up
                this.nextPage(event);
            } else if (event.deltaY < 0) {
                // swipe down
                this.previousPage(event);
            }
        }
    }
}
