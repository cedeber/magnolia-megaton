<template>
    <div v-bind:data-render="renderType"
         v-bind:data-orientation="orientation"
         v-bind:class="{ 'js-loaded': isLoaded, 'js-first-page': onFirstPage, 'js-last-page': onLastPage, 'js-single-page': isSinglePage, 'js-reverse': isReverse, }">
        <div class="slider"
             v-bind:style="updateSliderHeight"
             v-on:touchstart="touchStart"
             v-on:touchmove="touchMove"
             v-on:touchend="touchEnd"
             v-on:mousedown="touchStart"
             v-on:mousemove="touchMove"
             v-on:mouseup="touchEnd"
             v-on:mouseleave="touchEnd"
             v-on:click.capture="blockClick"
             v-on:wheel="onWheel"
             v-on:dragstart.prevent
             v-bind:class="{ 'js-cursor-down': hasCursorDown }">
            <div class="slides o-flex" v-bind:style="itemsContainerStyles">
                <slot name="slides"></slot>
            </div>
        </div>
        <div class="controls" v-if="pagesQuantity > 1">
            <template v-for="(_page, index) in pagesQuantity">
                <button class="bullet" v-on:click="gotoPage(index)" v-bind:class="{ 'js-active': (currentPage === index) }">
                    <!--span class="is-visually-hidden">${i18n["carousel.show"]} {{ index + 1 }} ${i18n["carousel.showof"]} {{ pagesQuantity }}</span-->
                </button>
            </template>
            <button v-on:click="previousPage" class="previous-button">
                ❮
                <!--span class="is-visually-hidden">${i18n["carousel.previous"]}</span-->
            </button>
            <button v-on:click="nextPage" class="next-button">
                ❯
                <!--span class="is-visually-hidden">${i18n["carousel.next"]}</span-->
            </button>
        </div>
    </div>
</template>

<style>
@import url(../variables.css);

:root {
    --carousel-transition-timing: 350ms;
    --carousel-transition-nonlinear: 1.5s;
    --carousel-delay: 5s;
    --carousel-scale: 1.1;
}

/*
       ┌──────────────┐
       │   CAROUSEL   │
       └──────────────┘
    */
.o-carousel {
    opacity: 0;
    will-change: opacity;
    transition: opacity 0s;
    width: 100%;
}

.o-carousel.js-loaded {
    opacity: 1;
    transition: opacity var(--default-timing) 50ms;
}

.o-carousel,
.o-carousel .slider {
    display: block;
    position: relative;
}

.o-carousel .slider {
    overflow: hidden;
}

.o-carousel .slides {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
}

.o-carousel .slide {
    position: relative;
    width: 100%;
    height: 100%;
    margin: 0;
}

/*
       ┌─────────────┐
       │   GUTTERS   │
       └─────────────┘
    */
.o-carousel.has-inner-gutter {
    margin-left: calc(var(--layout-gutter-width) / -2);
    margin-right: calc(var(--layout-gutter-width) / -2);
    width: calc(100% + var(--layout-gutter-width));
}

.o-carousel.has-inner-gutter .slide {
    padding-left: calc(var(--layout-gutter-width) / 2);
    padding-right: calc(var(--layout-gutter-width) / 2);
}

.o-carousel.has-inner-gutter .slide-inner {
    position: relative;
}

/*
       ┌─────────────────────────────┐
       │   FOREGROUND & BACKGROUND   │
       └─────────────────────────────┘
    */
.o-carousel .foreground,
.o-carousel .background {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
}

.o-carousel .background {
    width: 100%;
    z-index: -1;
}

.o-carousel .foreground {
    width: calc(100% - 2 * var(--page-gutter-width));
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;

    color: white;
}

.o-carousel .foreground .title {
    color: inherit;
}

/*
       ┌────────────────────────────────┐
       │ ANIMATION: LINEAR & HORIZONTAL │
       └────────────────────────────────┘
    */
.o-carousel[data-render="linear"][data-orientation="horizontal"] .slides {
    transition: transform var(--carousel-transition-timing);
    display: flex;
    flex-flow: row nowrap;
}

/*
       ┌──────────────────────────────┐
       │ ANIMATION: LINEAR & VERTICAL │
       └──────────────────────────────┘
    */
.o-carousel[data-render="linear"][data-orientation="vertical"] .slides {
    transition: transform var(--carousel-transition-timing);
    display: flex;
    flex-flow: column nowrap;
}

/*
       ┌───────────────────┐
       │ ANIMATION: ASYNC  │
       └───────────────────┘
    */
.o-carousel[data-render="async"] .slide {
    overflow: hidden;
    top: 0;
    left: 0;
    z-index: 1;
    opacity: 0;
    transition: 1s;
    transition-timing-function: linear;
    will-change: opacity;
}

.o-carousel[data-render="async"] .slide.js-last {
    z-index: 2;
    opacity: 1;
    transition: opacity var(--carousel-transition-timing);
}

.o-carousel[data-render="async"] .slide.js-active {
    z-index: 3;
    opacity: 1;
    transition: opacity var(--carousel-transition-nonlinear);
}

/*
       ┌───────────┐
       │   SWIPE   │
       └───────────┘
    */
/* [FIXME]
    .o-carousel .slides.js-moving {
        transition-duration: 0s;
    }

    .o-carousel.js-swipe .slide {
        cursor: move;
        cursor: -webkit-grab;
        cursor: grab;

        -webkit-touch-callout: none;

        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;

        -webkit-user-drag: none;
        user-drag: none;
    }

    .o-carousel .js-swipe.js-cursor-down .slide {
        cursor: -webkit-grabbing;
        cursor: grabbing;
    }
    */

/*
       ┌──────────────┐
       │   CONTROLS   │
       └──────────────┘
    */
/* [FIXME] */
.o-carousel .controls {
    position: absolute;
    z-index: 5;
    bottom: 0;
    width: 100%;
    text-align: center;
    left: 50%;
    transform: translateX(-50%) translateY(-15px);
    color: white;
}

.o-carousel .previous-button {
    position: absolute;
    left: 0;
    transform: translateX(18px);
}

.o-carousel .next-button {
    position: absolute;
    right: 0;
    transform: translateX(-18px);
}

.o-carousel .bullet {
    position: relative;
    border: 3px solid currentColor;
    border-radius: 50%;
    width: 15px;
    height: 15px;
    margin: 5px;
}

.o-carousel .bullet::after {
    content: "";
    display: block;
    width: 100%;
    height: 100%;
    background: currentColor;
    opacity: 0;
    transition: opacity var(--default-timing);
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    border-radius: 50%;
}

.o-carousel .bullet:hover::after {
    opacity: 0.35;
}

.o-carousel .bullet.js-active {
    background-color: currentColor;
    border: 3px solid currentColor;
}

.o-carousel .bullet.js-active::after {
    opacity: 1 !important;
}
</style>

<script lang="ts" src="./scripts/carousel.ts"></script>
