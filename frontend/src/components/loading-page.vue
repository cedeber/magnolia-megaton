<template>
    <div id="loading" aria-hidden="true" class="o-loading" :class="{ 'js-loading': isLoading, 'js-hidden': isHidden }">
        <div class="o-flex-middle loading-overlay" :class="{ 'js-loading': isLoading }">
            <img class="image" src="../assets/square.svg" width="10px" height="10" alt="">
        </div>
        <div class="opaque-overlay"></div>
        <div class="transparent-overlay"></div>
    </div>
</template>

<script lang="ts" src="./scripts/loading-page.ts"></script>
<style scoped src="./styles/loading-page.css"></style>
