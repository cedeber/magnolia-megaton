[#if content.image?? && damfn.getAsset(content.image)??]
[#assign isLarge = content.isLarge?? && content.isLarge == true]
[#assign isFullWidth = content.isFullWidth?? && content.isFullWidth == true]
[#assign isCover = content.isCover?? && content.isCover == true]
[#assign hasRatio = content.width?has_content && content.height?has_content]
[#assign hasBackground = content.backgroundTheme?has_content && content.backgroundTheme != "default"]
[#assign hasNoTopSpace = content.space?? && content.space?seq_contains("top") || hasBackground]
[#assign hasNoBottomSpace = content.space?? && content.space?seq_contains("bottom") || hasBackground]
[#assign hasInnerSpace = hasBackground && !(content.space?? && (content.space?seq_contains("bottom") || content.space?seq_contains("top")))]
<!-- Image -->
<section class="o-section [#if hasBackground == true]has-background -${content.backgroundTheme!} is-full-width[/#if] [#if hasInnerSpace == true]has-inner-space[/#if] [#if hasNoTopSpace == true]has-no-top-space[/#if] [#if hasNoBottomSpace == true]has-no-bottom-space[/#if] [#if isFullWidth == true]is-full-width[/#if]">
    <div class="o-group [#if isFullWidth == true]is-full-width[#elseif isLarge == true]is-large[/#if]">
        <div class="o-image" [#if hasRatio]style="padding-top:calc(1 / (${content.width} / ${content.height}) * 100%)"[/#if]>
        [#if !cmsfn.isEditMode()]
            [#assign imageMap = damfn.getAssetMap(content.image)]
            <lazy-picture inline-template>
                [#if imageMap.metadata.dc.format?starts_with("image")]
                <picture v-bind:class="{ 'js-loaded': source }" class="picture [#if hasRatio]has-fixed-ratio[/#if]">
                    [#if !(cmsfn.fileExtension(imageMap.name) == "gif")]
                        <source media="(max-width: 376px)" srcset="${damfn.getRendition(content.image, "hero-375").getLink()}, ${damfn.getRendition(content.image, "hero-375-2x").getLink()} 2x">
                        <source media="(max-width: 668px)" srcset="${damfn.getRendition(content.image, "hero-667").getLink()}, ${damfn.getRendition(content.image, "hero-667-2x").getLink()} 2x">
                        <source srcset="${damfn.getRendition(content.image, "hero-1024").getLink()}, ${damfn.getRendition(content.image, "hero-1024-2x").getLink()} 2x">
                    [#else]
                        <source srcset="${damfn.getAssetLink(content.image)!}">
                    [/#if]
                    <template v-if="source">
                        <!--img class="image [#if isCover == true]is-cover[/#if]" data-object-fit v-bind:src="source" v-bind:width="width" v-bind:height="height" alt="${imageMap.caption!imageMap.description!}"-->
                        <img class="image is-${content.position!"center"} [#if isCover == true]is-cover[/#if]" data-object-fit v-bind:src="source" alt="${imageMap.caption!imageMap.description!}">
                    </template>
                    <template v-else>
                        <svg class="image" width="${(imageMap.metadata.mgnl.width * 1000)?string.computer}px" height="${(imageMap.metadata.mgnl.height * 1000)?string.computer}px" viewBox="0 0 1 1"></svg>
                    </template>
                </picture>
                [#elseif imageMap.metadata.dc.format?starts_with("video")]
                <div>
                    <picture hidden><source srcset="${damfn.getAssetLink(content.image)!}"></picture>
                    <template v-if="source">
                        <video autoplay loop muted playsinline v-bind:class="{ 'js-loaded': source }" class="picture">
                            <source class="image [#if isCover == true]is-cover[/#if]" v-bind:src="source" type="${imageMap.metadata.dc.format}">
                        </video>
                    </template>
                    <template v-else>
                        <div class="picture"><svg class="image" width="1280000px" height="720000px" viewBox="0 0 1 1"></svg></div>
                    </template>
                </div>
                [/#if]
            </lazy-picture>
        [#else]
            <picture class="picture js-loaded [#if hasRatio]has-fixed-ratio[/#if]">
                <img class="image [#if isCover == true]is-cover[/#if]" src="${damfn.getAssetLink(content.image)!}" style="display:block;max-width:100%">
            </picture>
        [/#if]
        </div>
    </div>
</section>
[/#if]
