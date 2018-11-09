var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Vue, Component } from "vue-property-decorator";
let Swipe = class Swipe extends Vue {
    constructor() {
        super(...arguments);
        this.blockClickEventDistance = 0;
        this.swipe = {
            move: false,
            time: 0,
            x: 0,
            y: 0,
        };
        this.hasCursorDown = false;
    }
    blockClick(event) {
        if (this.blockClickEventDistance > 30) {
            event.preventDefault();
        }
        else {
            this.swipe.move = false;
            this.$emit("swipeend", { x: 0, y: 0 });
        }
    }
    touchStart(event) {
        const startEvent = "TouchEvent" in window && event instanceof TouchEvent ? event.changedTouches[0] : event;
        this.swipe.x = startEvent.clientX;
        this.swipe.y = startEvent.clientY;
        this.swipe.time = Date.now();
        this.swipe.move = true;
        this.blockClickEventDistance = 0;
        this.hasCursorDown = true;
    }
    touchMove(event) {
        if (this.swipe.move) {
            const moveEvent = "TouchEvent" in window && event instanceof TouchEvent ? event.changedTouches[0] : event;
            const detail = {
                x: moveEvent.clientX - this.swipe.x,
                y: moveEvent.clientY - this.swipe.y,
            };
            this.blockClickEventDistance = Math.max(Math.abs(detail.x), Math.abs(detail.y), this.blockClickEventDistance);
            this.$emit("swipemove", detail);
        }
    }
    touchEnd(event) {
        this.hasCursorDown = false;
        if (this.swipe.move) {
            const endEvent = "TouchEvent" in window && event instanceof TouchEvent ? event.changedTouches[0] : event;
            const now = Date.now();
            const detail = {
                x: endEvent.clientX - this.swipe.x,
                y: endEvent.clientY - this.swipe.y,
            };
            if (Math.abs(endEvent.clientY - this.swipe.y) < 30 && now - this.swipe.time < 1000) {
                if (detail.x > 30) {
                    this.$emit("swiperight");
                }
                else if (detail.x < -30) {
                    this.$emit("swipeleft");
                }
            }
            if (Math.abs(endEvent.clientX - this.swipe.x) < 30 && now - this.swipe.time < 1000) {
                if (detail.y > 30) {
                    this.$emit("swipedown");
                }
                else if (detail.y < -30) {
                    this.$emit("swipeup");
                }
            }
            this.$emit("swipeend", detail);
            this.swipe.move = false;
        }
    }
    onWheel(event) {
        if (event.deltaY > 0) {
            this.$emit("swipeup");
        }
        else if (event.deltaY < 0) {
            this.$emit("swipedown");
        }
    }
};
Swipe = __decorate([
    Component
], Swipe);
export default Swipe;
//# sourceMappingURL=swipe.js.map