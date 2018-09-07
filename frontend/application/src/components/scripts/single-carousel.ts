import { Vue, Component, Prop } from "vue-property-decorator";
import verticalState from "../../helpers/vertical-state";
import debounce from "lodash-es/debounce";

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
    asHero!: boolean; // calculate height from top position, at render

    @Prop({ type: Boolean, default: false })
    autoplay!: boolean; // play automatically

    @Prop({ type: Number, default: 5000 })
    delay!: number; // time to show a slide

    @Prop({ type: Number, default: 0 })
    slideRatio!: number;

    @Prop({ type: String, default: RenderType.Linear })
    renderType!: RenderType;

    @Prop({ type: String, default: Orientation.Horizontal })
    orientation!: Orientation;

    // Variables
    carouselWidth = 0; // used to control the resize event
    currentPage = 0; // currently shown page
    pagesQuantity = 0; // number of items
    occurrence = 0; // number of changes. Used to detect "js-first"
    playIntervalID = 0; // setInterval UID fot the animation

    // State
    isLoaded = false;
    isReverse = false;
    isSinglePage = false;
    isTransitioning = false;
    onFirstPage = false;
    onLastPage = false;
    isVisible = false;

    // Content
    items?: HTMLCollection | any[];
    itemsContainer: Element | null = null;
    itemsContainerStyles = {
        width: "0px",
        height: "0px",
        transform: "",
    };

    // Swipe
    blockClickEventDistance = 0;
    swipe = {
        move: false,
        time: 0,
        x: 0,
        y: 0,
    };
    hasCursorDown = false;

    mounted() {
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
                this.pagesQuantity > 1 &&
                this.delay > 0
            ) {
                this.playIntervalID = setInterval(
                    this.nextPage.bind(this, new MouseEvent("void")),
                    this.delay,
                );
            }
        });

        observer.observe(this.$el);
    }

    get updateSliderHeight() {
        return this.slideRatio > 0
            ? "padding-top:" + this.slideRatio + "%"
            : "height:100%";
    }

    setupDOM() {
        this.itemsContainer = this.$el.querySelector(".slides");
        this.items =
            this.itemsContainer == undefined
                ? undefined
                : this.itemsContainer.children;
        this.pagesQuantity = this.items == undefined ? 0 : this.items.length;
    }

    init() {
        if (this.asHero) {
            pageLoaded().then(() => {
                setHeroHeight(this.$el);
            });
        }

        this.carouselWidth = this.$el.offsetWidth;

        if (this.carouselWidth <= 0) {
            return;
        }

        // reset
        this.onFirstPage = false;
        this.onLastPage = false;
        this.isSinglePage = false;

        // slider width or height
        switch (this.renderType) {
            case RenderType.Linear:
                this.itemsContainerStyles.width =
                    this.orientation === Orientation.Horizontal
                        ? `${this.pagesQuantity * 100}%`
                        : "100%";

                this.itemsContainerStyles.height =
                    this.orientation === Orientation.Vertical
                        ? `${this.pagesQuantity * 100}%`
                        : "100%";
                break;

            case RenderType.Async:
                this.itemsContainerStyles.width = "100%";
                this.itemsContainerStyles.height = "100%";
                break;
        }

        // Set class if it is a single page Carousel
        this.isSinglePage = this.pagesQuantity === 1;

        // Set class if it is a single page Carousel
        this.isLoaded = true;
        this.gotoPage(this.currentPage);
    }

    gotoPage(page: number) {
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

        // Move the slider
        switch (this.renderType) {
            case RenderType.Linear:
                const move = -(this.currentPage * 100);

                this.itemsContainerStyles.transform =
                    this.orientation === Orientation.Horizontal
                        ? `translateX(${
                              this.pagesQuantity > 1
                                  ? move / this.pagesQuantity
                                  : 0
                          }%)`
                        : `translateY(${
                              this.pagesQuantity > 1
                                  ? move / this.pagesQuantity
                                  : 0
                          }%)`;
                break;

            case RenderType.Async:
            default:
                break;
        }

        // Page Style
        this.onFirstPage = this.currentPage <= 0;
        this.onLastPage =
            this.pagesQuantity === 1 ||
            this.currentPage >= this.pagesQuantity - 1;

        // Set current active item, independently from visible elements
        if (!(this.items == undefined)) {
            for (let i = 0; i < this.pagesQuantity; i += 1) {
                const item = this.items[i];

                if (i === this.currentPage) {
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
                    }, 1500);
                }
            }

            // Set "js-first" class
            this.occurrence += 1;
            if (this.occurrence < 2) {
                for (let i = 0; i < this.pagesQuantity; i += 1) {
                    const item = this.items[i];

                    if (i === this.currentPage) {
                        item.classList.add("js-first");
                        setTimeout(() => {
                            item.classList.remove("js-first");
                            this.isTransitioning = false;
                        }, 1500);
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

    nextPage(event: MouseEvent | Touch) {
        const page =
            event instanceof MouseEvent || this.renderType === RenderType.Async
                ? this.currentPage + 1
                : this.currentPage +
                  (this.currentPage < this.pagesQuantity - 1 ? 1 : 0);

        this.gotoPage(page);
    }

    previousPage(event: MouseEvent | Touch) {
        const page =
            event instanceof MouseEvent || this.renderType === RenderType.Async
                ? this.currentPage - 1
                : this.currentPage - (this.currentPage > 0 ? 1 : 0);

        this.gotoPage(page);
    }

    /* --- Swipe --- */
    blockClick(event: MouseEvent) {
        if (this.blockClickEventDistance > 30) {
            event.preventDefault();
        } else {
            this.swipe.move = false;
        }
    }

    touchStart(event: MouseEvent | Touch) {
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

    touchMove(event: MouseEvent | Touch) {
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

    touchEnd(event: MouseEvent | Touch) {
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
}

function setHeroHeight(element: HTMLElement) {
    const carouselTop = verticalState()(element).topPosition;

    element.style.height = `${window.innerHeight - carouselTop}px`;
}

async function pageLoaded() {
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
