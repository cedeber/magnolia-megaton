[#if content.image?has_content]
[#assign isLarge = content.isLarge?? && content.isLarge == true]
[#assign isFullWidth = content.isFullWidth?? && content.isFullWidth == true]
[#assign isCover = content.isCover?? && content.isCover == true]
[#assign hasBackground = content.backgroundTheme?has_content && content.backgroundTheme != "default"]
[#assign hasNoTopSpace = content.space?? && content.space?seq_contains("top") || hasBackground]
[#assign hasNoBottomSpace = content.space?? && content.space?seq_contains("bottom") || hasBackground]
[#assign hasInnerSpace = hasBackground && !(content.space?? && (content.space?seq_contains("bottom") || content.space?seq_contains("top")))]
<!-- Image -->
<section class="o-section [#if hasBackground == true]has-background -${content.backgroundTheme!} is-full-width[/#if] [#if hasInnerSpace == true]has-inner-space[/#if] [#if hasNoTopSpace == true]has-no-top-space[/#if] [#if hasNoBottomSpace == true]has-no-bottom-space[/#if] [#if isFullWidth == true]is-full-width[/#if]">
    <div class="o-group [#if isFullWidth == true]is-full-width[#elseif isLarge == true]is-large[/#if]">
        <div class="${content.className!}">
        [#if !cmsfn.isEditMode()]
            [#assign imageMap = damfn.getAssetMap(content.image)]
            <lazy-picture inline-template="true">
                <picture v-bind:class="{ 'js-loaded': source }" class="picture">
                    [#if !imageMap.name?ends_with(".gif")]
                        <source media="(max-width: 376px)" srcset="${damfn.getRendition(content.image, "hero-375").getLink()}, ${damfn.getRendition(content.image, "hero-375-2x").getLink()} 2x">
                        <source media="(max-width: 668px)" srcset="${damfn.getRendition(content.image, "hero-667").getLink()}, ${damfn.getRendition(content.image, "hero-667-2x").getLink()} 2x">
                        <source srcset="${damfn.getRendition(content.image, "hero-1024").getLink()}, ${damfn.getRendition(content.image, "hero-1024-2x").getLink()} 2x">
                    [#else]
                        <source srcset="${damfn.getAssetLink(content.image)!}">
                    [/#if]
                    <template v-if="source">
                        <img class="image [#if isCover == true]is-cover[/#if]" data-object-fit v-bind:src="source" v-bind:width="width" v-bind:height="height" alt="${imageMap.caption!imageMap.description!}">
                    </template>
                    <template v-else>
                        <img class="image" width="${imageMap.metadata.mgnl.width?string.computer}px" height="${imageMap.metadata.mgnl.height?string.computer}px" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" alt="${imageMap.caption!imageMap.description!}">
                    </template>
                </picture>
            </lazy-picture>
        [#else]
            <img class="image" src="${damfn.getAssetLink(content.image)!}">
        [/#if]
        </div>
    </div>
</section>
[/#if]
