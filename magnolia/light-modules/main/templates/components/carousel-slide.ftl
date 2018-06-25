[#include "../macros/alt.ftl"]
[#assign isCover = content.isCover?? && content.isCover == true]

[#if content.image?? && damfn.getAsset(content.image)??]
<div class="item [#if cmsfn.isEditMode()]cell-1of1[/#if]">[#-- TODO inherit items per row --]
    <div class="item-inner">
        [#if content.foregroundText?has_content]
        <div class="foreground o-flex-middle is-vertical o-section has-no-top-space has-no-bottom-space">
            <div class="o-group is-large is-left">${cmsfn.decode(content).foregroundText!}</div>
        </div>
        [/#if]
        <div class="background">
            [#if !cmsfn.isEditMode()]
            <lazy-media path="${cmsfn.link(content)?replace('.html', '.json')}"
                        :is-cover="${isCover?string}"
                        :is-autoplay="true"
                        class="o-lazy-media">
            </lazy-media>
            [#else]
            <img src="${damfn.getAssetLink(content.image)!}" style="display:block;max-width:100%">
            [/#if]
        </div>
    </div>
</div>
[/#if]
