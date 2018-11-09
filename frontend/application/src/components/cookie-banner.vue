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

        cookieName = 'hasCookieConsent';
        isShow = false;
        trackingCookiesNames = ["__utma", "__utmb", "__utmc", "__utmt", "__utmv", "__utmz", "_ga", "_gat"]

        mounted() {
            const hasConsent = this.hasConsent(this.cookieName);

            const isBot = /bot|googlebot|crawler|spider|robot|crawling/i.test(navigator.userAgent);

            if (isBot || this.doNotTrack() || hasConsent == false) {
                return;
            }

            if (hasConsent == true) {
                this.launch();
                return;
            }

            this.isShow = true;
        }

        /**
         * EVERY STATISTICS SCRIPTS COME HERE
         */
        launch() {
            if (this.isProduction) { // Magnolia Public Instance
                console.log("🛰")
            }
        }

        setCookiesConsent(accept = false) {
            this.setCookie(this.cookieName, accept);
            this.isShow = false;

            if (accept) {
                this.launch();
            } else {
                this.deleteTrackingCookies();
            }
        }

        doNotTrack() {
            const dnt = navigator.doNotTrack || window.doNotTrack;
            const canTrack = (dnt !== null && dnt !== undefined) ? (dnt && dnt !== 'yes' && dnt !== '1') : true;

            return !(canTrack || !this.isProduction);
        }

        hasConsent(cookieName) {
            return window.document.cookie.indexOf(cookieName + "=true") > -1 ? true :
                window.document.cookie.indexOf(cookieName + "=false") > -1 ? false : null
        }

        setCookie(cookieName, cookieValue) {
            const date = new Date;
            const cookieTimeout = 33696e6;
            date.setTime(date.getTime() + cookieTimeout);
            window.document.cookie = cookieName + "=" + cookieValue + ";expires=" + date.toUTCString() + ";path=/";
        }

        deleteTrackingCookies() {
            const self = this;
            this.trackingCookiesNames.map(function (cookieName) {
                self.deleteCookie(cookieName)
            })
        }

        deleteCookie(cookieName) {
            let hostname = window.document.location.hostname;
            0 === hostname.indexOf("www.") && (hostname = hostname.substring(4)); // TODO: WHAT IS THIS??!
            window.document.cookie = cookieName + "=; domain=." + hostname + "; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/";
            window.document.cookie = cookieName + "=; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/"
        }
    }
</script>
