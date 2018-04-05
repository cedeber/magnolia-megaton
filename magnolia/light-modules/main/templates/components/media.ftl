[#if content.image?has_content && damfn.getAsset(content.image)??]
    [#assign asset = damfn.getAsset(content.image)!]
    [#if !cmsfn.nodeById(asset.getItemKey().getAssetId(), 'dam').hasProperty('mgnl:deleted')]
        [#assign isCover = content.isCover?? && content.isCover == true]
        [#assign isInstantly = content.isInstantly?? && content.isInstantly == true]
        [#assign isAutoplay = content.isAutoplay?? && content.isAutoplay == true]
        [#assign hasCaption = content.hasCaption?? && content.hasCaption == true]
        [#assign hasRatio = content.width?has_content && content.height?has_content]
        [#assign hasCell = ctx.cell?has_content && ctx.cell != "1of1"]
        [#assign cellOverride = content.layoutOverride?? && content.layoutOverride == true]

        [#assign imageMap = damfn.getAssetMap(content.image)!]
        [#assign imageWidth = imageMap.metadata.mgnl.width!0]
        [#assign imageHeight = imageMap.metadata.mgnl.height!0]

        <!-- Async Media -->
        [#if hasCell]
            <div class="cell-[#if cellOverride]1of1[#else]${ctx.cell!'no'}[/#if]">
        [/#if]
        [#if !cmsfn.isEditMode()]
            [@compress single_line=true]
            <lazy-media path="${ctx.contextPath}${cmsfn.link(content)?replace('.html', '.json')}"
                        [#if hasRatio]:ratio="{w:${content.width!},h:${content.height}}"
                        [#elseif isCover && imageWidth > 0 && imageHeight > 0]:ratio="{w:${imageWidth?string.computer!},h:${imageHeight?string.computer!}}"[/#if]
                        position="is-${content.position!'center'}"
                        :is-cover="${isCover?string}"
                        :is-instantly="${isInstantly?string!}"
                        :is-autoplay="${isAutoplay?string!}"
                        :has-caption="${hasCaption?string!}"
                        [#-- :renditions="[]" [TODO] --]
                        class="o-lazy-media"
                        style="[#if hasRatio]padding-top: calc(1 / (${content.width} / ${content.height}) * 100%)[#elseif isCover]padding-top: calc(1 / (${imageWidth?string.computer!} / ${imageHeight?string.computer!}) * 100%)[/#if]">
                [#-- placeholder used before 'mounted' and before getting 'source' --]
                [#-- TODO CED --]
                [#--<svg class="media" width="${model.getMax((imageWidth * 100), 1)?string.computer}px" height="${model.getMax((imageHeight * 100), 1)?string.computer}px" viewBox="0 0 1 1"></svg>--]
            </lazy-media>
            [/@compress]
        [#else]
            <figure class="o-lazy-media">
                <picture class="container js-loaded [#if hasRatio]has-fixed-ratio[/#if]">
                    <img class="media [#if isCover == true]is-cover[/#if]" src="${damfn.getAssetLink(content.image)!}" style="display:block;max-width:100%">
                </picture>
                [#assign imageMap = damfn.getAssetMap(content.image)!]
                [#if imageMap.caption?has_content]
                    <figcaption class="caption">${imageMap.caption}</figcaption>
                [/#if]
            </figure>
        [/#if]
        [#if hasCell]
            </div>
        [/#if]
    [/#if]
[/#if]
