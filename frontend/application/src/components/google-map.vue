<template>
    <div class="o-google-map">
        <div class="map"></div>
        <slot></slot>
    </div>
</template>

<style scoped>
    .o-google-map {
        position: relative;
        overflow: hidden;
        width: 100%;
        padding-top: 56.25%;
    }

    .o-google-map > .map {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
</style>

<script lang="ts" src="./scripts/google-map.ts"></script>
