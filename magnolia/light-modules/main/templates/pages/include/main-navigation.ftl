[#include "../../macros/navigation.ftl"]

[#assign home = navfn.rootPage(content)]
[#assign children = navfn.navItems(home)]

<nav id="mainNavigation" class="o-navigation">
    <ul class="o-flex-inline is-vertical">
        [#list children as child]
            [@navItem startNode=child maxDepth=1 openOnlyOnActive=true listClass="o-flex-inline is-vertical" /]
        [/#list]
    </ul>
</nav>
