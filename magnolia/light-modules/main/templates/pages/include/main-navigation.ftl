[#include "../../macros/navigation.ftl"]

[#assign root = navfn.rootPage(content)!]
[#assign children = navfn.navItems(root)]

<nav id="mainNavigation" class="o-navigation has-hidden-links" v-bind:class="{'js-open': isMenuOpen}">
    <ul class="o-flex-inline is-vertical">
        [#list children as child]
            [@navItem startNode=child maxDepth=1 openOnlyOnActive=true listClass="o-flex-inline is-vertical" /]
        [/#list]
    </ul>
</nav>
