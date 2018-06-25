<li class="link">
    [#if content.href == "internal" && content.hrefinternal?has_content]
        <a href="${cmsfn.link('website', content.hrefinternal)!}" aria-label="${content.label!} (Intern)">
            ${content.label!}
        </a>
    [#elseif content.href == "external" && content.hrefexternal?has_content]
    <a href="${content.hrefexternal!}" target="_blank" rel="noopener external" aria-label="${content.label!} (Extern)">
        ${content.label!}
    </a>
    [#elseif content.href == "file" && content.hreffile?has_content]
    <a href="${damfn.getAssetMap(content.hreffile).link!}"  aria-label="${content.label!} (Datei)">
        ${content.label!}
    </a>
    [/#if]
</li>
