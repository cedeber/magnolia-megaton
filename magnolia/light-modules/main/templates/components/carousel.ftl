[#assign cellOverride = content.layoutOverride?? && content.layoutOverride == true]
[#assign hasGutter = content.hasGutter?? && content.hasGutter == true]
[#assign hasItemRatio = content.ratioWidth?has_content && content.ratioHeight?has_content]
[#assign hasItemHeight = content.itemHeight?has_content]
[#if hasItemRatio]
    [#assign itemRatio = 1 / (content.ratioWidth?eval / content.ratioHeight?eval)]
[/#if]
[#if hasItemHeight]
    [#assign itemHeight = content.itemHeight?eval]
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
                    [#if itemRatio??]v-bind:item-ratio="${itemRatio?string.computer!0}"[/#if]
                    [#if itemHeight??]v-bind:item-height="${itemHeight?string.computer!0}"[/#if]
                    [#if content.columns??]v-bind:columns="${content.columns!'0'}"[/#if]
                    [#if content.minWidth??]v-bind:min-width="${content.minWidth!'0'}"[/#if]
                    [#if content.maxWidth??]v-bind:max-width="${content.maxWidth!'0'}"[/#if]>
        <div [#if itemHeight??]data-height="${itemHeight?string.computer!0}"[/#if] v-bind:data-render="renderType"
             v-bind:data-orientation="orientation"
             class="o-carousel [#if hasGutter]has-inner-gutter[/#if] [#if content.rows?has_content && content.rows?eval > 1]is-multirows[/#if]" v-bind:class="{ 'js-loaded': isLoaded, 'js-first-slide': onFirstSlide, 'js-last-slide': onLastSlide, 'js-single-slide': isSingleSlide, 'js-reverse': isReverse, }">
            <div class="slider-wrapper" v-bind:style="updateSliderHeight">
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
                    <div class="slider-inner" v-bind:style="updateSliderHeight">
                        <div class="slides o-flex" v-bind:style="itemsContainerStyles">
                        [@cms.area name="slides" /]
                        </div>
                    </div>
                </div>
                <div class="controls" v-if="slidesQuantity > 1">
                    <button v-on:click="previousSlide" class="previous-button">
                        ❮
                        <span class="is-visually-hidden">Show previous slide</span>
                    </button>
                    <button v-on:click="nextSlide" class="next-button">
                        ❯
                        <span class="is-visually-hidden">Show next slide</span>
                    </button>
                </div>
            </div>

            <div class="bullets" v-if="slidesQuantity > 1">
                <template v-for="(slide, index) in slidesQuantity">
                    <button class="bullet" v-on:click="gotoSlide(index)" v-bind:class="{ 'js-active': (currentSlide == index) }">
                        <span class="is-visually-hidden">Show slide {{ index + 1 }} of {{ slidesQuantity }}</span>
                    </button>
                </template>
            </div>
        </div>
    </multi-carousel>
    [#else]
        <div class="o-flex has-gutter is-multiline">
            [@cms.area name="slides" /]
        </div>
    [/#if]
[#if cellOverride && ctx.cell?has_content]
</div>
[/#if]
