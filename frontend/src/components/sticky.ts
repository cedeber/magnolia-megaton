import { Vue, Component, Prop } from "vue-property-decorator";
import "../helpers/vertical-state";
import taggr from "../devtools/taggr";

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
    @Prop({ type: Number, default: 0 })
    public marginTop: number; // Detection is done with 'marginTop' pixels from the top of the viewport

    public element: HTMLElement | null = null; // The slot single container
    private isSticky = false;
    private log = taggr("sticky");

    /**
     * Mounted hook
     */
    public mounted() {
        this.element = this.$slots.default[0].elm as HTMLElement;

        if (this.element) {
            // Set the height because CSS position will be fixed
            this.$el.style.height = `${this.element.offsetHeight}px`;
            window.requestAnimationFrame(this.stickToTop);

            this.log.keep(this.element).info(`will be sticky with ${this.marginTop}px as top margin`);
        }
    }

    /**
     * Detect if the element need to be sticky
     */
    public stickToTop() {
        if (this.element) {
            // Look the position form the top of the viewport + marginTop
            const topProgress = this.$el.verticalState.getBoundedState("topProgress", [this.marginTop, 0]);

            if (topProgress >= 1 && !this.isSticky) {
                // sticky
                this.element.style.position = "fixed";
                this.element.style.top = `${this.marginTop}px`;
                this.isSticky = true;
                this.log.info("is sticky");
            } else if (this.isSticky) {
                // static
                this.element.style.position = "";
                this.element.style.top = "";
                this.isSticky = false;
                this.log.info("is static");
            }

            // loop
            window.requestAnimationFrame(this.stickToTop);
        }
    }
}

export default Sticky;
