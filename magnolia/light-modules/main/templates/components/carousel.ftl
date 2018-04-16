[#assign cellOverride = content.layoutOverride?? && content.layoutOverride == true]

<!-- Carousel -->
[#if !cmsfn.isEditMode()]
    <multi-carousel inline-template v-bind:transition-delay="${content.transitionDelay!'1500'}"
                    v-bind:delay="${content.delay!'5000'}" v-bind:autoplay="${(content.autoplay!false)?c}"
                    v-bind:as-hero="${(content.asHero!false)?c}" v-bind:start-at="${content.startAt!'0'}"
                    v-bind:render-type="'${content.renderType!'linear'}'"
                    [#if content.columns??]v-bind:columns="${content.columns!'0'}"[/#if]
                    [#if content.minWidth??]v-bind:min-width="${content.minWidth!'0'}"[/#if]
                    [#if content.maxWidth??]v-bind:max-width="${content.maxWidth!'0'}"[/#if]>
        <div v-bind:data-render="renderType" class="o-carousel cell-[#if cellOverride]1of1[#else]${ctx.cell!'no'}[/#if]"
             v-bind:class="{ 'js-loaded': isLoaded, 'js-first-page': onFirstPage, 'js-last-page': onLastPage, 'js-single-page': isSinglePage, 'js-reverse': isReverse, }">
            <div class="slider">
                <div class="slides o-flex" v-bind:style="itemsContainerStyles">
                    [@cms.area name="slides" /]
                </div>
            </div>
            <div class="bullets" v-if="pagesQuantity > 1">
                <div class="bullets" v-if="pagesQuantity > 1">
                    <template v-for="(page, index) in pagesQuantity">
                        <button class="bullet" v-on:click="gotoPage(index)" v-bind:class="{ 'js-active': (currentPage == index) }">
                            <span class="is-visually-hidden">Show slide {{ index + 1 }} of {{ pagesQuantity }}</span>
                        </button>
                    </template>
                    <button v-on:click="previousPage">
                        &lt;
                        <span class="is-visually-hidden">Show previous slide</span>
                    </button>
                    <button v-on:click="nextPage">
                        &gt;
                        <span class="is-visually-hidden">Show next slide</span>
                    </button>
                </div>
            </div>
        </div>
    </multi-carousel>
[#else]
    [@cms.area name="slides" /]
[/#if]
