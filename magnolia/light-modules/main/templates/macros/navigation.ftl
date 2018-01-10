[#include "./link.ftl"]

[#--Use this in your Freemarker templates--]
[#macro navItem startNode maxDepth openOnlyOnActive listClass]
    [@navItemRecursion node=startNode level=0 depth=maxDepth open=openOnlyOnActive listClass=listClass /]
[/#macro]

[#--Only for recursion--]
[#macro navItemRecursion node level depth open listClass]
    [#if !navfn.isHiddenInNav(node)]
        <li>
            [@link node=node cnt=content lvl=level /]

            [#if level < depth && (open == true && (navfn.isActive(content, node) || navfn.isOpen(content, node)) || open == false)]
                [#assign children = navfn.navItems(node)]
                [#if children?size > 0]
                    [#assign nextLevel = level + 1]
                <ul class="${listClass}">
                    [#list children as child]
                        [@navItemRecursion node=child level=nextLevel depth=depth open=open listClass=listClass /]
                    [/#list]
                </ul>
                [/#if]
            [/#if]
            [#assign nextLevel = level]
        </li>
    [/#if]
[/#macro]
