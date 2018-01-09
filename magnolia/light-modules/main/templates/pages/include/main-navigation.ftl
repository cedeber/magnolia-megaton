[#include "../../macros/link.ftl"]

[#assign listClass = "o-flex-inline is-vertical"]

[#macro navItemRecursion node level depth open]
    [#if !navfn.isHiddenInNav(node)]
        <li>
            [@link node=node cnt=content lvl=level /]

            [#if level < depth && (open == true && (navfn.isActive(content, node) || navfn.isOpen(content, node)) || open == false)]
            [#assign children = navfn.navItems(node)]
            [#if children?size > 0]
            [#assign nextLevel = level + 1]
                <ul class="${listClass}">
                    [#list children as child]
                        [@navItemRecursion node=child level=nextLevel depth=depth open=open /]
                    [/#list]
                </ul>
            [/#if]
            [/#if]
            [#assign nextLevel = level]
        </li>
    [/#if]
[/#macro]

[#macro navItem currentNode maxDepth openOnly]
    [@navItemRecursion node=currentNode level=0 depth=maxDepth open=openOnly /]
[/#macro]

[#assign home = navfn.rootPage(content)]
[#assign children = navfn.navItems(home)]
<nav id="mainNavigation" class="o-navigation">
    <ul class="${listClass}">
        [#list children as child]
            [@navItem currentNode=child maxDepth=1 openOnly=true /]
        [/#list]
    </ul>
</nav>
