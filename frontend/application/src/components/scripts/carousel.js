var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { Vue, Component, Prop } from "vue-property-decorator";
import verticalState from "../../helpers/vertical-state";
import debounce from "lodash-es/debounce";
var RenderType;
(function (RenderType) {
    RenderType["Linear"] = "linear";
    RenderType["Continue"] = "continue";
    RenderType["Async"] = "async";
})(RenderType || (RenderType = {}));
var Orientation;
(function (Orientation) {
    Orientation["Horizontal"] = "horizontal";
    Orientation["Vertical"] = "vertical";
})(Orientation || (Orientation = {}));
var Carousel = (function (_super) {
    __extends(Carousel, _super);
    function Carousel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.carouselWidth = 0;
        _this.currentItem = -1;
        _this.currentPage = 1;
        _this.decal = 0;
        _this.doDecal = true;
        _this.itemsPerPage = 1;
        _this.itemsQuantity = 0;
        _this.itemWidth = 0;
        _this.occurrence = 0;
        _this.pagesQuantity = 1;
        _this.playIntervalID = 0;
        _this.sliderHeight = 0;
        _this.isLoaded = false;
        _this.isReverse = false;
        _this.isSinglePage = false;
        _this.isTransitioning = false;
        _this.onFirstPage = false;
        _this.onLastPage = false;
        _this.isVisible = false;
        _this.itemsContainer = null;
        _this.itemsContainerStyles = {
            width: "0px",
            height: "0px",
            transform: "",
        };
        _this.blockClickEventDistance = 0;
        _this.swipe = {
            move: false,
            time: 0,
            x: 0,
            y: 0,
        };
        _this.hasCursorDown = false;
        return _this;
    }
    Carousel.prototype.created = function () {
    };
    Carousel.prototype.mounted = function () {
        var _this = this;
        this.setupDOM();
        this.init();
        function resize() {
            if (this.isLoaded) {
                this.isLoaded = false;
                this.init();
            }
        }
        window.addEventListener("resize", debounce(resize.bind(this), 300));
        var observer = new IntersectionObserver(function (entries) {
            var carousel = entries[0];
            _this.isVisible = carousel.isIntersecting;
            clearInterval(_this.playIntervalID);
            if (_this.isVisible &&
                _this.autoplay &&
                _this.pagesQuantity > 1 &&
                _this.delay > 0) {
                _this.playIntervalID = setInterval(_this.nextPage.bind(_this, new MouseEvent("void")), _this.delay);
            }
        });
        observer.observe(this.$el);
    };
    Object.defineProperty(Carousel.prototype, "updateSliderHeight", {
        get: function () {
            return this.sliderHeight > 0
                ? "padding-top:" + this.sliderHeight + "%"
                : "height:100%";
        },
        enumerable: true,
        configurable: true
    });
    Carousel.prototype.setupDOM = function () {
        this.itemsContainer = this.$el.querySelector(".slides");
        this.items =
            this.itemsContainer == undefined
                ? undefined
                : this.itemsContainer.children;
        this.itemsQuantity = this.items == undefined ? 0 : this.items.length;
    };
    Carousel.prototype.init = function () {
        var _this = this;
        if (this.asHero) {
            pageLoaded().then(function () {
                setHeroHeight(_this.$el);
            });
        }
        var slider = (this.$el.querySelector(".slider") || this.$el);
        this.carouselWidth = slider.offsetWidth;
        if (this.carouselWidth <= 0) {
            this.isLoaded = true;
            return;
        }
        var getWidth = function (n) {
            return Math.min(_this.columns > 0
                ? _this.carouselWidth / _this.columns
                : n || _this.carouselWidth, _this.carouselWidth);
        };
        this.itemsPerPage = Math.max(Math.floor(this.carouselWidth / getWidth(this.minWidth)), Math.ceil(this.carouselWidth / getWidth(this.maxWidth)));
        this.pagesQuantity = Math.ceil(this.itemsQuantity / this.itemsPerPage);
        this.itemWidth = this.carouselWidth / this.itemsPerPage;
        this.onFirstPage = false;
        this.onLastPage = false;
        this.isSinglePage = false;
        switch (this.renderType) {
            case RenderType.Linear:
                this.itemsContainerStyles.width =
                    this.orientation === Orientation.Horizontal
                        ? this.pagesQuantity * 100 + "%"
                        : "100%";
                this.itemsContainerStyles.height =
                    this.orientation === Orientation.Vertical
                        ? this.pagesQuantity * 100 + "%"
                        : "100%";
                break;
        }
        if (!(this.items == undefined)) {
            var rest = this.itemsQuantity % this.itemsPerPage;
            for (var i = 0; i < this.itemsQuantity;) {
                for (var j = 0; j < this.itemsPerPage && i < this.itemsQuantity; j += 1) {
                    var item = this.items[i];
                    if (!(item instanceof HTMLElement) && !("styles" in item)) {
                        item.styles = {};
                    }
                    var itemStyles = item instanceof HTMLElement ? item.style : item.styles;
                    switch (this.renderType) {
                        case RenderType.Linear:
                            itemStyles.position = "relative";
                            itemStyles.flex = "0 1 auto";
                            itemStyles.width =
                                this.orientation === Orientation.Horizontal
                                    ? "calc(100% / " + (this.pagesQuantity > 1
                                        ? this.itemsPerPage
                                        : this.itemsQuantity) *
                                        this.pagesQuantity + ")"
                                    : "calc(100%)";
                            itemStyles.left = "";
                            itemStyles.height =
                                this.orientation === Orientation.Horizontal
                                    ? "calc(100%)"
                                    : "calc(100% / " + (this.pagesQuantity > 1
                                        ? this.itemsPerPage
                                        : this.itemsQuantity) *
                                        this.pagesQuantity + ")";
                            break;
                        case RenderType.Async:
                            itemStyles.position = "absolute";
                            if (i < this.itemsQuantity - rest) {
                                itemStyles.width =
                                    this.carouselWidth / this.itemsPerPage + "px";
                                itemStyles.left =
                                    this.carouselWidth / this.itemsPerPage * j + "px";
                            }
                            else {
                                itemStyles.width =
                                    this.carouselWidth / rest + "px";
                                itemStyles.left =
                                    this.carouselWidth / rest * j + "px";
                            }
                            break;
                    }
                    i += 1;
                }
            }
        }
        this.isSinglePage = this.pagesQuantity === 1;
        var slidesPadding = 0;
        if (this.items && this.items.length > 0) {
            var slideStyle = this.items[0].currentStyle ||
                window.getComputedStyle(this.items[0]);
            var slidePadding = parseFloat(slideStyle.paddingLeft) +
                parseFloat(slideStyle.paddingRight);
            slidesPadding = slidePadding * this.itemsPerPage;
        }
        var contentW = (this.carouselWidth - slidesPadding) /
            Math.min(this.itemsPerPage, this.itemsQuantity);
        this.sliderHeight = contentW * this.slideRatio / this.carouselWidth;
        this.isSinglePage = this.pagesQuantity === 1;
        this.decal = 100;
        this.isLoaded = true;
        this.gotoPage(Math.floor((this.currentItem < 0 ? this.startAt : this.currentItem) /
            this.itemsPerPage));
    };
    Carousel.prototype.gotoPage = function (page) {
        var _this = this;
        if (this.isTransitioning && this.renderType !== RenderType.Linear) {
            return;
        }
        this.isTransitioning = true;
        this.isReverse =
            page < 0 && this.renderType === RenderType.Linear
                ? false
                : page < this.currentPage;
        this.currentPage =
            page < 0
                ? this.pagesQuantity - 1
                : page >= this.pagesQuantity
                    ? 0
                    : page;
        var lastPage = this.currentPage >=
            this.pagesQuantity - (this.itemWidth === 0 ? 0 : 1) &&
            this.itemsQuantity % this.itemsPerPage !== 0;
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
        switch (this.renderType) {
            case RenderType.Linear:
                var move = -((this.currentPage - 1) * 100 + this.decal);
                this.currentItem =
                    this.currentPage * this.itemsPerPage -
                        (this.doDecal ? this.itemsQuantity % this.itemsPerPage : 0);
                this.itemsContainerStyles.transform =
                    this.orientation === Orientation.Horizontal
                        ? "translateX(" + (this.pagesQuantity > 1
                            ? move / this.pagesQuantity
                            : 0) + "%)"
                        : "translateY(" + (this.pagesQuantity > 1
                            ? move / this.pagesQuantity
                            : 0) + "%)";
                break;
            case RenderType.Async:
            default:
                this.currentItem = this.currentPage * this.itemsPerPage;
                break;
        }
        this.onFirstPage = this.currentPage <= 0;
        this.onLastPage =
            this.pagesQuantity === 1 ||
                this.currentPage >=
                    this.pagesQuantity - (this.itemWidth === 0 ? 0 : 1);
        if (!(this.items == undefined)) {
            var _loop_1 = function (i) {
                var item = this_1.items[i];
                if (i >= this_1.currentItem &&
                    i < this_1.currentItem + this_1.itemsPerPage) {
                    if (item.classList.contains("js-active")) {
                        this_1.isTransitioning = false;
                    }
                    else {
                        item.classList.add("js-active");
                    }
                }
                else if (item.classList.contains("js-active")) {
                    item.classList.add("js-last");
                    item.classList.remove("js-active");
                    setTimeout(function () {
                        item.classList.remove("js-last");
                        _this.isTransitioning = false;
                    }, this_1.transitionDelay);
                }
            };
            var this_1 = this;
            for (var i = 0; i < this.itemsQuantity; i += 1) {
                _loop_1(i);
            }
            this.occurrence += 1;
            if (this.occurrence < 2) {
                var _loop_2 = function (i) {
                    var item = this_2.items[i];
                    if (i >= this_2.currentItem &&
                        i < this_2.currentItem + this_2.itemsPerPage) {
                        item.classList.add("js-first");
                        setTimeout(function () {
                            item.classList.remove("js-first");
                            _this.isTransitioning = false;
                        }, this_2.transitionDelay);
                    }
                };
                var this_2 = this;
                for (var i = 0; i < this.itemsQuantity; i += 1) {
                    _loop_2(i);
                }
            }
        }
        clearInterval(this.playIntervalID);
        if (this.autoplay && this.isVisible) {
            if (this.pagesQuantity > 1 && this.delay > 0) {
                this.playIntervalID = setInterval(this.nextPage.bind(this, new MouseEvent("void")), this.delay);
            }
        }
    };
    Carousel.prototype.nextPage = function (event) {
        var page = event instanceof MouseEvent || this.renderType === RenderType.Async
            ? this.currentPage + 1
            : this.currentPage +
                (this.currentPage < this.pagesQuantity - 1 ? 1 : 0);
        this.gotoPage(page);
    };
    Carousel.prototype.previousPage = function (event) {
        var page = event instanceof MouseEvent || this.renderType === RenderType.Async
            ? this.currentPage - 1
            : this.currentPage - (this.currentPage > 0 ? 1 : 0);
        this.gotoPage(page);
    };
    Carousel.prototype.blockClick = function (event) {
        if (this.blockClickEventDistance > 30) {
            event.preventDefault();
        }
        else {
            this.swipe.move = false;
        }
    };
    Carousel.prototype.touchStart = function (event) {
        var startEvent = "TouchEvent" in window && event instanceof TouchEvent
            ? event.changedTouches[0]
            : event;
        this.swipe.x = startEvent.clientX;
        this.swipe.y = startEvent.clientY;
        this.swipe.time = Date.now();
        this.swipe.move = true;
        this.blockClickEventDistance = 0;
        this.hasCursorDown = true;
    };
    Carousel.prototype.touchMove = function (event) {
        if (this.swipe.move) {
            var moveEvent = "TouchEvent" in window && event instanceof TouchEvent
                ? event.changedTouches[0]
                : event;
            var detail = {
                x: moveEvent.clientX - this.swipe.x,
                y: moveEvent.clientY - this.swipe.y,
            };
            this.blockClickEventDistance = Math.max(Math.abs(detail.x), Math.abs(detail.y), this.blockClickEventDistance);
        }
    };
    Carousel.prototype.touchEnd = function (event) {
        this.hasCursorDown = false;
        if (this.swipe.move) {
            var endEvent = "TouchEvent" in window && event instanceof TouchEvent
                ? event.changedTouches[0]
                : event;
            var now = Date.now();
            var detail = {
                x: endEvent.clientX - this.swipe.x,
                y: endEvent.clientY - this.swipe.y,
            };
            if (this.orientation === Orientation.Horizontal) {
                if (Math.abs(endEvent.clientY - this.swipe.y) < 30 &&
                    now - this.swipe.time < 1000) {
                    if (detail.x > 30) {
                        this.autoplay = false;
                        this.previousPage(event);
                    }
                    else if (detail.x < -30) {
                        this.autoplay = false;
                        this.nextPage(event);
                    }
                }
            }
            if (this.orientation === Orientation.Vertical) {
                if (Math.abs(endEvent.clientX - this.swipe.x) < 30 &&
                    now - this.swipe.time < 1000) {
                    if (detail.y > 30) {
                        this.previousPage(event);
                    }
                    else if (detail.y < -30) {
                        this.nextPage(event);
                    }
                }
            }
            this.swipe.move = false;
        }
    };
    Carousel.prototype.onWheel = function (_event) {
    };
    __decorate([
        Prop({ type: Boolean, default: false }),
        __metadata("design:type", Boolean)
    ], Carousel.prototype, "asHero", void 0);
    __decorate([
        Prop({ type: Boolean, default: false }),
        __metadata("design:type", Boolean)
    ], Carousel.prototype, "autoplay", void 0);
    __decorate([
        Prop({ type: Number, default: 0 }),
        __metadata("design:type", Number)
    ], Carousel.prototype, "columns", void 0);
    __decorate([
        Prop({ type: Number, default: 5000 }),
        __metadata("design:type", Number)
    ], Carousel.prototype, "delay", void 0);
    __decorate([
        Prop({
            type: Number,
            default: 0,
            validator: function (value) {
                return value >= 0;
            },
        }),
        __metadata("design:type", Number)
    ], Carousel.prototype, "maxWidth", void 0);
    __decorate([
        Prop({
            type: Number,
            default: 0,
            validator: function (value) {
                return value >= 0;
            },
        }),
        __metadata("design:type", Number)
    ], Carousel.prototype, "minWidth", void 0);
    __decorate([
        Prop({ type: Number, default: 0 }),
        __metadata("design:type", Number)
    ], Carousel.prototype, "slideRatio", void 0);
    __decorate([
        Prop({ type: String, default: RenderType.Linear }),
        __metadata("design:type", String)
    ], Carousel.prototype, "renderType", void 0);
    __decorate([
        Prop({ type: String, default: Orientation.Horizontal }),
        __metadata("design:type", String)
    ], Carousel.prototype, "orientation", void 0);
    __decorate([
        Prop({ type: Number, default: 0 }),
        __metadata("design:type", Number)
    ], Carousel.prototype, "startAt", void 0);
    __decorate([
        Prop({ type: Number, default: 1500 }),
        __metadata("design:type", Number)
    ], Carousel.prototype, "transitionDelay", void 0);
    Carousel = __decorate([
        Component
    ], Carousel);
    return Carousel;
}(Vue));
export default Carousel;
function setHeroHeight(element) {
    var carouselTop = verticalState()(element).topPosition;
    element.style.height = window.innerHeight - carouselTop + "px";
}
function pageLoaded() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2, new Promise(function (resolve) {
                    if (document.readyState === "complete") {
                        resolve();
                    }
                    else {
                        window.addEventListener("load", function () {
                            resolve();
                        });
                    }
                })];
        });
    });
}
//# sourceMappingURL=carousel.js.map