[#if !cmsfn.isEditMode() && content.code?has_content]
<div id="cookies-eu-banner" style="display: none;">
    ${content.explanations!'By continuing your visit to this site, you accept the use of cookies to make visits statistics.'}
    [#if content.readmorehref?has_content]
        <a href="${navfn.link(cmsfn.contentById(content.readmorehref))!}" id="cookies-eu-more">${content.readmore!'Read more'}</a>
    [/#if]
    <button id="cookies-eu-reject">${content.reject!'Reject'}</button>
    <button id="cookies-eu-accept">${content.accept!'Accept'}</button>
</div>
${resfn.js(["/main/webresources/external/cookies-eu-banner.min.js"])!}
${resfn.css(["/main/webresources/external/cookies-eu-banner.css"])!}

<script>
    new CookiesEuBanner(function(){ ${cmsfn.decode(content).code!} }, false);
</script>
[/#if]
[#if cmsfn.isEditMode()]
[#if !content.code?has_content || !content.explanations?has_content]
<div style="padding:8px;background:red;color:white">
    Please fill code and explanations.
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
[/#if]
