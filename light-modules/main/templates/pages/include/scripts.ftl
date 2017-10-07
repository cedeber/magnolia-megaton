[#if !cmsfn.isEditMode()]
[#assign devMode = cmsfn.authorInstance!false]

<!-- Outdated Browsers -->
[#if !devMode]
<div id="outdated"></div>
${resfn.js(["/main/webresources/external/outdatedbrowser.min.js"])!}
${resfn.css(["/main/webresources/external/outdatedbrowser.min.css"])!}
<script>
    outdatedBrowser({
        bgColor: "#f25648",
        color: "#ffffff",
        lowerThan: "IE11",
        languagePath: '${ctx.contextPath}/.resources/main/webresources/external/lang/${cmsfn.language()}.html'
    });
</script>
[/#if]

<!-- Cookies EU Banner -->
[#if !devMode]
<div id="cookies-eu-banner" style="display: none;">
    By continuing your visit to this site, you accept the use of cookies by Google Analytics to make visits statistics.
    <a href="./read-more.html" id="cookies-eu-more">Read more</a>
    <button id="cookies-eu-reject">Reject</button>
    <button id="cookies-eu-accept">Accept</button>
</div>
${resfn.js(["/main/webresources/external/cookies-eu-banner.min.js"])!}
${resfn.css(["/main/webresources/external/cookies-eu-banner.css"])!}
<script>
    new CookiesEuBanner(function(){
        // Your anti-privacy scripts
    }, false);
</script>
[/#if]

<!-- Application -->
${resfn.js(["/main/webresources/js/polyfills.bundle.js"])!}
${resfn.js(["/main/webresources/js/app.bundle.js"])!}
[/#if]
