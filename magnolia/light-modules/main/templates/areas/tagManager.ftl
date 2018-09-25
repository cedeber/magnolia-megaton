[#if !cmsfn.isEditMode() && cmsfn.isPublicInstance()]
    <cookie-banner v-bind:read-more="'${navfn.link(cmsfn.contentById(content.readmorehref))!}'"
                   v-bind:read-more-label="'${content.readmore?html!}'"
                   v-bind:accept-label="'${content.accept?html!}'"
                   v-bind:reject-label="'${content.reject?html!}'">
        <template slot="explanations">
            <span>${content.explanations!'By continuing your visit to this site, you accept the use of cookies to make visits statistics.'}</span>
        </template>
    </cookie-banner>
[/#if]
[#if cmsfn.isEditMode()]
    <div class="tag-manager-notice">
        [#if !content.explanations?has_content]
            <div style="padding:8px;background:red;color:white">
                Please fill explanations on the root page.
            </div>
        [/#if]
        <div style="padding:8px;background:darkslateblue;color:white">
            Tag Manager is activated through the Cookies compliance banner, which means:<br>
            <br>
            <ul>
                <li>If <a href="https://en.wikipedia.org/wiki/Do_Not_Track" target="_blank" rel="external noopener">Do Not Track</a> is activated, the visitor won't see the bar and no tags will be activated.</li>
                <li>If the visitor reject the use of cookies for tracking purposes, no tags will be activated.</li>
                <li>If the visitor accept to be tracked, all tags will be activated.</li>
            </ul>
        </div>
    </div>
[/#if]
