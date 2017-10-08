<template>
    <div id="loading" role="presentation" aria-hidden="true" class="o-loading o-flex-middle" v-bind:class="{ 'js-loading': isLoading, 'js-hidden': isHidden }">
        <img class="image" src="../../assets/MouseManRunning.gif" width="75" height="auto" alt="">
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from "vue-property-decorator";
    import { applyBeforeQuit, simulateLoading, pageLoaded } from "../utils/loading";

    @Component
    class LoadingPage extends Vue {
        public isLoading = true;
        public isHidden = false;

        mounted() {
            applyBeforeQuit(this.animateQuit);
            Promise.all([simulateLoading(), pageLoaded()]).then(this.animateEnter);
        }

        private animateEnter() {
            this.isHidden = true;
            this.isLoading = false;
        }

        private animateQuit() {
            return new Promise((resolve, _reject) => {
                this.isHidden = false;
                setTimeout(() => { resolve(); }, 135);
            });
        }
    }

    export default LoadingPage;
</script>

<style scoped>
    @import url(../../styles/shared/vars.css);

    .o-loading {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: white;
        z-index: 999;
        transition: opacity 130ms, left 0s;
        opacity: 1;
    }

    .o-loading.js-hidden {
        opacity: 0;
        left: -10000px;
        transition: opacity var(--default-timing), left 0s var(--default-timing);
    }

    .image { opacity: 0; }

    .o-loading.js-loading .image {
        opacity: 1;
        animation-duration: 1.4s;
        animation-name: loadingAnimation;
        animation-iteration-count: infinite;
        animation-timing-function: linear;
    }
</style>
