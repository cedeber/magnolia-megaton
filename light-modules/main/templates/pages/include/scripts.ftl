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
[#if devMode]
    ${resfn.js(["/main/webresources/js/vendor/require.js"])!}
[#else]
    ${resfn.js(["/main/webresources/js/vendor/require.min.js"])!}
[/#if]
<script>
    require.config({
        [#if cmsfn.authorInstance]waitSeconds: 60,[/#if]
        baseUrl: "${ctx.contextPath}/.resources/main/webresources/js/",
        paths: {
            "vue": "vendor/vue[#if !devMode].min[/#if]",
            "vuex": "vendor/vuex[#if !devMode].min[/#if]",
            "vue-router": "vendor/vue-router[#if !devMode].min[/#if]",
            "vue-class-component": "vendor/vue-class-component[#if !devMode].min[/#if]",
            "vue-property-decorator": "vendor/vue-property-decorator[#if !devMode].min[/#if]",
            "reflect-metadata": "vendor/reflect-metadata[#if !devMode].min[/#if]",
            "vuex-class": "vendor/vuex-class[#if !devMode].min[/#if]",
            "lodash": "vendor/lodash[#if !devMode].min[/#if]",
        }
    });
    require([
        "polyfills/es6[#if !devMode].min[/#if]",
        "polyfills/fetch[#if !devMode].min[/#if]",
        "polyfills/match-media[#if !devMode].min[/#if]",
        "polyfills/intersection-observer[#if !devMode].min[/#if]",
        "polyfills/object-fit[#if !devMode].min[/#if]",
        "app/main"
    ]);
</script>
[/#if]
