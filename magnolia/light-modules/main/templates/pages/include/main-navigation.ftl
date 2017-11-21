[#include "../../macros/link.ftl"]

[#assign openOnly = true]
[#assign depth = 1]
[#assign listClass = "o-flex-inline is-vertical"]

[#macro navItem currentNode level]
    [#if !navfn.isHiddenInNav(currentNode)]
        <li>
            [@link node=currentNode cnt=content lvl=level /]

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
