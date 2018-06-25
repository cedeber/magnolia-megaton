[#assign root = navfn.rootPage(content)!]
[#assign children = navfn.navItems(root)]

<!DOCTYPE html>
<html lang="${cmsfn.language()!'en'}">
<head>
    [@cms.page /]
    [#include "include/head.ftl"]
</head>
<body class="[#if navfn.isActive(content, navfn.rootPage(content))]-home[#else]-main[/#if]">
    <div class="skip-links">
        <a href="#mainNavigation" accesskey="1">Navigation</a>
        <a href="#mainContent" accesskey="2">Content</a>
    </div>

    <main id="view" class="o-view">
        <header class="o-view-header">
            <ul class="o-flex-space">
                <li>
                    <ul class="o-flex-space">
                        [#if children?size > 0]
                        <li>
                            <button v-on:click="toggleMenu" class="toggle-menu-button" v-bind:class="{'js-open': isMenuOpen}" aria-label="${i18n['menu.toggle']}">
                                <div class="toggle-menu-bars" aria-hidden="true"></div>
                            </button>
                        </li>
                        [/#if]
                         <li>
                            <a class="logo" href="${navfn.link(root)}" accesskey="0" aria-label="${i18n['homepage']}">
                                [ LOGO ]
                            </a>
                        </li>
                    </ul>
                </li>
                <li>
                    [@cms.area name="searchBar" /]
                </li>
                <li>
                    [#include "include/languages.ftl"]
                </li>
            </ul>
        </header>
        [#include "include/main-navigation.ftl"]
        <section class="o-section is-full-width has-no-top-space has-no-bottom-space">
            <div class="o-group is-full-width">
                [@cms.area name="hero" /]
            </div>
        </section>
        [#include "include/breadcrumbs.ftl"]
        <article id="mainContent">
            [@cms.area name="main" /]
        </article>
        [@cms.area name="footer" /]
        [#--if !cmsfn.isEditMode()]
            <loading-page></loading-page>
        [/#if--]
    </main>
    [#include "include/scripts.ftl"]
</body>
</html>
