[#include "../macros/alt.ftl"]

[#if content.image?? && damfn.getAsset(content.image)??]
<div class="slide">
    [#if content.foregroundText?has_content]
    <div class="foreground o-flex-middle is-vertical is-left">
        <div class="h1 is-left">${cmsfn.decode(content).foregroundText!}</div>
    </div>
    [/#if]
    <div class="background">
        [#if !cmsfn.isEditMode()]
        <lazy-media path="${ctx.contextPath}/${cmsfn.language()!}${content.@path}.json"
                    :is-cover="${content.isCover?string}"
                    :is-autoplay="true"
                    class="o-lazy-media">
        </lazy-media>
        [#else]
        <img src="${damfn.getAssetLink(content.image)!}" style="display:block;max-width:100%">
        [/#if]
    </div>
</div>
[/#if]
