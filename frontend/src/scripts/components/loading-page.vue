<template>
    <div id="loading" role="presentation" aria-hidden="true" class="o-loading" v-bind:class="{ 'js-loading': isLoading, 'js-hidden': isHidden }">
        <div class="o-flex-middle loading-overlay" v-bind:class="{ 'js-loading': isLoading }"><img class="image" src="../../assets/square.svg" width="10px" height="10" alt=""></div>
        <div class="opaque-overlay"></div>
        <div class="transparent-overlay"></div>
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

    @keyframes loadingAnimation {
        0% { opacity: 0 }
        10% { transform: translateX(-120px); opacity: 0; }
        35% { opacity: 1; }
        65% { opacity: 1; }
        90% { transform: translateX(120px); opacity: 0; }
        100% { opacity: 0 }
    }

    .o-loading {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 999;
        transition: left 0s, opacity 250ms;
        opacity: 1;
    }

    .opaque-overlay, .transparent-overlay, .loading-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    .loading-overlay {
        z-index: 3;
    }

    .opaque-overlay {
        background: var(--base01);
        z-index: 2;
    }

    .transparent-overlay {
        background: color(var(--base05) alpha(33%));
        z-index: 1;
        -webkit-backdrop-filter: blur(3px);
    }

    .o-loading.js-hidden {
        left: -10000px;
        transition: left 0s 1s, opacity 0s 1s;
        opacity: 0;

        & .opaque-overlay {
            transform: translateX(100%);
            transition: transform 750ms 150ms ease-out;
        }

        & .transparent-overlay {
            transform: translateX(100%);
            transition: transform 530ms 280ms linear;
        }
    }

    .loading-overlay .image {
        opacity: 0;
    }

    .loading-overlay.js-loading .image {
        opacity: 1;
        animation-duration: 1.4s;
        animation-name: loadingAnimation;
        animation-iteration-count: infinite;
        animation-timing-function: linear;
    }
</style>
