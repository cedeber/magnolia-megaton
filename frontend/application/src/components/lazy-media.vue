<template>
    <div>
        <figure ref="figure" class="figure" :class="[{'is-cover': isCover}]">
            <video v-if="video" :autoplay="isAutoplay" :loop="isAutoplay" :muted="isAutoplay" :playsinline="isAutoplay" :controls="!isAutoplay" :poster="video.poster ? video.poster : null"
                   class="container media" :class="[{'js-loaded': source, 'has-fixed-ratio': ratio, 'is-cover': isCover}, position ? position : '']"
                   :src="source" preload="metadata">
                <!--source :src="source" :type="metadata.mimetype"-->
            </video>
            <picture v-else-if="picture" :class="[{'js-loaded': isLoaded, 'has-fixed-ratio': ratio}, position ? position : 'is-center']" class="container">
                <source v-if="picture.extension === 'gif'" :srcset="picture.link">
                <source v-else v-for="(set, query) in picture.sources" :media="query === 'all' ? query : `(max-width:${query})`" :srcset="set">
                <img v-if="source" class="media"
                     :class="[{'is-cover': isCover, 'is-scaled': scaled && !isCover && ratio}, position ? position : 'is-center']"
                     :src="source"
                     :width="width"
                     :height="height"
                     :title="metadata ? (metadata.title || metadata.description || '') : ''"
                     :alt="metadata ? metadata.description : ''">
            </picture>
        </figure>
        <slot v-if="!source"></slot>
    </div>
</template>

<style scoped>
    @import url(../variables.css);

    .figure {
        position: relative;
        overflow: hidden;
        min-height: 100%;
        max-width: 100%;
    }

    .figure.is-cover {
        height: 100%;
    }

    .container {
        display: inline-block;
        width: 100%;
        height: 100%;
        opacity: 0;
        transition: var(--default-timing) 50ms;
    }

    video.container.has-fixed-ratio {
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        min-height: 100%;
        min-width: 100%;
        width: auto;
        height: auto;
        max-width: none;
    }

    video.container.has-fixed-ratio[style] { /* if object-fit polyfill applied */
        transform: none;
    }

    figure.is-cover .container:not(.has-fixed-ratio) {
        display: flex;
    }

    .container.has-fixed-ratio {
        display: block;
        position: absolute;
        top: 0;
        left: 0;
    }

    .container.js-loaded {
        opacity: 1;
    }

    .media {
        display: block;
        height: auto;
        margin-left: auto;
        margin-right: auto;
    }

    .media:not(.is-cover) {
        max-width: 100%;
    }

    .media.is-cover {
        object-fit: cover;
        width: 100%;
        height: 100%;
    }

    @supports (object-fit: scale-down) {
        .media {
            height: auto;
        }
    }

    .container.has-fixed-ratio .media:not(.is-cover) { position: absolute; }
    .container.has-fixed-ratio .media:not(.is-cover):not(.is-scaled).is-center { top: 50%; left: 50%; transform: translate3d(-50%, -50%, 0); }
    .container.has-fixed-ratio .media:not(.is-cover):not(.is-scaled).is-top { top: 0; left: 50%; transform: translate3d(-50%, 0, 0); }
    .container.has-fixed-ratio .media:not(.is-cover):not(.is-scaled).is-right { top: 50%; right: 0; transform: translate3d(0, -50%, 0); }
    .container.has-fixed-ratio .media:not(.is-cover):not(.is-scaled).is-bottom { bottom: 0; left: 50%; transform: translate3d(-50%, 0, 0); }
    .container.has-fixed-ratio .media:not(.is-cover):not(.is-scaled).is-left { top: 50%; left: 0; transform: translate3d(0, -50%, 0); }

    .media.is-left { margin-left: 0; }
    .media.is-right { margin-right: 0; }

    .media.is-cover.is-center { object-position: center; }
    .media.is-cover.is-top { object-position: top; }
    .media.is-cover.is-right { object-position: right; }
    .media.is-cover.is-bottom { object-position: bottom; }
    .media.is-cover.is-left { object-position: left; }

    .media.is-scaled {
        object-fit: contain;
        object-position: center;
        width: 100%;
        height: 100%;
    }

</style>

<script lang="ts" src="./scripts/lazy-media.ts"></script>
