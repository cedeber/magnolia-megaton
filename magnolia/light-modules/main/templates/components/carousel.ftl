[#assign cellOverride = content.layoutOverride?? && content.layoutOverride == true]
[#assign hasGutter = content.hasGutter?? && content.hasGutter == true]
[#assign hasRatio = content.width?has_content && content.height?has_content]
[#if hasRatio]
    [#assign imageRatio = 1 / (content.width?eval / content.height?eval) * 100]
[/#if]

<!-- Carousel -->
[#if cellOverride && ctx.cell?has_content]
<div class="cell-[#if cellOverride]1of1[#else]${ctx.cell!}[/#if]">
[/#if]
    [#if !cmsfn.isEditMode()]
    <multi-carousel inline-template v-bind:transition-delay="${content.transitionDelay!'1500'}"
                    v-bind:delay="${content.delay!'5000'}"
                    v-bind:autoplay="${(content.autoplay!false)?c}"
                    v-bind:as-hero="${(content.asHero!false)?c}"
                    v-bind:start-at="${content.startAt!'0'}"
                    v-bind:render-type="'${content.renderType!'linear'}'"
                    v-bind:orientation="'${content.orientation!'horizontal'}'"
                    [#if imageRatio??]v-bind:slide-ratio="${imageRatio?string.computer!0}"[/#if]
                    [#if content.columns??]v-bind:columns="${content.columns!'0'}"[/#if]
                    [#if content.minWidth??]v-bind:min-width="${content.minWidth!'0'}"[/#if]
                    [#if content.maxWidth??]v-bind:max-width="${content.maxWidth!'0'}"[/#if]>
        <div v-bind:data-render="renderType"
             v-bind:data-orientation="orientation"
             class="o-carousel [#if hasGutter]has-inner-gutter[/#if]"
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
                    [@cms.area name="slides" /]
                </div>
            </div>
            <div class="controls" v-if="pagesQuantity > 1">
                <template v-for="(_page, index) in pagesQuantity">
                    <button class="bullet" v-on:click="gotoPage(index)" v-bind:class="{ 'js-active': (currentPage == index) }">
                        <span class="is-visually-hidden">Show slide {{ index + 1 }} of {{ pagesQuantity }}</span>
                    </button>
                </template>
                <button v-on:click="previousPage" class="previous-button">
                    ❮
                    <span class="is-visually-hidden">Show previous slide</span>
                </button>
                <button v-on:click="nextPage" class="next-button">
                    ❯
                    <span class="is-visually-hidden">Show next slide</span>
                </button>
            </div>
        </div>
    </multi-carousel>
    [#else]
        [@cms.area name="slides" /]
    [/#if]
[#if cellOverride && ctx.cell?has_content]
</div>
[/#if]
