[#assign openOnly = true]
[#assign depth = 1]
[#assign listClass = "o-flex-inline is-vertical"]

[#macro navItem currentNode level]
    [#if !navfn.isHiddenInNav(currentNode)]
        [#if currentNode.redirect?has_content]
            [#if currentNode.redirect == "internal" && currentNode.redirectinternal?has_content]
                [#assign redirectLinkInternal = navfn.link(currentNode.redirectinternal)!]
            [#elseif currentNode.redirect == "external" && currentNode.redirectexternal?has_content]
                [#assign redirectLinkExternal = currentNode.redirectexternal!]
            [/#if]
        [/#if]
        <li>
            <a class="link[#if navfn.isActive(content, currentNode)] is-active[/#if][#if navfn.isOpen(content, currentNode)] is-parent[/#if] is-level-${level}"
                [#if redirectLinkExternal?has_content]target="_blank" rel="noopener external"[/#if]
                href="${redirectLinkExternal!redirectLinkInternal!cmsfn.link(currentNode)!}">
                ${currentNode.navigationTitle!currentNode.title!}
            </a>

            [#if level < depth && (openOnly == true && (navfn.isActive(content, currentNode) || navfn.isOpen(content, currentNode)) || openOnly == false)]
            [#assign children = navfn.navItems(currentNode)]
            [#if children?size > 0]
            [#assign nextLevel = level + 1]
                <ul class="${listClass}">
                    [#list children as child]
                        [@navItem currentNode=child level=nextLevel /]
                    [/#list]
                </ul>
            [/#if]
            [/#if]
            [#assign nextLevel = level]
        </li>
    [/#if]
[/#macro]

[#assign home = navfn.rootPage(content)]
[#assign children = navfn.navItems(home)]
<nav id="mainNavigation" class="o-navigation">
    <ul class="${listClass}">
        [#list children as child]
            [@navItem currentNode=child level=0 /]
        [/#list]
    </ul>
</nav>
