[#if content.searchPage?has_content]
    <form action="${cmsfn.link('website', content.searchPage)!}" class="o-search-form o-flex-inline">
        <input type="search" name="q" placeholder="${content.placeholder!}" title="${i18n['search.title']!}" class="search-input" value="${queryStr!}" maxlength="1000" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false">
        <button class="has-svg-icon search-icon">
            <span class="is-visually-hidden">${content.label!}</span>
            <svg width="20px" height="20px" viewBox="0 0 20 20" aria-hidden="true">
                <path fill="currentColor" fill-rule="evenodd" d="M13.71 11.67a7.08 7.08 0 0 0 1.4-4.27C15.1 3.3 11.73 0 7.55 0A7.48 7.48 0 0 0 0 7.4c0 4.08 3.38 7.4 7.55 7.4 1.59 0 3.45-.67 4.29-1.32.14-.16 6.06 5.73 6.06 5.73a1 1 0 0 0 1.4 0l.31-.3c.4-.39.4-1.01 0-1.4 0 0-6.21-6.11-5.9-5.84zm-6.16.85A5.17 5.17 0 0 1 2.32 7.4a5.17 5.17 0 0 1 5.23-5.12c2.9 0 5.23 2.28 5.23 5.12a5.17 5.17 0 0 1-5.23 5.12z"></path>
            </svg>
        </button>
    </form>
[#else]
    [#if cmsfn.isEditMode()]
        <p>Please select a search page</p>
    [/#if]
[/#if]

