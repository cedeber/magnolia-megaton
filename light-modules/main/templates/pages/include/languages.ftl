<div class="o-languages">
[#-- Build language navigation. --]
[#assign localizedLinks = cmsfn.localizedLinks()!]
[#if localizedLinks?has_content]
    [#assign languages = localizedLinks?keys]
    <ul class="o-flex-inline">
        [#list languages as lang]
            [#assign current = cmsfn.isCurrentLocale(lang)]
            <li class="[#if current]is-active[/#if]">[@compress single_line=true]
                [#if current]${lang!}[/#if]
                [#if !current]<a href="${localizedLinks[lang]!'#'}">${lang!}</a>[/#if]
            [/@compress]</li>
        [/#list]
    </ul>
[/#if]
</div>
