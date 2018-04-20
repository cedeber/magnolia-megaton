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
        <h1 class="subtitle">${content.searchFor!'Suche nach'} &laquo;${queryStr}&raquo;</h1>

        [#if totalRecordsFound > 0]
            <ul>
                [#list websiteResults as item]
                    <li class="link-container search-result">
                        <h2>${item.title!}</h2>
                        [#assign description = item.description!]
                        [#if description?has_content]
                            <p class="link-description">
                                ${description?replace('<[^>]*>', '', 'r')?replace('...[^>]*>', '...', 'r')?replace(queryStr, "<strong>"+queryStr+"</strong>", "i")!}
                            </p>
                        [/#if]
                        <a class="o-flex-inline link" href="${cmsfn.link(item)!}">
                            ${oifn.getDefaultBaseUrl()}${cmsfn.link(item)}
                        </a>
                    </li>
                [/#list]
                [#list damResults as item]
                    [#assign assetMap = damfn.getAssetMap("jcr:"+item.@id)]
                    <li class="link-container search-result">
                        <h2>
                            ${item.title!item.name!} (${assetMap.metadata.dc.format!})
                        </h2>
                        [#assign assetDescription = item.description!]
                        [#if assetDescription?has_content]
                            <p class="link-description">
                                ${assetDescription?replace('<[^>]*>', '', 'r')?replace('...[^>]*>', '...', 'r')?replace(queryStr, "<strong>"+queryStr+"</strong>", "i")!}
                            </p>
                        [/#if]
                        <a class="o-flex-inline link" href="${cmsfn.link(item)!}">
                            ${oifn.getDefaultBaseUrl()}${cmsfn.link(item)}
                        </a>
                    </li>
                [/#list]
            </ul>
        [#else]
            <p class="no-results">${content.noResults!'Keine Resultate'}</p>
        [/#if]
    </div>
[/#if]
