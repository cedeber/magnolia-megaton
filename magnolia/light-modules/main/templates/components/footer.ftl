[#include "../macros/navigation.ftl"]

[#assign root = navfn.rootPage(content)!]
[#assign children = navfn.navItems(root)]

<footer class="o-section o-footer">
    <div class="o-group is-large">
        <ul class="o-flex-space">
        [#list children as child]
            [@navItem startNode=child maxDepth=0 openOnlyOnActive=false listClass="o-flex-inline is-vertical" /]
        [/#list]
        </ul>
    </div>
    <div class="o-group is-large o-flex-space">
        <div>${cmsfn.decode(content).copyright!}</div>
        <div>
            <ul class="o-flex-inline">
                [@cms.area name="linksArea"/]
            </ul>
        </div>
    </div>
</footer>
