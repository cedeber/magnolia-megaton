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
                        <a class="o-flex-inline link" href="${cmsfn.link(item)!}">
                            <p>
                                <span class="link-title h2">${item.title!}</span>
                                <br><span class="link-description">${item.excerpt?replace('<[^>]*>', '', 'r')?replace('...[^>]*>', '...', 'r')?replace(queryStr, "<strong>"+queryStr+"</strong>", "i")!}</span>
                            </p>
                        </a>
                    </li>
                [/#list]
                [#list damResults as item]
                    [#assign assetMap = damfn.getAssetMap("jcr:"+item.@id)]
                    <li class="link-container search-result">
                        <a class="o-flex-inline link" href="${cmsfn.link(item)!}">
                            <p>
                                <span class="link-title h2">${item.title!} (${assetMap.metadata.dc.format!})</span>
                                <br><span class="link-description">${item.excerpt?replace('<[^>]*>', '', 'r')?replace('...[^>]*>', '...', 'r')?replace(queryStr, "<strong>"+queryStr+"</strong>", "i")!}</span>
                            </p>
                        </a>
                    </li>
                [/#list]
            </ul>
        [#else]
            <p class="no-results">${content.noResults!'Keine Resultate'}</p>
        [/#if]
    </div>
[/#if]
