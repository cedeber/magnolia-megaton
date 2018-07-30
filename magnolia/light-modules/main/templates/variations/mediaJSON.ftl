[#assign id = ctx.getParameter("id")!]

[#if id?has_content] [#-- [TODO] Check with RegExp --]
    [#assign mediaItemKey = id]
[#else]
    [#assign mediaItemKey = content.video!content.image!]
[/#if]

[@compress single_line=true]
{
    [#if mediaItemKey?has_content && damfn.getAsset(mediaItemKey)??]
        [#assign asset = damfn.getAsset(mediaItemKey)!]
        [#if !cmsfn.nodeById(asset.getItemKey().getAssetId(), 'dam').hasProperty('mgnl:deleted')]
            [#assign assetMap = damfn.getAssetMap(mediaItemKey)!]
            [#if asset.getMimeType()?starts_with("image")]
                "picture": {
                    "link": "${asset.getLink()}",
                    "id": "${asset.getItemKey().getAssetId()!}",
                    "extension": "${cmsfn.fileExtension(assetMap.name)?lower_case}",
                    [#if assetMap.metadata.mgnl.width > 0]"width": ${assetMap.metadata.mgnl.width?string.computer},[/#if]
                    [#if assetMap.metadata.mgnl.height > 0]"height": ${assetMap.metadata.mgnl.height?string.computer},[/#if]
                    "sources": {
                        "376px": "${damfn.getRendition(asset, "hero-375").getLink()!}, ${damfn.getRendition(asset, "hero-375-2x").getLink()!} 2x",
                        "668px": "${damfn.getRendition(asset, "hero-667").getLink()!}, ${damfn.getRendition(asset, "hero-667-2x").getLink()!} 2x",
                        "1025px": "${damfn.getRendition(asset, "hero-1024").getLink()!}, ${damfn.getRendition(asset, "hero-1024-2x").getLink()!} 2x",
                        "1441px": "${damfn.getRendition(asset, "hero-1440").getLink()!}, ${damfn.getRendition(asset, "hero-1440-2x").getLink()!} 2x",
                        "1921px": "${damfn.getRendition(asset, "hero-1920").getLink()!}, ${damfn.getRendition(asset, "hero-1920-2x").getLink()!} 2x",
                        "all": "${damfn.getRendition(asset, "hero-2560").getLink()!}, ${damfn.getRendition(asset, "hero-2560-2x").getLink()!} 2x"
                    }
                }
                [#assign addComma = true]
            [#elseif asset.getMimeType()?starts_with("video")]
                [#if addComma??],[/#if]
                "video": {
                    "link": "${asset.getLink()}",
                    "id": "${asset.getItemKey().getAssetId()!}",
                    "extension": "${cmsfn.fileExtension(assetMap.name)?lower_case}"
                    [#if content.image?has_content && damfn.getAsset(content.image)??]
                        [#assign imageAsset = damfn.getAsset(content.image)!]
                        [#if !cmsfn.nodeById(imageAsset.getItemKey().getAssetId(), 'dam').hasProperty('mgnl:deleted')]
                            ,"poster": "${damfn.getRendition(imageAsset, "hero-375-2x").getLink()!}"
                        [/#if]
                    [/#if]
                }
                [#assign addComma = true]
            [/#if]
        [/#if]
    [/#if]

    [#if addComma??],[/#if]
    "metadata": {
        "mimetype": "${asset.getMimeType()!}",
        "title": "${assetMap.metadata.dc.title!}",
        "description": "${assetMap.metadata.dc.description!}",
        "caption": "${assetMap.caption!}"
    }
}
[/@compress]
