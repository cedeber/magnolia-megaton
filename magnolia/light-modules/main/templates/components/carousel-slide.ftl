[#assign isCover = content.isCover?? && content.isCover == true]
[#assign isInstantly = content.isInstantly?? && content.isInstantly == true]
[#assign isAutoplay = content.isAutoplay?? && content.isAutoplay == true]

<div class="slide [#if cmsfn.isEditMode()]cell-1of1[/#if]">
    <div class="slide-inner">
        [#if content.title?has_content || content.body?has_content]
        <div class="foreground o-flex-middle is-vertical o-section has-no-top-space has-no-bottom-space">
            <div class="o-group is-large is-left">
                [#include "editorial.ftl"]
            </div>
        </div>
        [/#if]
        <div class="background">
            [#if !cmsfn.isEditMode()]
            <lazy-media path="${cmsfn.link(content)?replace('.html', '.json')}"
                        position="is-${content.position!'center'}"
                        :is-cover="${isCover?string}"
                        :is-instantly="${isInstantly?string!}"
                        :is-autoplay="${isAutoplay?string!}"
                        class="o-lazy-media">
            </lazy-media>
            [#else]
                [#if content.image?? && damfn.getAsset(content.image)??]
                    <img src="${damfn.getAssetLink(content.image)!}" style="display: block; max-width: 100%">
                [#elseif content.video?? && damfn.getAsset(content.video)??]
                    <video playsinline controls src="${damfn.getAssetLink(content.video)!}" preload="metadata" style="display: block; max-width: 100%"></video>
                [/#if]
            [/#if]
        </div>
    </div>
</div>
