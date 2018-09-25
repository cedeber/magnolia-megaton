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
        background: #444;
        color: #fff;
        padding: 6px;
        font-size: 13px;
        text-align: center;
    }

    .more,
    .accept,
    .reject {
        text-decoration: none;
        background: #222;
        color: #fff;
        border: 1px solid #000;
        cursor: pointer;
        padding: 4px 7px;
        margin: 2px 0;
        font-size: 13px;
        font-weight: bold;
        transition: background 0.07s, color 0.07s, border-color 0.07s;
    }

    .more:hover,
    .more:focus,
    .accept:hover,
    .accept:focus {
        background: #fff;
        color: #222;
    }

    .more {
        margin-left: 7px;
    }

    .reject {
        background: none;
        font-weight: normal;
        color: #ccc;
        cursor: pointer;
        padding: 4px 7px;
        margin: 2px 0;
        border: 1px solid #666;
    }

    .reject:hover,
    .reject:focus {
        border-color: #fff;
        background: #222;
        color: #fff;
    }
</style>

<script lang="ts">
    import {Vue, Component, Prop} from "vue-property-decorator";
    import storage from '../helpers/proxy-storage';

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

        cookieName = '__hasCookieConsent__';
        isShow = false;

        /**
         * EVERY STATISTICS SCRIPTS COME HERE
         */
        launch() {
            console.log("🛰")
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
            const dnt = navigator.doNotTrack || navigator.msDoNotTrack || window.doNotTrack;
            const canTrack = (dnt !== null && dnt !== undefined) ? (dnt && dnt !== 'yes' && dnt !== 1 && dnt !== '1') : true;

            return !canTrack;
        }
    }
</script>
