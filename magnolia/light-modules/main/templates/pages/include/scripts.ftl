[#if !cmsfn.isEditMode()]
    [#assign devMode = cmsfn.authorInstance!false]

    <!-- Application -->
    [#assign app = def.parameters.app!"main"]
    <script src="/app/commons.js"></script>
    <script async defer src="/app/${app!}.js"></script>
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
            languagePath: '${ctx.contextPath}/.resources/main/webresources/external/lang/${cmsfn.language()!'en'}.html'
        });
    </script>
    [/#if]
[/#if]

<!-- Cookies EU Banner -->
[@cms.area name="tagManager" /]
