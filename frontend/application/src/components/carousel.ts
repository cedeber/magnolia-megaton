import { Vue, Component, Prop } from "vue-property-decorator";
import verticalState from "../helpers/vertical-state";
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

    @Prop({ type: Number, default: 1 })
    public rows!: number; // number of colums, overwrite minWidth

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

    @Prop({ type: Number, default: 0 })
    public itemRatio!: number;

    @Prop({ type: Number, default: 0 })
    public itemHeight!: number;

    @Prop({ type: String, default: RenderType.Linear })
    public renderType!: RenderType;

    @Prop({ type: String, default: Orientation.Horizontal })
    public orientation!: Orientation;

    @Prop({ type: Number, default: 0 })
    public startAt!: number; // first item to show

    @Prop({ type: Number, default: 1500 })
    public transitionDelay!: number; // duration of the transition animation

    // Variables
    public carouselWidth = 0; // used to control the resize event
    public currentItem = -1; // currently shown item, currently badly used
    public currentSlide = 1; // currently shown slide
    public currentLeftPos = 1;
    public rowRestItems = 0;
    public decal = 0; // used to calculate slide start position depending on items per slide
    public doDecal = true;
    public itemsPerSlide = 1; // number of items per slide depending on min-width
    public itemsPerRow = 1; // number of items per slide depending on min-width
    public itemsLeft = 0; // number of items per slide depending on min-width
    public itemsQuantity = 0; // number of items
    public itemInnerWidth = 0; // items min width
    public itemInnerHeight = 0; // items min width
    public itemOuterHeight = 0; // items min height
    public occurrence = 0; // number of changes. Used to detect "js-first"
    public slidesQuantity = 1; // number of slides depending on min-width
    public playIntervalID = 0; // setInterval UID fot the animation
    public sliderHeight = 0;
    public nbOfRows = 1; // number of items per slide depending on min-width

    // State
    public isLoaded = false;
    // public isMoving = false;
    public isReverse = false;
    public isSingleSlide = false;
    public isTransitioning = false;
    public onFirstSlide = false;
    public onLastSlide = false;
    public isVisible = false;

    // Content
    public items?: HTMLCollection | any[];
    public slider: Element | null = null;
    public sliderStyles = {
        height: "0px",
    };
    public itemsContainer: Element | null = null;
    public itemsContainerStyles = {
        width: "0px",
        height: "0px",
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
            if (
                this.isVisible &&
                this.autoplay &&
                this.slidesQuantity > 1 &&
                this.delay > 0
            ) {
                this.playIntervalID = setInterval(
                    this.nextSlide.bind(this, new MouseEvent("void")),
                    this.delay,
                );
            }
        });

        observer.observe(this.$el);
    }

    get updateSliderHeight() {
        let sliderHeightStr;

        switch (this.renderType) {
            case RenderType.Linear:
                sliderHeightStr = this.sliderHeight > 0
                    ? "height:" + this.sliderHeight + "px"
                    : "height:100%";
                break;
            case RenderType.Async:
                sliderHeightStr = this.sliderHeight > 0
                    ? "height:" + this.sliderHeight + "px"
                    : "height:100%";
                break;
        }

        return sliderHeightStr;
    }

    public setupDOM() {
        this.slider = this.$el.querySelector(".slider");
        this.itemsContainer = this.$el.querySelector(".slides");
        this.items =
            this.itemsContainer == undefined
                ? undefined
                : this.itemsContainer.children;
        this.itemsQuantity = this.items == undefined ? 0 : this.items.length;
    }

    public init() {
        if (this.asHero) {
            slideLoaded().then(() => {
                setHeroHeight(this.$el);
            });
        }

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

        this.itemsPerRow = Math.max(
            Math.floor(this.carouselWidth / getWidth(this.minWidth)),
            Math.ceil(this.carouselWidth / getWidth(this.maxWidth)),
        );

        const itemStyle = this.items && this.items[0] ?
            this.items[0].currentStyle || window.getComputedStyle(this.items[0])
            : null;

        let itemPadding = 0;
        let itemMarginBottom = 0;

        if (itemStyle) {
            itemPadding =
                parseFloat(itemStyle.paddingLeft) +
                parseFloat(itemStyle.paddingRight);
            itemMarginBottom =
                parseFloat(itemStyle.marginBottom);
        }

        this.itemInnerWidth = (this.carouselWidth + itemPadding) / this.itemsPerRow;

        if(this.itemHeight) {
            this.itemInnerHeight = itemStyle ? this.itemHeight || parseFloat(itemStyle.height) : this.itemHeight || 0
        }
        else if (this.itemRatio) {
            this.itemInnerHeight = (this.itemInnerWidth - itemPadding) * this.itemRatio;
        }
        else if (itemStyle) {
            this.itemInnerHeight = parseFloat(itemStyle.height)
        }
        else {
            this.itemInnerHeight = 0;
        }

        this.itemOuterHeight = this.itemInnerHeight + itemMarginBottom;

        if(window.innerWidth < 768) {
            this.nbOfRows = 1;
        }
        else {
            this.nbOfRows = this.rows;
        }
        this.itemsPerSlide = this.itemsPerRow * this.nbOfRows;
        this.slidesQuantity = Math.ceil(this.itemsQuantity / this.itemsPerSlide);

        this.onFirstSlide = false;
        this.onLastSlide = false;
        this.isSingleSlide = false;

        switch (this.renderType) {
            case RenderType.Linear:
                this.itemsContainerStyles.width =
                    this.orientation === Orientation.Horizontal
                        ? `${this.slidesQuantity * 100}%`
                        : "100%";

                this.itemsContainerStyles.height =
                    this.orientation === Orientation.Vertical
                        ? `${this.slidesQuantity * 100}%`
                        : "100%";
                break;
            case RenderType.Async:
                this.itemsContainerStyles.width =
                    this.orientation === Orientation.Horizontal
                        ? `${this.slidesQuantity * 100}%`
                        : "100%";

                this.itemsContainerStyles.height =
                    this.orientation === Orientation.Vertical
                        ? `${this.slidesQuantity * 100}%`
                        : `${this.sliderHeight}px`;
                break;
        }

        // [TODO] Could have been done with another component or template?
        if (!(this.items == undefined)) {
            this.itemsLeft = this.itemsQuantity % this.itemsPerSlide;

            for (let i = 0; i < this.itemsQuantity; ) {
                for (
                    let j = 0;
                    j < this.itemsPerSlide && i < this.itemsQuantity;
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
                            itemStyles.width = `${this.itemInnerWidth}px`;
                            itemStyles.height = `${this.itemInnerHeight}px`;
                            itemStyles.left = "";
                            break;

                        case RenderType.Async:
                            itemStyles.position = "absolute";

                            const leftPosInSlide = j % this.itemsPerRow;
                            const leftPosOfSlide = Math.floor(i / this.itemsPerSlide) * this.itemsPerRow;
                            const topPosInSlide = Math.floor(j / this.itemsPerRow);

                            itemStyles.width =
                                `${this.itemInnerWidth}px`;
                            itemStyles.height =
                                `${this.itemInnerHeight}px`;
                            itemStyles.left =
                                `${this.itemInnerWidth * (leftPosInSlide + leftPosOfSlide) }px`;
                            itemStyles.top =
                                `${this.itemOuterHeight * topPosInSlide }px`;

                            break;
                    }

                    i += 1;
                }
            }
        }

        // Set class if it is a single slide Carousel
        this.isSingleSlide = this.slidesQuantity === 1;

        this.sliderHeight = this.itemInnerHeight + this.itemOuterHeight * (this.nbOfRows - 1);
        // console.log("this.itemInnerHeight:", this.itemInnerHeight);
        // console.log("this.nbOfRows:", this.nbOfRows);
        // console.log("this.sliderHeight:", this.sliderHeight);

        switch (this.renderType) {
            case RenderType.Linear:
                this.itemsContainerStyles.height =
                    this.orientation === Orientation.Vertical
                        ? `${this.slidesQuantity * 100}%`
                        : "100%";
                break;
            case RenderType.Async:
                // // console.log("Async");
                this.itemsContainerStyles.height =
                    this.orientation === Orientation.Vertical
                        ? `${this.slidesQuantity * 100}%`
                        : `${this.sliderHeight}px`;
                break;
        }

        // Set class if it is a single slide Gallery
        this.isSingleSlide = this.slidesQuantity === 1;
        this.decal = 100;
        this.isLoaded = true;
        this.gotoSlide(
            Math.floor(
                (this.currentItem < 0 ? this.startAt : this.currentItem) /
                    this.itemsPerSlide,
            ),
        );
    }

    public gotoItem(item: number) {
        const slideIndex = Math.floor(item / this.itemsPerSlide);
        this.gotoSlide(slideIndex);
    }

    public gotoSlide(slide: number) {
        if (this.isTransitioning && this.renderType !== RenderType.Linear) {
            return;
        }

        this.isTransitioning = true;

        // Reverse mode
        this.isReverse =
            slide < 0 && this.renderType === RenderType.Linear
                ? false
                : slide < this.currentSlide;

        // Current slide in the possible range
        this.currentSlide =
            slide < 0
                ? this.slidesQuantity - 1
                : slide >= this.slidesQuantity
                    ? 0
                    : slide;

        // Do we show the last slide?
        const lastSlide =
            this.currentSlide >=
            this.slidesQuantity - (this.itemInnerWidth === 0 ? 0 : 1) &&
            this.itemsQuantity % this.itemsPerSlide !== 0;

        // Calculate the last slide decal depending on haw many least item do we have. Sometimes there are less than itemsPerSlide
        this.rowRestItems = this.itemsLeft <= this.itemsPerRow ? this.itemsLeft : this.itemsPerRow;
        // // console.log("rowRestItems:", rowRestItems);
        // // console.log("this.decal:", this.decal);
        // // console.log("lastSlide:", lastSlide);

        this.decal = lastSlide
            ? 100 / this.itemsPerRow * this.rowRestItems
            : this.currentSlide === 0
                ? 100
                : this.decal;
        this.doDecal = lastSlide
            ? true
            : this.currentSlide === 0
                ? false
                : this.doDecal;

        // Move the slider
        switch (this.renderType) {
            case RenderType.Linear:
                const move = -((this.currentSlide - 1) * 100 + this.decal);

                this.currentItem =
                    this.currentSlide * this.itemsPerSlide -
                    (this.doDecal ? this.itemsQuantity % this.itemsPerRow : 0);
                this.itemsContainerStyles.transform =
                    this.orientation === Orientation.Horizontal
                        ? `translateX(${
                            this.slidesQuantity > 1
                                ? move / this.slidesQuantity
                                : 0
                            }%)`
                        : `translateY(${
                            this.slidesQuantity > 1
                                ? move / this.slidesQuantity
                                : 0
                            }%)`;
                break;

            case RenderType.Async:
                // console.log("this.currentSlide:" + this.currentSlide);
                const move2 = -((this.currentSlide - 1) * 100 + this.decal);

                this.currentItem =
                    this.currentSlide * this.itemsPerSlide -
                    (this.doDecal ? this.itemsQuantity % this.itemsPerRow : 0);

                this.currentLeftPos =
                    this.doDecal ? this.currentSlide * this.itemsPerRow - (this.itemsPerRow - this.rowRestItems) : this.currentSlide * this.itemsPerRow;


                // console.log("this.currentSlide:" + this.currentSlide);
                // console.log("this.itemsPerSlide:" + this.itemsPerSlide);
                // console.log("this.currentItem:" + this.currentItem);
                // console.log("this.currentLeftPos:" + this.currentLeftPos);

                // i >= this.currentSlide * this.itemsPerSlide &&
                // i < (this.currentSlide + 1) * this.itemsPerSlide

                this.itemsContainerStyles.transform =
                    this.orientation === Orientation.Horizontal
                        ? `translateX(${
                            this.slidesQuantity > 1
                                ? move2 / this.slidesQuantity
                                : 0
                            }%)`
                        : `translateY(${
                            this.slidesQuantity > 1
                                ? move2 / this.slidesQuantity
                                : 0
                            }%)`;

                break;

            default:
                this.currentItem = this.currentSlide * this.itemsPerSlide;
                break;
        }

        // Slide Style
        this.onFirstSlide = this.currentSlide <= 0;
        this.onLastSlide =
            this.slidesQuantity === 1 ||
            this.currentSlide >=
                this.slidesQuantity - (this.itemInnerWidth === 0 ? 0 : 1);

        // Set current active item, independant from visible elements
        // [TODO] forEach + single component?
        // [TODO] set isActive & isLast
        if (!(this.items == undefined)) {
            for (let i = 0; i < this.itemsQuantity; i += 1) {
                const item = this.items[i];
                const itemLeftPos = i % this.itemsPerRow + ( Math.floor(i / this.itemsPerSlide) * this.itemsPerRow );

                if (
                    itemLeftPos >= this.currentLeftPos &&
                    itemLeftPos < this.currentLeftPos + this.itemsPerRow
                // i >= this.currentSlide * this.itemsPerSlide &&
                // i < (this.currentSlide + 1) * this.itemsPerSlide
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
                        i < this.currentItem + this.itemsPerSlide
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
            if (this.slidesQuantity > 1 && this.delay > 0) {
                this.playIntervalID = setInterval(
                    this.nextSlide.bind(this, new MouseEvent("void")),
                    this.delay,
                );
            }
        }
    }

    public nextSlide(event: MouseEvent | Touch) {
        const slide =
            event instanceof MouseEvent || this.renderType === RenderType.Async
                ? this.currentSlide + 1
                : this.currentSlide +
                  (this.currentSlide < this.slidesQuantity - 1 ? 1 : 0);

        this.gotoSlide(slide);
    }

    public previousSlide(event: MouseEvent | Touch) {
        const slide =
            event instanceof MouseEvent || this.renderType === RenderType.Async
                ? this.currentSlide - 1
                : this.currentSlide - (this.currentSlide > 0 ? 1 : 0);

        this.gotoSlide(slide);
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
                        this.previousSlide(event);
                    } else if (detail.x < -30) {
                        // swipe right
                        this.autoplay = false;
                        this.nextSlide(event);
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
                        this.previousSlide(event);
                    } else if (detail.y < -30) {
                        // swipe up
                        this.nextSlide(event);
                    }
                }
            }

            this.swipe.move = false;
        }
    }

    public onWheel(_event: WheelEvent) {
        // Vertical Swipe
        /* [FIXME] not really reliable
        if (this.orientation === Orientation.Vertical) {
            if (event.deltaY > 5) {
                // swipe up
                this.nextSlide(event);
            } else if (event.deltaY < -5) {
                // swipe down
                this.previousSlide(event);
            }
        }
        */
    }
}

function setHeroHeight(element: HTMLElement) {
    const carouselTop = verticalState()(element).topPosition;

    element.style.height = `${window.innerHeight - carouselTop}px`;
}

async function slideLoaded() {
    return new Promise(resolve => {
        if (document.readyState === "complete") {
            resolve();
        } else {
            window.addEventListener("load", () => {
                resolve();
            });
        }
    });
}
