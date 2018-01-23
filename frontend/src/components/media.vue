<template>
    <figure class="figure">
        <!-- TODO :: explode in 2 separate components -->
        <video v-if="video" :autoplay="isAutoplay" :loop="isAutoplay" :muted="isAutoplay" playsinline="isAutoplay" :controls="!isAutoplay" :poster="picture.link"
               class="container media" :class="[{'js-loaded': source, 'has-fixed-ratio': ratio, 'is-cover': isCover}, position ? position : '']"
               :src="source">
            <!--source :src="source" :type="metadata.mimetype"-->
        </video>
        <picture v-else-if="picture" :class="{'js-loaded': isLoaded, 'has-fixed-ratio': ratio}" class="container">
            <source v-if="picture.extension === 'gif'" :srcset="picture.link">
            <source v-else v-for="(set, query) in picture.sources" :media="query === 'all' ? query : `(max-width:${query})`" :srcset="set">
            <img v-if="source" class="media" :class="[{'is-cover': isCover, 'is-scaled': !isCover && ratio}, position ? position : '']"
                 :src="source"
                 :width="width"
                 :height="height"
                 :title="metadata.title || metadata.description"
                 :alt="metadata.description">
            <slot v-else></slot>
        </picture>
        <figcaption v-if="hasCaption && metadata.caption" class="caption">{{metadata.caption}}</figcaption>
    </figure>
</template>

<script lang="ts" src="./scripts/media.ts"></script>
<style scoped src="./styles/media.css"></style>
