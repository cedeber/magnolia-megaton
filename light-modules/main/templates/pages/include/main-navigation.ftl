[#assign openOnly = true]
[#assign depth = 1]
[#assign listClass = "o-flex-inline is-vertical"]

[#macro navItem link level]
    [#if !navfn.isHiddenInNav(link)]
        [#assign linkContent = cmsfn.contentById(link.@uuid)! /]
        [#if linkContent.redirect?has_content]
            [#if linkContent.redirect == "internal" && linkContent.redirectinternal?has_content]
                [#assign redirectLinkInternal = cmsfn.link('website', linkContent.redirectinternal)! /]
            [#elseif linkContent.redirect == "external" && linkContent.redirectexternal?has_content]
                [#assign redirectLinkExternal = linkContent.redirectexternal! /]
            [/#if]
        [/#if]
        <li>
            <a class="link[#if navfn.isActive(content, link)] is-active[/#if][#if navfn.isOpen(content, link)] is-parent[/#if] is-level-${level}"
                [#if redirectLinkExternal?has_content]target="_blank" rel="noopener external"[/#if]
                href="${redirectLinkExternal!redirectLinkInternal!cmsfn.link(link)!}">
                ${link.navigationTitle!link.title!}
            </a>

            [#if level < depth && (openOnly == true && (navfn.isActive(content, link) || navfn.isOpen(content, link)) || openOnly == false)]
            [#assign children = cmsfn.children(link, "mgnl:page")]
            [#if children?size > 0]
            [#assign nextLevel = level + 1]
                <ul class="${listClass}">
                    [#list children as child]
                        [@navItem link=child level=nextLevel /]
                    [/#list]
                </ul>
            [/#if]
            [/#if]
            [#assign nextLevel = level]
        </li>
    [/#if]
[/#macro]

[#assign home = navfn.rootPage(content) /]
[#assign children = cmsfn.children(home, "mgnl:page")]
<nav id="mainNavigation" class="o-navigation">
    <ul class="${listClass}">
        [#list children as child]
            [@navItem link=child level=0 /]
        [/#list]
    </ul>
</nav>
