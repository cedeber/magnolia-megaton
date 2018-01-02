<template>
    <div id="loading" role="presentation" aria-hidden="true" class="o-loading" v-bind:class="{ 'js-loading': isLoading, 'js-hidden': isHidden }">
        <div class="o-flex-middle loading-overlay" v-bind:class="{ 'js-loading': isLoading }"><img class="image" src="../assets/square.svg" width="10px" height="10" alt=""></div>
        <div class="opaque-overlay"></div>
        <div class="transparent-overlay"></div>
    </div>
</template>

<script lang="ts" src="./loading-page.ts"></script>
<style scoped src="./loading-page.css"></style>
