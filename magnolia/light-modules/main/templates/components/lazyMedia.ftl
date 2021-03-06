[#assign imageWidth = 1600]
[#assign imageHeight = 900]
[#if content.image?has_content && damfn.getAsset(content.image)??]
    [#assign asset = damfn.getAsset(content.image)!]
    [#if !cmsfn.nodeById(asset.getItemKey().getAssetId(), 'dam').hasProperty('mgnl:deleted')]
        [#assign imageMap = damfn.getAssetMap(content.image)!]
        [#assign imageWidth = imageMap.metadata.mgnl.width!1]
        [#assign imageHeight = imageMap.metadata.mgnl.height!1]
    [/#if]
[/#if]

[#assign isCover = content.isCover?? && content.isCover == true]
[#assign isInstantly = content.isInstantly?? && content.isInstantly == true]
[#assign isAutoplay = content.isAutoplay?? && content.isAutoplay == true]
[#assign hasCaption = content.hasCaption?? && content.hasCaption == true]
[#assign hasRatio = content.width?has_content && content.height?has_content]

[#if ctx.cell?has_content]
    [#assign cellOverride = ctx.cell]
    [#if content.layoutOverride?has_content]
        [#if content.layoutOverride == "full"]
            [#assign cellOverride = "1of1"]
        [#elseif content.layoutOverride == "wider"]
            [#if ctx.cell == "1of3"]
                [#assign cellOverride = "2of3"]
            [#elseif ctx.cell == "1of4"]
                [#assign cellOverride = "3of4"]
            [/#if]
        [/#if]
    [/#if]
[/#if]

<!-- Lazy Media -->
<div class="o-lazy-media [#if cellOverride?has_content]cell-${cellOverride!}[/#if] [#if content.title?has_content || content.body?has_content]has-editorial[/#if]">
[#if !cmsfn.isEditMode()]
    <lazy-media path="${cmsfn.link(content)?replace('.html', '.json')}"
                [#if hasRatio]:ratio="{w:${content.width!},h:${content.height}}"[/#if]
                [#if isCover && imageWidth > 0 && imageHeight > 0]:sim-ratio="{w:${imageWidth?string.computer!},h:${imageHeight?string.computer!}}"[/#if]
                position="is-${content.position!'center'}"
                :is-cover="${isCover?string!}"
                :is-instantly="${isInstantly?string!}"
                :is-autoplay="${isAutoplay?string!}"
                :has-caption="${hasCaption?string!}"
                [#if content.maxWidth?has_content]:max-width="${content.maxWidth!0}"[/#if]>
        [#-- placeholder used before 'mounted' and before getting 'source' --]
        <svg class="media"
             width="${imageWidth?string.computer!}"
             height="${imageHeight?string.computer!}"
             viewBox="0 0 1 1">
        </svg>
    </lazy-media>
[#else]
    <figure class="o-lazy-media">
        [#if imageMap?? && !content.video?has_content]
            <picture class="container js-loaded [#if hasRatio]has-fixed-ratio[/#if]">
                <img class="media [#if isCover == true]is-cover[/#if]" src="${damfn.getAssetLink(content.image)!}" style="display: block; max-width: 100%">
            </picture>
            [#if imageMap.caption?has_content]
                <figcaption class="caption">${imageMap.caption}</figcaption>
            [/#if]
        [/#if]
        [#if content.video?has_content]
            <video controls class="container media" src="${damfn.getAssetLink(content.video)!}" preload="metadata" style="display: block; max-width: 100%"
                   poster="${damfn.getAssetLink(content.image)!}">
            </video>
        [/#if]
    </figure>
[/#if]
[#if content.title?has_content || content.body?has_content]
    [#include "editorial.ftl"]
[/#if]
</div>
