[#macro link node cnt lvl]
    [#assign doRender = true]
    [#if node.redirect?has_content]
        [#if node.redirect == "internal" && node.redirectinternal?has_content]
            [#assign internalContentMap = cmsfn.contentById(node.redirectinternal)!]
            [#if internalContentMap?has_content]
                [#assign redirectLinkInternal = navfn.link(internalContentMap)!]
            [#else]
                [#assign doRender = false]
            [/#if]
        [#elseif node.redirect == "external" && node.redirectexternal?has_content]
            [#assign redirectLinkExternal = node.redirectexternal!]
        [/#if]
    [/#if]
    [#if doRender && node?has_content]
        <a class="link[#if navfn.isActive(cnt, node)] is-active[/#if][#if navfn.isOpen(cnt, node)] is-parent[/#if] is-level-${lvl!'unset'}"
           [#if redirectLinkExternal?has_content]target="_blank" rel="noopener external"[/#if]
           href="${redirectLinkExternal!redirectLinkInternal!cmsfn.link(node)!}">
        ${node.navigationTitle!node.title!}
        </a>
    [/#if]
[/#macro]