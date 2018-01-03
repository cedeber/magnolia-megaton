<template>
    <div
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

        v-bind:class='{ "js-cursor-down": hasCursorDown }'
    ></div>
</template>

<script lang="ts" src="./swipe.ts"></script>
