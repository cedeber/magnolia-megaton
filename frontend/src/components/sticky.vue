<template>
    <div class="o-sticky">
        <slot></slot>
    </div>
</template>

<script lang="ts">
    import { Vue, Component, Prop } from "vue-property-decorator";
    import "../helpers/vertical-state";

    @Component
    class Sticky extends Vue {
        @Prop({type: Number, default: 0}) public marginTop: number;

        public element: HTMLElement | null = null;

        public mounted() {
            this.element = this.$slots.default[0].elm as HTMLElement;

            if (this.element) {
                window.requestAnimationFrame(this.stickToTop);
            }
        }

        public stickToTop() {
            if (this.element) {
                const topProgress = this.$el.verticalState.getBoundedState("topProgress", [this.marginTop, 0]);

                if (topProgress >= 1) {
                    this.element.style.position = "fixed";
                    this.element.style.top = `${this.marginTop}px`;
                }
                else {
                    this.element.style.position = "";
                    this.element.style.top = "";
                }

                window.requestAnimationFrame(this.stickToTop);
            }
        }
    }

    export default Sticky;
</script>
