import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import size from "lodash-es/size";
import debounce from "lodash-es/debounce";

import "./carousel.css";

type RenderType = "linear" | "continue" | "async";

@Component
class Carousel extends Vue {
    // Properties
    @Prop({ type: Boolean, default: false }) public asHero: boolean; // calculate height from top position, at render
    @Prop({ type: Boolean, default: false }) public autoplay: boolean; // play automatically
    @Prop({ type: Number, default: 0 }) public columns: number; // number of colums, overwrite minWidth
    @Prop({ type: Number, default: 5000 }) public delay: number; // time to show a slide
    @Prop({ type: Number, default: 0, validator(value: number) { return value >= 0; } }) public maxWidth: number; // items maximum width
    @Prop({ type: Number, default: 0, validator(value: number) { return value >= 0; } }) public minWidth: number; // items minimum width
    @Prop({ type: String, default: "linear" }) public renderType: RenderType; // "linear" | "continue" | "async"
    @Prop({ type: Number, default: 0 }) public startAt: number; // first item to show
    @Prop({ type: Number, default: 1500 }) public transitionDelay: number; // duration of the transition animation
    @Prop({ type: Array }) public slides: any[];

    // Variables
    public carouselWidth = 0; // used to control the resize event
    public currentItem = -1; // currently shown item, currently badly used
    public currentPage = 1; // currently shown page
    public decal = 0; // used to calculate page start position depending on items per page
    public doDecal = true;
    public itemsPerPage = 1; // number of items per page depending on min-width
    public itemsQuantity = 0;  // number of items
    public itemWidth = 0; // items min width
    public occurrence = 0; // number of changes. Used to detect "js-first"
    public pagesQuantity = 1; // number of pages depending on min-width
    public playIntervalID = 0; // setInterval UID fot the animation

    // State
    public isLoaded = false;
    public isMoving = false;
    public isReverse = false;
    public isSinglePage = false;
    public isTransitioning = false;
    public onFirstPage = false;
    public onLastPage = false;

    // Content
    public items: HTMLCollection | any[] | null = null;
    public itemsContainer: Element | null = null;
    public itemsContainerStyles = {
        width: "0px",
        transform: "",
    };

    @Watch("slides")
    public onSlidesChanged(value: any[]) {
        if (size(value) > 0) {
            this.carouselWidth = this.$el.offsetWidth;
            this.items = this.slides;
            this.itemsQuantity = this.slides.length;

            this.init();
        } else {
            this.items = [];
            this.itemsQuantity = 0;

            this.init();
        }
    }

    public mounted() {
        // As Hero (property)
        const setHeroHeight = function(this: Carousel) {
            const carouselTop: number = (function(this: Carousel) {
                let element = this.$el;
                let top = (element as HTMLElement).offsetTop;

                // tslint:disable-next-line:no-conditional-assignment
                while ((element = element.offsetParent as HTMLElement) !== null && element !== document.body) {
                    top += element.offsetTop;
                }

                return top;
            }).call(this);

            this.$el.style.height = `${window.innerHeight - carouselTop}px`;
        };

        if (this.asHero) {
            if (document.readyState !== "complete") { window.addEventListener("load", setHeroHeight.bind(this)); }
            else { setHeroHeight.call(this); }
        }

        // slides ? JSON Carousel : DOM Carousel
        // JSON Carousel is initialized via the "slides" watcher
        if (size(this.slides) === 0) {
            this.setupDOM();
            this.init();
        }

        // Reset the Carousel after the resize
        // The Carousel's height shouldn't be changed because making the window bigger means you want to see more content
        function resize(this: Carousel) {
            if (this.isLoaded) {
                this.isLoaded = false;
                this.carouselWidth = this.$el.offsetWidth;
                this.init();
            }
        }

        window.addEventListener("resize", debounce(resize.bind(this), 300));
    }

    public setupDOM() {
        this.carouselWidth = this.$el.offsetWidth;

        this.itemsContainer = this.$el.querySelector(".slides");
        this.items = this.itemsContainer == undefined ? null : this.itemsContainer.children;
        this.itemsQuantity = this.items === null ? 0 : this.items.length;
    }

    public init() {
        if (this.carouselWidth <= 0) { this.isLoaded = true; return; }

        const getWidth = (n: number) => Math.min(this.columns > 0 ? this.carouselWidth / this.columns : n || this.carouselWidth, this.carouselWidth);

        this.itemsPerPage = Math.max(Math.floor(this.carouselWidth / getWidth(this.minWidth)), Math.ceil(this.carouselWidth / getWidth(this.maxWidth)));
        this.pagesQuantity = Math.ceil(this.itemsQuantity / this.itemsPerPage);
        this.itemWidth = this.carouselWidth / this.itemsPerPage;

        this.onFirstPage = false;
        this.onLastPage = false;
        this.isSinglePage = false;

        switch (this.renderType) {
            case "linear":
                this.itemsContainerStyles.width = `${this.pagesQuantity * 100}%`;
                break;
        }

        // [TODO] Could have been done with another component or template?
        if (!(this.items == undefined)) {
            const rest = this.itemsQuantity % this.itemsPerPage;
            const itemWidth = 100 / ((this.pagesQuantity > 1 ? this.itemsPerPage : this.itemsQuantity) * this.pagesQuantity);

            for (let i = 0; i < this.itemsQuantity;) {
                for (let j = 0; j < this.itemsPerPage && i < this.itemsQuantity; j += 1) {
                    const item = this.items[i];

                    if (!(item instanceof HTMLElement) && !("styles" in item)) {
                        item.styles = {};
                    }

                    const itemStyles: HTMLElement["style"] = item instanceof HTMLElement ? item.style : item.styles;

                    switch (this.renderType) {
                        case "linear":
                            itemStyles.position = "relative";
                            itemStyles.flex = `0 1 ${itemWidth}%`;
                            itemStyles.left = "";
                            break;

                        case "async":
                            itemStyles.position = "absolute";

                            if (i < this.itemsQuantity - rest) {
                                itemStyles.width = `${this.carouselWidth / this.itemsPerPage}px`;
                                itemStyles.left = `${this.carouselWidth / this.itemsPerPage * j}px`;
                            }
                            else {
                                itemStyles.width = `${this.carouselWidth / rest}px`;
                                itemStyles.left = `${this.carouselWidth / rest * j}px`;
                            }

                            break;
                    }
                    i += 1;
                }
            }
        }

        // Set class if it is a single page Carousel
        this.isSinglePage = this.pagesQuantity === 1;

        this.decal = 100;
        this.isLoaded = true;
        this.gotoPage(Math.floor((this.currentItem < 0 ? this.startAt : this.currentItem) / this.itemsPerPage));
    }

    public gotoPage(page: number) {
        if (this.isTransitioning && this.renderType !== "linear") { return; }
        this.isTransitioning = true;

        // Reverse mode
        this.isReverse = page < 0 && this.renderType === "linear" ? false : page < this.currentPage;

        // Current page in the possible range
        this.currentPage = page < 0 ? this.pagesQuantity - 1 : page >= this.pagesQuantity ? 0 : page;

        // Do we show the last page?
        const lastPage = this.currentPage >= this.pagesQuantity - (this.itemWidth === 0 ? 0 : 1)
            && this.itemsQuantity % this.itemsPerPage !== 0;

        // Calculate the last page decal depending on haw many least item do we have. Sometimes there are less than itemsPerPage
        this.decal = lastPage ? 100 / this.itemsPerPage * (this.itemsQuantity % this.itemsPerPage) : this.currentPage === 0 ? 100 : this.decal;
        this.doDecal = lastPage ? true : this.currentPage === 0 ? false : this.doDecal;

        // Move the slider
        switch (this.renderType) {
            case "linear":
                const move = -((this.currentPage - 1) * 100 + this.decal);
                this.currentItem = this.currentPage * this.itemsPerPage - (this.doDecal ? (this.itemsQuantity % this.itemsPerPage) : 0);
                this.itemsContainerStyles.transform = `translateX(${this.pagesQuantity > 1 ? move / this.pagesQuantity : 0}%)`;
                break;

            case "async":
            default:
                this.currentItem = this.currentPage * this.itemsPerPage;
                break;
        }

        // Page Style
        this.onFirstPage = this.currentPage <= 0;
        this.onLastPage = this.pagesQuantity === 1 || this.currentPage >= this.pagesQuantity - (this.itemWidth === 0 ? 0 : 1);

        // Set current active item, independant from visible elements
        // [TODO] forEach + single component?
        // [TODO] set isActive & isLast
        if (!(this.items == undefined)) {
            for (let i = 0; i < this.itemsQuantity; i += 1) {
                const item = this.items[i];

                if (i >= this.currentItem && i < this.currentItem + this.itemsPerPage) {
                    if (item.classList.contains("js-active")) {
                        // Already there, so no transition at all
                        this.isTransitioning = false;
                    } else {
                        item.classList.add("js-active");
                    }
                }
                else if (item.classList.contains("js-active")) {
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

                    if (i >= this.currentItem && i < this.currentItem + this.itemsPerPage) {
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
        if (this.autoplay) {
            if (this.pagesQuantity > 1 && this.delay > 0) {
                this.playIntervalID = setInterval(this.nextPage.bind(this, new MouseEvent("void")), this.delay);
            }
        }
    }

    public nextPage(event: Event): void {
        const page = event instanceof MouseEvent || this.renderType === "async" ?
            this.currentPage + 1 :
            this.currentPage + (this.currentPage < this.pagesQuantity - 1 ? 1 : 0);

        this.gotoPage(page);
    }

    public previousPage(event: Event): void {
        const page = event instanceof MouseEvent || this.renderType === "async" ?
            this.currentPage - 1 :
            this.currentPage - (this.currentPage > 0 ? 1 : 0);

        this.gotoPage(page);
    }
}

export { Carousel };
