<!DOCTYPE html>
<html lang="${cmsfn.language()}">
<head>
    [@cms.page /]
    [#include "include/head.ftl"]
</head>
<body class="[#if navfn.isActive(content, navfn.rootPage(content))]-home[#else]-main[/#if]">
    <div class="skip-links">
        <a href="#article">Content</a>
        <a href="#mainNavigation">Navigation</a>
    </div>

    <main id="view" class="o-view">
        <header>
            <section class="o-section">
                <div class="o-group is-large o-flex-space">
                    <div>
                        logo: ${model.getRandomNumber()}${model.text}
                    </div>
                    [#include "include/main-navigation.ftl"]
                    [#include "include/languages.ftl"]
                </div>
            </section>
            [@cms.area name="hero" /]
        </header>
        [#include "include/breadcrumbs.ftl"]
        <article>
            [@cms.area name="main" /]
        </article>
        <footer class="o-section has-no-bottom-space">
            <div class="o-group is-large">
                Footer
            </div>
        </footer>
        [#include "include/loading.ftl"]
    </main>
    [#include "include/scripts.ftl"]
</body>
</html>
