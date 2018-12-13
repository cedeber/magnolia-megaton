[#if !cmsfn.isEditMode()]

    <!-- Application -->
    <script nomodule>window.__nomodule__ = true;</script>
    <script>
        (function() {
            var script = document.createElement("script");
            script.async = true;
            script.crossOrigin = "use-credentials";

            if (window.__nomodule__) {
                script.noModule = true;
                script.defer = true;
                script.src = "${ctx.contextPath}/app-legacy/main.js";
            } else {
                script.type = "module";
                script.src = "${ctx.contextPath}/app/main.js";
            }
            document.body.appendChild(script);
        })();
    </script>

    <!-- Outdated Browsers -->
    <div id="outdated"></div>
    <script src="${ctx.contextPath}/.resources/main/webresources/external/outdatedbrowser.min.js"></script>
    <script >
        // Plain Javascript
        //event listener: DOM ready
        function addLoadEvent(func) {
            var oldonload = window.onload;
            if (typeof window.onload != 'function') {
                window.onload = func;
            } else {
                window.onload = function() {
                    if (oldonload) {
                        oldonload();
                    }
                    func();
                }
            }
        }
        //call plugin function after DOM ready
        addLoadEvent(function(){
            outdatedBrowser({
                bgColor: '#f25648',
                color: '#ffffff',
                lowerThan: 'IE10', [#-- Set to IE11 necessary --]
                languagePath: '${ctx.contextPath}/.resources/main/webresources/external/lang/${cmsfn.language()!'en'}.html'
            })
        });
    </script>
[/#if]
