[#if content.slides?has_content]
[#assign isLarge = content.isLarge?? && content.isLarge == true]
[#assign isFullWidth = content.isFullWidth?? && content.isFullWidth == true]
[#assign isCover = content.isCover?? && content.isCover == true]
[#assign hasBackground = content.backgroundTheme?has_content && content.backgroundTheme != "default"]
[#assign hasNoTopSpace = content.space?? && content.space?seq_contains("top") || hasBackground]
[#assign hasNoBottomSpace = content.space?? && content.space?seq_contains("bottom") || hasBackground]
[#assign hasInnerSpace = hasBackground && !(content.space?? && (content.space?seq_contains("bottom") || content.space?seq_contains("top")))]
<!-- Carousel -->
<section class="o-section [#if hasBackground == true]has-background -${content.backgroundTheme!} is-full-width[/#if] [#if hasInnerSpace == true]has-inner-space[/#if] [#if hasNoTopSpace == true]has-no-top-space[/#if] [#if hasNoBottomSpace == true]has-no-bottom-space[/#if] [#if isFullWidth == true]is-full-width[/#if]">
    <div class="o-group [#if isFullWidth == true]is-full-width[#elseif isLarge == true]is-large[/#if]">
        [#if !cmsfn.isEditMode()]
        <multi-carousel inline-template v-bind:transition-delay="${content.transitionDelay!'1500'}" v-bind:delay="${content.delay!'5000'}" v-bind:autoplay="${(content.autoplay!false)?c}" v-bind:as-hero="${(content.asHero!false)?c}" v-bind:start-at="${(content.startAt!0)?string.computer}" v-bind:render-type="${content.renderType!'linear'}" [#if content.columns??]v-bind:columns="${content.columns!'0'}"[/#if] [#if content.minWidth??]v-bind:min-width="${content.minWidth!'0'}"[/#if] [#if content.maxWidth??]v-bind:max-width="${content.maxWidth!'0'}"[/#if]>
            <div v-bind:data-render="renderType" class="o-carousel"
                 v-bind:class="{ 'js-loaded': isLoaded, 'js-first-page': onFirstPage, 'js-last-page': onLastPage, 'js-single-page': isSinglePage, 'js-reverse': isReverse, }">
                <div class="slider">
                    <div class="slides o-flex" v-bind:style="itemsContainerStyles">
                        [#list cmsfn.children(content.slides) as slide]
                            <div class="slide">
                                [#if slide.foregroundText?has_content]
                                <div class="foreground o-flex-middle is-vertical is-left">
                                    <div class="h1 is-left">${cmsfn.decode(slide).foregroundText!}</div>
                                </div>
                                [/#if]
                                <div class="background">
                                    [#assign imageMap = damfn.getAssetMap(slide.image)]
                                    <lazy-picture inline-template="true">
                                        <picture v-bind:class="{ 'js-loaded': source }" class="picture">
                                            [#if !imageMap.name?ends_with(".gif")]
                                                <source media="(max-width: 376px)" srcset="${damfn.getRendition(slide.image, "hero-375").getLink()}, ${damfn.getRendition(slide.image, "hero-375-2x").getLink()} 2x">
                                                <source media="(max-width: 668px)" srcset="${damfn.getRendition(slide.image, "hero-667").getLink()}, ${damfn.getRendition(slide.image, "hero-667-2x").getLink()} 2x">
                                                <source media="(max-width: 1025px)" srcset="${damfn.getRendition(slide.image, "hero-1024").getLink()}, ${damfn.getRendition(slide.image, "hero-1024-2x").getLink()} 2x">
                                                <source media="(max-width: 1441px)" srcset="${damfn.getRendition(slide.image, "hero-1440").getLink()}, ${damfn.getRendition(slide.image, "hero-1440-2x").getLink()} 2x">
                                                <source media="(max-width: 1921px)" srcset="${damfn.getRendition(slide.image, "hero-1920").getLink()}, ${damfn.getRendition(slide.image, "hero-1920-2x").getLink()} 2x">
                                                <source srcset="${damfn.getRendition(slide.image, "hero-2560").getLink()}, ${damfn.getRendition(slide.image, "hero-2560-2x").getLink()} 2x">
                                            [#else]
                                                <source srcset="${damfn.getAssetLink(slide.image)!}">
                                            [/#if]
                                            <template v-if="source">
                                                <img class="image [#if slide.isCover == true]is-cover[/#if]" data-object-fit v-bind:src="source" v-bind:width="width" v-bind:height="height" alt="${imageMap.caption!imageMap.description!}">
                                            </template>
                                            <template v-else>
                                                <img class="image" width="${imageMap.metadata.mgnl.width?string.computer}px" height="${imageMap.metadata.mgnl.height?string.computer}px" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" alt="${imageMap.caption!imageMap.description!}">
                                            </template>
                                        </picture>
                                    </lazy-picture>
                                </div>
                            </div>
                        [/#list]
                    </div>
                </div>
                <div class="bullets" v-if="pagesQuantity > 1">
                    <template v-for="(page, index) in pagesQuantity">
                        <button class="bullet" v-on:click="gotoPage(index)" v-bind:class="{ 'js-active': (currentPage == index) }">
                            <span class="is-visually-hidden">{{ index + 1 }}</span>
                        </button>
                    </template>

                    <button v-on:click="previousPage()">Prev</button>
                    <button v-on:click="nextPage()">Next</button>
                </div>
            </div>
        </multi-carousel>
        [#else]
            [#list cmsfn.children(content.slides) as slide]
            <br>${cmsfn.decode(slide).foregroundText!}
            <img style="display:block" src='${damfn.getAssetLink(slide.image)!}'>
            [/#list]
        [/#if]
    </div>
</section>
[/#if]
