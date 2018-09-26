[#if !cmsfn.isEditMode()]
    [#assign devMode = cmsfn.authorInstance!false]

    <!-- Application -->
    <script>
        (function () {
            var check = document.createElement('script');
            if (!('noModule' in check) && 'onbeforeload' in check) {
                var support = false;
                document.addEventListener('beforeload', function (e) {
                    if (e.target === check) {
                        support = true;
                    } else if (!e.target.hasAttribute('nomodule') || !support) {
                        return;
                    }
                    e.preventDefault();
                }, true);

                check.type = 'module';
                check.src = '.';
                document.head.appendChild(check);
                check.remove();
            }
        }());
    </script>
    <script async type="module" crossorigin src="${ctx.contextPath}/app/main.js"></script>
    <script async defer nomodule src="${ctx.contextPath}/app-legacy/main.js"></script>

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
