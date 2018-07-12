[#assign queryStr = ctx.getParameter('q')!?html]
[#if queryStr?has_content]

    [#--PAGES--]
    ${cmsfn.asJCRNode(navfn.rootPage(content)).getPath()!'no path'}
    [#assign websiteResults = searchfn.searchPages(queryStr+"*", "%", 100, 0) /]
    [#assign totalRecordsFound = websiteResults?size /]

    [#--ASSETS--]
    [#--Finds assets by their properties (title, caption etc). Not their content (pdfs are not parsed!)--]
    [#assign damResults = searchfn.searchContent("dam", queryStr+"*", '%', 'mgnl:asset', 100, 0) /]
    [#assign totalRecordsFound += damResults?size /]

    <div id="results" class="o-group o-links">
        <h1 class="subtitle">${content.searchFor!i18n['search.for']!} &laquo;${queryStr}&raquo;</h1>

        [#if totalRecordsFound > 0]
            <ul>
                [#list websiteResults as item]
                    <li class="link-container search-result">
                        <h2>${item.title!}</h2>
                        [#assign description = item.description!]
                        [#if description?has_content]
                            <p class="link-description">
                                [#--Replace html tags if you use fields which may contain html--]
                                [#--[#assign description = description?replace('<[^>]*>', '', 'r')?replace('...[^>]*>', '...', 'r')]--]
                                [#--Highlight search word--]
                                [#assign description = description?replace(queryStr, "<strong>" + queryStr + "</strong>", "i")]
                                ${description}
                            </p>
                        [/#if]
                        <a class="o-flex-inline link" href="${cmsfn.link(item)!}">
                            ${oifn.getDefaultBaseUrl()}${cmsfn.link(item)}
                        </a>
                    </li>
                [/#list]
                [#list damResults as item]
                    [#assign assetMap = damfn.getAssetMap("jcr:" + item.@id)]
                    <li class="link-container search-result">
                        <h2>
                            ${item.title!item.name!} (${assetMap.metadata.dc.format!})
                        </h2>
                        [#assign assetDescription = item.description!]
                        [#if assetDescription?has_content]
                            <p class="link-description">
                                [#--Replace html tags if you use fields which may contain html--]
                                [#--[#assign assetDescription = assetDescription?replace('<[^>]*>', '', 'r')?replace('...[^>]*>', '...', 'r')]--]
                                [#--Highlight search word--]
                                [#assign assetDescription = assetDescription?replace(queryStr, "<strong>" + queryStr + "</strong>", "i")]
                                ${assetDescription}
                            </p>
                        [/#if]
                        <a class="o-flex-inline link" href="${cmsfn.link(item)!}">
                            ${oifn.getDefaultBaseUrl()}${cmsfn.link(item)}
                        </a>
                    </li>
                [/#list]
            </ul>
        [#else]
            <p class="no-results">${content.noResults!i18n['search.noresults']!}</p>
        [/#if]
    </div>
[#else]
<div id="results" class="o-group o-links">
    <h1 class="subtitle">${content.searchFor!i18n['search.for']!} &laquo;&nbsp;&raquo;</h1>
    <p class="no-results">${content.noResults!i18n['search.noresults']!}</p>
</div>
[/#if]
