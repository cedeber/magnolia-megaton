[#include "../macros/alt.ftl"]

[#if content.image?? && damfn.getAsset(content.image)??]
[#assign isLarge = content.sectionLayout?? && content.sectionLayout == "large"]
[#assign isFullWidth = content.sectionLayout?? && content.sectionLayout == "wide"]
[#assign isCover = content.isCover?? && content.isCover == true]
[#assign isInstantly = content.isInstantly?? && content.isInstantly == true]
[#assign hasRatio = content.width?has_content && content.height?has_content]
[#assign hasBackground = content.backgroundTheme?has_content && content.backgroundTheme != "default"]
[#assign hasNoTopSpace = content.space?? && content.space?seq_contains("top") || hasBackground]
[#assign hasNoBottomSpace = content.space?? && content.space?seq_contains("bottom") || hasBackground]
[#assign hasInnerSpace = hasBackground && !(content.space?? && (content.space?seq_contains("bottom") || content.space?seq_contains("top")))]
<!-- Media -->
<section class="o-section [#if hasBackground == true]has-background -${content.backgroundTheme!} is-full-width[/#if] [#if hasInnerSpace == true]has-inner-space[/#if] [#if hasNoTopSpace == true]has-no-top-space[/#if] [#if hasNoBottomSpace == true]has-no-bottom-space[/#if] [#if isFullWidth == true]is-full-width[/#if]">
    <div class="o-group [#if isFullWidth == true]is-full-width[#elseif isLarge == true]is-large[/#if]">
        <div class="o-lazy-media" [#if hasRatio]style="padding-top:calc(1 / (${content.width} / ${content.height}) * 100%)"[/#if]>
        [#if !cmsfn.isEditMode()]
            <lazy-media inline-template :instantly="${isInstantly?string!}">
            [#if content.video?has_content]
                [#assign videoMap = damfn.getAssetMap(content.video)!]
                <div>
                    <picture hidden><source srcset="${damfn.getAssetLink(content.video)!}"></picture>
                    <template v-if="source">
                        <video autoplay loop muted playsinline poster="${damfn.getAssetLink(content.image)!}" v-bind:class="{ 'js-loaded': source }" class="container [#if hasRatio]has-fixed-ratio[/#if] media is-${content.position!"center"} [#if isCover == true]is-cover[/#if]">
                            <source v-bind:src="source" type="${videoMap.metadata.dc.format}">
                        </video>
                    </template>
                    <template v-else>
                        <div class="container"><svg class="media" width="12800px" height="7200px" viewBox="0 0 1 1"></svg></div>
                    </template>
                </div>
            [#else]
                [#assign imageMap = damfn.getAssetMap(content.image)!]
                [#assign imageWidth = imageMap.metadata.mgnl.width!0]
                [#assign imageHeight = imageMap.metadata.mgnl.height!0]
                <picture v-bind:class="{ 'js-loaded': isLoaded }" class="container [#if hasRatio]has-fixed-ratio[/#if]">
                    [#if cmsfn.fileExtension(imageMap.name) == "gif"]
                        <source srcset="${damfn.getAssetLink(content.image)!}">
                    [#else]
                        <source media="(max-width: 376px)" srcset="${damfn.getRendition(content.image, "hero-375").getLink()!}, ${damfn.getRendition(content.image, "hero-375-2x").getLink()!} 2x">
                        <source media="(max-width: 668px)" srcset="${damfn.getRendition(content.image, "hero-667").getLink()!}, ${damfn.getRendition(content.image, "hero-667-2x").getLink()!} 2x">
                        <source srcset="${damfn.getRendition(content.image, "hero-1024").getLink()!}, ${damfn.getRendition(content.image, "hero-1024-2x").getLink()!} 2x">
                    [/#if]
                    <template v-if="source">
                        <img class="media is-${content.position!"center"} [#if isCover == true]is-cover[/#if]" :src="source" :width="width" :height="height" [@alt map=imageMap /]>
                    </template>
                    <template v-else>
                        <svg class="media" width="${model.getMax((imageWidth * 100), 1)?string.computer}px" height="${model.getMax((imageHeight * 100), 1)?string.computer}px" viewBox="0 0 1 1"></svg>
                    </template>
                </picture>
            [/#if]
            </lazy-media>
        [#else]
            <picture class="container js-loaded [#if hasRatio]has-fixed-ratio[/#if]">
                <img class="media [#if isCover == true]is-cover[/#if]" src="${damfn.getAssetLink(content.image)!}" style="display:block;max-width:100%">
            </picture>
        [/#if]
        </div>
    </div>
</section>
[/#if]
