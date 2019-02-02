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
[/#if]
