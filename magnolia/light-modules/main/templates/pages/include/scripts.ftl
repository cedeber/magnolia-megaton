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
    [#--
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
    --]
    [/#if]
[/#if]

<!-- Cookies EU Banner -->
[@cms.area name="tagManager" /]
