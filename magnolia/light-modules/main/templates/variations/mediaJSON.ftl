[#-- [ctx.getParameter("NAME"); --]

[@compress single_line=true]
{
    [#if content.image?has_content && damfn.getAsset(content.image)??]
        [#assign asset = damfn.getAsset(content.image)!]
        [#if !cmsfn.nodeById(asset.getItemKey().getAssetId(), 'dam').hasProperty('mgnl:deleted')]
            [#assign assetMap = damfn.getAssetMap(content.image)!]
            [#if asset.getMimeType()?starts_with("image")]
                "picture": {
                    "link": "${asset.getLink()}",
                    "id": "${asset.getItemKey().getAssetId()!}",
                    "extension": "${cmsfn.fileExtension(assetMap.name)?lower_case}",
                    "width": ${assetMap.metadata.mgnl.width?string.computer},
                    "height": ${assetMap.metadata.mgnl.height?string.computer},
                    "sources": {
                        "376px": "${damfn.getRendition(asset, "hero-375").getLink()!}, ${damfn.getRendition(asset, "hero-375-2x").getLink()!} 2x",
                        "668px": "${damfn.getRendition(asset, "hero-667").getLink()!}, ${damfn.getRendition(asset, "hero-667-2x").getLink()!} 2x",
                        "1025px": "${damfn.getRendition(asset, "hero-1024").getLink()!}, ${damfn.getRendition(asset, "hero-1024-2x").getLink()!} 2x",
                        "1441px": "${damfn.getRendition(asset, "hero-1440").getLink()!}, ${damfn.getRendition(asset, "hero-1440-2x").getLink()!} 2x",
                        "1921px": "${damfn.getRendition(asset, "hero-1920").getLink()!}, ${damfn.getRendition(asset, "hero-1920-2x").getLink()!} 2x",
                        "all": "${damfn.getRendition(asset, "hero-2560").getLink()!}, ${damfn.getRendition(asset, "hero-2560-2x").getLink()!} 2x"
                    }
                }
            [/#if]
        [/#if]
    [/#if]
    [#if content.video?has_content && damfn.getAsset(content.video)??]
        [#assign asset = damfn.getAsset(content.video)!]
        [#assign assetMap = damfn.getAssetMap(content.video)!]
        [#if asset.getMimeType()?starts_with("video")]
            ,"video": {
                "link": "${asset.getLink()}",
                "id": "${asset.getItemKey().getAssetId()!}",
                "extension": "${cmsfn.fileExtension(assetMap.name)?lower_case}"
            }
        [/#if]
    [/#if]

    ,"metadata": {
        "mimetype": "${asset.getMimeType()!}",
        "title": "${assetMap.metadata.dc.title!}",
        "description": "${assetMap.metadata.dc.description!}",
        "caption": "${assetMap.caption!}"
    }
}
[/@compress]
