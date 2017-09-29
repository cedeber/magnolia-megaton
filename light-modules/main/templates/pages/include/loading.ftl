[#if !cmsfn.isEditMode()]
<div id="loading" role="presentation" aria-hidden="true" class="o-flex-middle o-loading">
    <img class="content" src="${ctx.contextPath}/.resources/main/webresources/images/MouseManRunning.gif" width="75" height="auto" alt="" style="opacity:0">
    <span class="is-visually-hidden">Page is loading...</span>
    <script>
        setTimeout(function() {
            var element = document.getElementById("loading");
            element.classList.add("js-loading");
        }, 0);
    </script>
    <noscript><style>#loading{display: none !important;}</style></noscript>
</div>
[/#if]
