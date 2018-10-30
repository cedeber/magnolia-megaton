[#if content.image?has_content && damfn.getAsset(content.image)??]
    [#assign logo = damfn.getAssetLink(content.image)!]
[/#if]

[#macro lkCtn]
    [#if logo?has_content]
        <img src="${logo!}" alt="${content.label!}" style="display:block">
    [#else]
        ${content.label!}
    [/#if]
[/#macro]

<li class="link">
    [#if content.href == "internal" && content.hrefinternal?has_content]
        <a href="${cmsfn.link('website', content.hrefinternal)!}" aria-label="${content.label!}">
            [@lkCtn /]
        </a>
    [#elseif content.href == "external" && content.hrefexternal?has_content]
    <a href="${content.hrefexternal!}" target="_blank" rel="noopener external" aria-label="${content.label!} (${i18n['link.external']})">
        [@lkCtn /]
    </a>
    [#elseif content.href == "file" && content.hreffile?has_content]
    <a href="${damfn.getAssetMap(content.hreffile).link!}"  aria-label="${content.label!} (${i18n['link.file']})">
        [@lkCtn /]
    </a>
    [/#if]
</li>
