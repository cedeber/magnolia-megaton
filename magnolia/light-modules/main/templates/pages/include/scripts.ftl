[#if !cmsfn.isEditMode()]
    [#assign devMode = cmsfn.authorInstance!false]

    <!-- Application -->
    <script nomodule>window.__nomodule__ = true;</script>
    <script>
        (function() {
            var script = document.createElement("script");
            script.async = true;
            script.defer = true;
            script.crossOrigin = "use-credentials";
            if (window.__nomodule__) {
                script.noModule = true;
                script.src = "${ctx.contextPath}/app-legacy/main.js";
            } else {
                script.type = "module";
                script.src = "${ctx.contextPath}/app/main.js";
            }
            document.body.appendChild(script);
        })();
    </script>

    <!-- Outdated Browsers -->
    [#if !devMode]
    <div id="outdated"></div>
    <script nomodule src="${ctx.contextPath}/.resources/main/webresources/external/outdatedbrowser.min.js"></script>
    <script nomodule>
        const link = document.createElement("link");

        link.setAttribute("rel", "stylesheet");
        link.setAttribute("media", "screen");
        link.setAttribute("href", "${ctx.contextPath}/.resources/main/webresources/external/outdatedbrowser.min.css");

        document.head.appendChild(link);

        outdatedBrowser({
            bgColor: "#f25648",
            color: "#ffffff",
            lowerThan: "IE11",
            languagePath: '${ctx.contextPath}/.resources/main/webresources/external/lang/${cmsfn.language()!'en'}.html'
        });
    </script>
    [/#if]
[/#if]
