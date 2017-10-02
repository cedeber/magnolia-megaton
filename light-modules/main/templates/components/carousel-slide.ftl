[#if content.image?? && damfn.getAsset(content.image)??]
<div class="slide">
    [#if content.foregroundText?has_content]
    <div class="foreground o-flex-middle is-vertical is-left">
        <div class="h1 is-left">${cmsfn.decode(content).foregroundText!}</div>
    </div>
    [/#if]
    <div class="background">
        [#if !cmsfn.isEditMode()]
        [#assign imageMap = damfn.getAssetMap(content.image)]
        <lazy-picture inline-template="true">
            <picture v-bind:class="{ 'js-loaded': source }" class="picture">
                [#--if !imageMap.name?ends_with(".gif")--]
                [#if !(cmsfn.fileExtension(imageMap.name) == "gif")]
                    <source media="(max-width: 376px)" srcset="${damfn.getRendition(content.image, "hero-375").getLink()}, ${damfn.getRendition(content.image, "hero-375-2x").getLink()} 2x">
                    <source media="(max-width: 668px)" srcset="${damfn.getRendition(content.image, "hero-667").getLink()}, ${damfn.getRendition(content.image, "hero-667-2x").getLink()} 2x">
                    <source media="(max-width: 1025px)" srcset="${damfn.getRendition(content.image, "hero-1024").getLink()}, ${damfn.getRendition(content.image, "hero-1024-2x").getLink()} 2x">
                    <source media="(max-width: 1441px)" srcset="${damfn.getRendition(content.image, "hero-1440").getLink()}, ${damfn.getRendition(content.image, "hero-1440-2x").getLink()} 2x">
                    <source media="(max-width: 1921px)" srcset="${damfn.getRendition(content.image, "hero-1920").getLink()}, ${damfn.getRendition(content.image, "hero-1920-2x").getLink()} 2x">
                    <source srcset="${damfn.getRendition(content.image, "hero-2560").getLink()}, ${damfn.getRendition(content.image, "hero-2560-2x").getLink()} 2x">
                [#else]
                    <source srcset="${damfn.getAssetLink(content.image)!}">
                [/#if]
                <template v-if="source">
                    <img class="image [#if content.isCover == true]is-cover[/#if]" data-object-fit v-bind:src="source" v-bind:width="width" v-bind:height="height" alt="${imageMap.caption!imageMap.description!}">
                </template>
                <template v-else>
                    <img class="image" width="${imageMap.metadata.mgnl.width?string.computer}px" height="${imageMap.metadata.mgnl.height?string.computer}px" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" alt="${imageMap.caption!imageMap.description!}">
                </template>
            </picture>
        </lazy-picture>
        [#else]
        <img style="display:block" src="${damfn.getAssetLink(content.image)!}" style="max-width:100%">
        [/#if]
    </div>
</div>
[/#if]
