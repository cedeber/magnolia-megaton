[#assign imageWidth = 1600]
[#assign imageHeight = 900]

[#assign maxRenditionWidth = 0]
[#if def.parameters.maxRenditionWidth?has_content]
    [#assign maxRenditionWidth = def.parameters.maxRenditionWidth]
[/#if]

[#if content.image?has_content && damfn.getAsset(content.image)??]
    [#assign asset = damfn.getAsset(content.image)!]
    [#if !cmsfn.nodeById(asset.getItemKey().getAssetId(), 'dam').hasProperty('mgnl:deleted')]
        [#assign imageMap = damfn.getAssetMap(content.image)!]
        [#assign imageWidth = imageMap.metadata.mgnl.width!1]
        [#assign imageHeight = imageMap.metadata.mgnl.height!1]
        [#assign imageRatio = "calc(" + imageHeight?string.computer + " / " + imageWidth?string.computer + " * 100%)"]
        [#assign imageCaption = imageMap.caption!]
    [/#if]
[/#if]

[#if content.video?has_content && damfn.getAsset(content.video)??]
    [#assign asset = damfn.getAsset(content.video)!]
    [#if !cmsfn.nodeById(asset.getItemKey().getAssetId(), 'dam').hasProperty('mgnl:deleted')]
        [#assign videoMap = damfn.getAssetMap(content.video)!]
        [#assign videoCaption = videoMap.caption!]
    [/#if]
[/#if]

[#-- Video --]
[#assign isAutoplay = content.isAutoplay ! (def.parameters.isAutoplay?? && def.parameters.isAutoplay == true)]

[#-- Image --]
[#assign isInstantly = def.parameters.isInstantly?c!]

[#if content.isInstantly??]
    [#assign isInstantly = content.isInstantly]
[/#if]

[#-- Both --]
[#assign position = content.position ! def.parameters.position?string ! "center"]
[#assign hasCaption = content.hasCaption?? && content.hasCaption == true]

[#assign isCover = (def.parameters.isCover?? && def.parameters.isCover == true) ! false]
[#if content.isCover?? && content.isCover == true]
    [#assign isCover = true]
[/#if]

[#assign hasCaption = (def.parameters.hasCaption?? && def.parameters.hasCaption == true) ! false]
[#if content.hasCaption?? && content.hasCaption == true]
    [#assign hasCaption = true]
[/#if]

[#assign hasRatio = false]
[#if content.width?has_content && content.height?has_content]
    [#assign hasRatio = true]
    [#assign ratio = "{w:" + content.width?string + ",h:" + content.height?string + "}"]
    [#assign imageRatio = "calc(" + content.height?string + " / " + content.width?string + " * 100%)"]
[#elseif def.parameters.width?has_content && def.parameters.height?has_content]
    [#assign hasRatio = true]
    [#assign ratio = "{w:" + def.parameters.width?string.computer + ",h:" + def.parameters.height?string.computer + "}"]
    [#assign imageRatio = "calc(" + def.parameters.height?string.computer + " / " + def.parameters.width?string.computer + " * 100%)"]
[/#if]

[#-- Lazy Media --]
<div class="o-lazy-media o-component [#if content.title?has_content || content.body?has_content]has-editorial[/#if]">
    [#if !cmsfn.isEditMode()]
        <lazy-media path="${cmsfn.link(content)?replace('.html', '.json')}"
                    [#if hasRatio]:ratio="${ratio!}"[/#if]
                    [#if isCover && imageWidth > 0 && imageHeight > 0]:sim-ratio="{w:${imageWidth?string.computer!},h:${imageHeight?string.computer!}}"[/#if]
                    position="is-${position!}"
                    :is-cover="${isCover?string!}"
                    :is-instantly="${isInstantly?string!}"
                    :is-autoplay="${isAutoplay?string!}"
                    :has-caption="${hasCaption?string!}"
                    :max-width="${maxRenditionWidth?string.computer!}">
                    <figure class="figure" style="padding-top: ${imageRatio!}">
                        <picture class="container js-loaded has-fixed-ratio">
                            <img class="media is-${position!} [#if isCover == true]is-cover[/#if]" width="${imageWidth?string.computer!}" height="${imageHeight?string.computer!}" alt="placeholder" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=">
                        </picture>
                    </figure>
        </lazy-media>
    [#else]
        <figure class="figure" [#if hasRatio]style="padding-top: ${imageRatio!}"[/#if]>
        [#if content.image?has_content]
            <picture class="container js-loaded [#if hasRatio]has-fixed-ratio[/#if]">
                <img class="media is-${position!} [#if isCover == true]is-cover[/#if]" src="${damfn.getAssetLink(content.image)!}">
            </picture>
        [/#if]
        [#if content.video?has_content]
            <video controls class="container media js-loaded [#if hasRatio]has-fixed-ratio[/#if]" src="${damfn.getAssetLink(content.video)!}" preload="metadata" style="display: block; max-width: 100%"
                   poster="${damfn.getAssetLink(content.poster)!}">
            </video>
        [/#if]
        </figure>
    [/#if]
    [#if hasCaption == true]
        <div class="caption">${videoCaption!imageCaption!}</div>
    [/#if]
    [#if content.title?has_content || content.body?has_content]
        [#include "editorial.ftl"]
    [/#if]
</div>
