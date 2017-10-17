[#assign isLarge = content.sectionLayout?? && content.sectionLayout == "large"]
[#assign isFullWidth = content.sectionLayout?? && content.sectionLayout == "wide"]
[#assign isCover = content.isCover?? && content.isCover == true]
[#assign hasBackground = content.backgroundTheme?has_content && content.backgroundTheme != "default"]
[#assign hasNoTopSpace = content.space?? && content.space?seq_contains("top") || hasBackground]
[#assign hasNoBottomSpace = content.space?? && content.space?seq_contains("bottom") || hasBackground]
[#assign hasInnerSpace = hasBackground && !(content.space?? && (content.space?seq_contains("bottom") || content.space?seq_contains("top")))]
<!-- Carousel -->
<section class="o-section [#if hasBackground == true]has-background -${content.backgroundTheme!} is-full-width[/#if] [#if hasInnerSpace == true]has-inner-space[/#if] [#if hasNoTopSpace == true]has-no-top-space[/#if] [#if hasNoBottomSpace == true]has-no-bottom-space[/#if] [#if isFullWidth == true]is-full-width[/#if]">
    <div class="o-group [#if isFullWidth == true]is-full-width[#elseif isLarge == true]is-large[/#if]">
    [#if !cmsfn.isEditMode()]
        <multi-carousel inline-template v-bind:transition-delay="${content.transitionDelay!'1500'}"
                        v-bind:delay="${content.delay!'5000'}" v-bind:autoplay="${(content.autoplay!false)?c}"
                        v-bind:as-hero="${(content.asHero!false)?c}" v-bind:start-at="${content.startAt!'0'}"
                        v-bind:render-type="'${content.renderType!'linear'}'"
                        [#if content.columns??]v-bind:columns="${content.columns!'0'}"[/#if]
                        [#if content.minWidth??]v-bind:min-width="${content.minWidth!'0'}"[/#if]
                        [#if content.maxWidth??]v-bind:max-width="${content.maxWidth!'0'}"[/#if]>
            <div v-bind:data-render="renderType" class="o-carousel"
                 v-bind:class="{ 'js-loaded': isLoaded, 'js-first-page': onFirstPage, 'js-last-page': onLastPage, 'js-single-page': isSinglePage, 'js-reverse': isReverse, }">
                <div class="slider">
                    <div class="slides o-flex" v-bind:style="itemsContainerStyles">
                        [@cms.area name="slides" /]
                    </div>
                </div>
                <div class="bullets" v-if="pagesQuantity > 1">
                    <template v-for="(page, index) in pagesQuantity">
                        <button class="bullet" v-on:click="gotoPage(index)"
                                v-bind:class="{ 'js-active': (currentPage == index) }">
                            <span class="is-visually-hidden">{{ index + 1 }}</span>
                        </button>
                    </template>

                    <button v-on:click="previousPage()">Prev</button>
                    <button v-on:click="nextPage()">Next</button>
                </div>
            </div>
        </multi-carousel>
    [#else]
        [@cms.area name="slides" /]
    [/#if]
    </div>
</section>
