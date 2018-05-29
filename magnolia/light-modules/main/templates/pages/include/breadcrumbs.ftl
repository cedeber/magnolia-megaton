[#macro splitter]
    <li class="splitter has-svg-icon" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
    </li>
[/#macro]

[#macro link href label]
[#if label?has_content]
<li>
    [#if href?has_content]<a class="link" href="${href!}">[/#if]
        ${label!}
    [#if href?has_content]</a>[/#if]
</li>
[/#if]
[/#macro]

<section class="o-section has-no-top-space has-no-bottom-space">
    <div class="o-group is-large">
        <nav class="o-breadcrumbs">
            <ol class="o-flex-inline is-middle">
                [#assign rootPage = navfn.rootPage(content)!]
                <li>
                    <a class="link has-svg-icon" href="${navfn.link(rootPage)!}" aria-labelledby="homeIconBreadcrumbs">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                            <desc id="homeIconBreadcrumbs">${rootPage.navigationTitle!rootPage.title!i18n['homepage']!"Home"}</desc>
                        </svg>
                    </a>
                </li>
                [@splitter /]

                [#-- Ancestors --]
                [#assign ancestors = cmsfn.ancestors(content, "mgnl:page")]
                [#assign ancestorsSize = ancestors?size]
                [#assign index = 1]
                [#assign maxAncestorsToShow = 1]

                [#if maxAncestorsToShow < ancestorsSize - 1]
                    ...
                    [@splitter /]
                [/#if]

                [#list ancestors as ancestor]
                    [#if cmsfn.asJCRNode(ancestor).depth > 1]
                        [#if maxAncestorsToShow <= ancestorsSize && index gte ancestorsSize - maxAncestorsToShow]
                            [@link href=navfn.link(ancestor) label=ancestor.navigationTitle!ancestor.title /]
                            [@splitter /]
                        [/#if]
                        [#assign index = index + 1]
                    [/#if]
                [/#list]

                [#-- Current Node --]
                [#if cmsfn.asJCRNode(content).depth > 1]
                    [@link href="" label=content.navigationTitle!content.title /]
                    [@splitter /]
                [/#if]
            </ol>
            [#if cmsfn.asJCRNode(content).depth > 1]
                <script type="application/ld+json">
                [@compress single_line=true]
                {
                    "@context": "http://schema.org",
                    "@type": "BreadcrumbList",
                    "itemListElement":
                    [
                        [#assign ancestorsJSON = cmsfn.ancestors(content, "mgnl:page")]
                        [#assign indexJSON = 1]
                        [#list ancestorsJSON as ancestorJSON]
                            [#if cmsfn.asJCRNode(ancestorJSON).depth > 1]
                                [#if indexJSON > 1],[/#if]
                                {
                                    "@type": "ListItem",
                                    "position": ${indexJSON},
                                    "item":
                                    {
                                        "@id": "${navfn.link(ancestorJSON)!}",
                                        "name": "${ancestorJSON.navigationTitle!ancestorJSON.title!}"
                                    }
                                }
                                [#assign indexJSON = indexJSON + 1]
                            [/#if]
                        [/#list]
                    ]
                }
                [/@compress]
                </script>
            [/#if]
        </nav>
    </div>
</section>
