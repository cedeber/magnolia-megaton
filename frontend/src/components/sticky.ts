import { Vue, Component, Prop } from "vue-property-decorator";
import "../helpers/vertical-state";

/**
 * @example
 * <sticky :marginTop="30">
 *     <TAG> <!-- Must be a single container: div, p, section... -->
 *         [CONTENT]
 *     </TAG>
 * </sticky>
 */
@Component
class Sticky extends Vue {
    // Decal the detexction form 'marginTop'px from the top of the viewport
    @Prop({ type: Number, default: 0 })
    public marginTop: number;

    // The slot single container
    public element: HTMLElement | null = null;

    /**
     * Mounted hook
     */
    public mounted() {
        this.element = this.$slots.default[0].elm as HTMLElement;

        if (this.element) {
            // Set the height because CSS position will be fixed
            this.$el.style.height = `${this.element.offsetHeight}px`;
            window.requestAnimationFrame(this.stickToTop);
        }
    }

    /**
     * Detect if the element need to be sticky
     */
    public stickToTop() {
        if (this.element) {
            // Look the position form the top of the viewport + marginTop
            const topProgress = this.$el.verticalState.getBoundedState("topProgress", [this.marginTop, 0]);

            if (topProgress >= 1) {
                // sticky
                this.element.style.position = "fixed";
                this.element.style.top = `${this.marginTop}px`;
            } else {
                // static
                this.element.style.position = "";
                this.element.style.top = "";
            }

            // loop±
            window.requestAnimationFrame(this.stickToTop);
        }
    }
}

export default Sticky;
