<template>
    <div class="banner" v-show="isShow">
        <slot name="explanations" class="explanations"></slot>
        <a :href="readMore" class="more" v-html="readMoreLabel"></a>
        <button class="reject" @click="setCookiesConsent(false)" v-html="rejectLabel"></button>
        <button class="accept" @click="setCookiesConsent(true)" v-html="acceptLabel"></button>
    </div>
</template>

<style scoped>
    @import url(../variables.css);

    .banner {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        z-index: 99;
        background: var(--page-background);
        padding: var(--page-gutter-width);
    }
</style>

<script lang="ts">
    import {Vue, Component, Prop} from "vue-property-decorator";
    import storage from '../helpers/proxy-storage';
    // import {loadJS} from "../helpers/async-loader";

    @Component
    export default class CookieBanner extends Vue {
        @Prop({type: String, default: ''})
        readMore!: string;

        @Prop({type: String, default: 'Read More'})
        readMoreLabel!: string;

        @Prop({type: String, default: 'Accept'})
        acceptLabel!: string;

        @Prop({type: String, default: 'Reject'})
        rejectLabel!: string;

        @Prop({type: Boolean, default: true})
        isProduction!: boolean;

        cookieName = '__hasCookieConsent__';
        isShow = false;

        /**
         * EVERY STATISTICS SCRIPTS COME HERE
         */
        launch() {
            if (this.isProduction) { // Magnolia Public Instance
                console.log("🛰");
                // await loadJS('https://www.googletagmanager.com/gtag/js?id=UA-XXXXXXXXX-1');
            }
        }

        mounted() {
            const hasConsent = storage[this.cookieName];

            const isBot = /bot|googlebot|crawler|spider|robot|crawling/i.test(navigator.userAgent);

            if (isBot || this.doNotTrack() || hasConsent === "false") {
                return;
            }

            if (hasConsent === "true") {
                this.launch();
                return;
            }

            this.isShow = true;
        }

        setCookiesConsent(accept = false) {
            storage[this.cookieName] = String(accept);
            this.isShow = false;

            if (accept) {
                this.launch();
            }
        }

        doNotTrack() {
            const dnt = navigator.doNotTrack || window.doNotTrack;
            const canTrack = (dnt !== null && dnt !== undefined) ? (dnt && dnt !== 'yes' && dnt !== '1') : true;

            return !(canTrack || !this.isProduction);
        }
    }
</script>
