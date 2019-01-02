[#if content.searchPage?has_content]
    [#assign queryStr = ctx.getParameter('q')!?html]
    <form action="${cmsfn.link('website', content.searchPage)!}" class="o-search-form o-flex-inline">
        <label class="is-static" for="q">${content.label!i18n['search.title']!}</label>
        <input type="search" name="q" id="q" placeholder="${content.placeholder!i18n['search.placeholder']!}" class="search-input" value="${queryStr!}" maxlength="1000" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false">
        <button class="has-svg-icon search-icon">
            <span class="is-visually-hidden">${content.button!i18n['search.button']!}</span>
            <svg width="20px" height="20px" viewBox="0 0 20 20" aria-hidden="true">
                <circle cx="7.5" cy="7.5" r="6" stroke="currentColor" stroke-width="2" fill="none"></circle>
                <line x1="12" y1="12" x2="18" y2="18" stroke="currentColor" stroke-width="3" stroke-linecap="round"></line>
            </svg>
        </button>
    </form>
[#elseif cmsfn.isEditMode()]
    <p>Please select a search page</p>
[/#if]
