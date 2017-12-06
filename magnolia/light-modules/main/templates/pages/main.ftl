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
        <header>
            <section class="o-section">
                <div class="o-group is-large o-flex-space">
                    <a id="logo" href="/${navfn.rootPage(content)!}" accesskey="0">
                        logo
                    </a>
                    [#include "include/main-navigation.ftl"]
                    [#include "include/languages.ftl"]
                </div>
            </section>
            [@cms.area name="hero" /]
        </header>
        [#include "include/breadcrumbs.ftl"]
        <article id="mainContent">
            [@cms.area name="main" /]
        </article>
        <footer class="o-section has-no-bottom-space">
            <div class="o-group is-large">
                Footer
            </div>
        </footer>
        [#if !cmsfn.isEditMode()]
            <loading-page></loading-page>
        [/#if]
    </main>
    [#include "include/scripts.ftl"]
</body>
</html>