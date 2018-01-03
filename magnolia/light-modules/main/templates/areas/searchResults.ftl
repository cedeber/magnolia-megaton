[#assign queryStr = ctx.getParameter('q')!?html]
[#if queryStr?has_content]
    [#assign searchResults = searchfn.searchPages(queryStr+"*", cmsfn.asJCRNode(navfn.rootPage(content)).getPath(), 100, 0) /]
    [#assign recordsFound = searchResults?size /]
    <div id="results" class="o-group o-links">
        <h1 class="subtitle">${content.searchFor!'Suche nach'} &laquo;${queryStr}&raquo;</h1>

        [#if searchResults?has_content && recordsFound > 0]
            <ul>
                [#list searchResults as item]
                    <li class="link-container search-result">
                        <a class="o-flex-inline link" href="${cmsfn.link(item)!}">
                            <p>
                                <span class="link-title h2">${item.title!}</span>
                                <br><span class="link-description">${item.excerpt?replace('<[^>]*>', '', 'r')?replace(queryStr, "<strong>"+queryStr+"</strong>", "i")!}</span>
                            </p>
                        </a>
                    </li>
                [/#list]
            </ul>
        [#else]
            <p class="no-results">${content.noResults!'Keine Resultate'}</p>
        [/#if]
    </div>
[#elseif cmsfn.isEditMode()]
    <p>No searchword provided</p>
[/#if]
