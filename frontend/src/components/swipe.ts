import { Vue, Component } from "vue-property-decorator";

@Component
class Swipe extends Vue {
    public blockClickEventDistance = 0;
    public swipe = {
        move: false,
        time: 0,
        x: 0,
        y: 0,
    };
    public hasCursorDown = false;

    public blockClick(event: MouseEvent) {
        if (this.blockClickEventDistance > 30) {
            event.preventDefault();
        } else {
            this.swipe.move = false;
            this.$emit("swipeend", { x: 0, y: 0 });
        }
    }

    public touchStart(event: MouseEvent | TouchEvent) {
        const startEvent = event instanceof TouchEvent ? event.changedTouches[0] : event;

        this.swipe.x = startEvent.clientX;
        this.swipe.y = startEvent.clientY;
        this.swipe.time = Date.now();
        this.swipe.move = true;
        this.blockClickEventDistance = 0;
        this.hasCursorDown = true;
    }

    public touchMove(event: MouseEvent | TouchEvent) {
        if (this.swipe.move) {
            const moveEvent = event instanceof TouchEvent ? event.changedTouches[0] : event;
            const detail = {
                x: moveEvent.clientX - this.swipe.x,
                y: moveEvent.clientY - this.swipe.y,
            };

            this.blockClickEventDistance = Math.max(
                Math.abs(detail.x),
                Math.abs(detail.y),
                this.blockClickEventDistance,
            );

            this.$emit("swipemove", detail);
        }
    }

    public touchEnd(event: MouseEvent | TouchEvent) {
        this.hasCursorDown = false;

        if (this.swipe.move) {
            const endEvent = event instanceof TouchEvent ? event.changedTouches[0] : event;
            const now = Date.now();
            const detail = {
                x: endEvent.clientX - this.swipe.x,
                y: endEvent.clientY - this.swipe.y,
            };

            if (Math.abs(endEvent.clientY - this.swipe.y) < 30 && now - this.swipe.time < 1000) {
                if (detail.x > 30) {
                    this.$emit("swiperight");
                } else if (detail.x < -30) {
                    this.$emit("swipeleft");
                }
            }

            if (Math.abs(endEvent.clientX - this.swipe.x) < 30 && now - this.swipe.time < 1000) {
                if (detail.y > 30) {
                    this.$emit("swipedown");
                } else if (detail.y < -30) {
                    this.$emit("swipeup");
                }
            }

            this.$emit("swipeend", detail);
            this.swipe.move = false;
        }
    }

    public onWheel(event: WheelEvent) {
        if (event.deltaY > 0) {
            this.$emit("swipeup");
        } else if (event.deltaY < 0) {
            this.$emit("swipedown");
        }
    }
}

export default Swipe;
