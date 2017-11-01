[#assign root = navfn.rootPage(content)!content!]
[#assign baseUrl = state.originalBrowserURL?replace(state.currentURI, '')!]
<meta charset="utf-8">
[#-- <meta http-equiv="X-UA-Compatible" content="IE=edge"> --]
[#-- <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no"> --]
<meta name="viewport" content="initial-scale=1[#--, viewport-fit=cover--]">
<title>${content.windowTitle!content.title!}</title>
<meta name="description" content="${content.description!root.description!}">
<meta name="keywords" content="${content.keywords!root.keywords!}">

<!-- Android / Standard: 192x192px -->
<meta name="application-name" content="${content.app!root.app!}">
<meta name="mobile-web-app-capable" content="yes">
<meta name="theme-color" content="${content.color!root.color!'#000000'}">
<link rel="icon" sizes="192x192" href="${ctx.contextPath}/.resources/main/webresources/icons/touch-icon.png">

<!-- iOS: 152x152px (180x180px) -->
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="${content.app!root.app!}">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="format-detection" content="telephone=no">
<link rel="apple-touch-icon" href="${ctx.contextPath}/.resources/main/webresources/icons/apple-touch-icon.png">

<!-- Safari pinned tab: 80x80px -->
<link rel="mask-icon" href="${ctx.contextPath}/.resources/main/webresources/icons/website-icon.svg" color="${content.color!root.color!'#000000'}">

<!-- Windows: 144x144px -->
<meta name="msapplication-TileImage" content="${ctx.contextPath}/.resources/main/webresources/icons/ms-touch-icon.png">
<meta name="msapplication-TileColor" content="${content.color!root.color!'#000000'}">
<meta name="msapplication-tap-highlight" content="no">

<!-- Social networks -->
<meta property="og:title" content="${content.title!}">
<meta property="og:description" content="${content.description!root.description!}">
<meta property="og:url" content="${state.originalBrowserURL!}">
<meta property="og:site_name" content="${content.app!root.app!}">
<meta property="og:locale" content="${cmsfn.language()!}">

<meta name="twitter:title" content="${content.title!}">
<meta name="twitter:description" content="${content.description!root.description!}">
<meta name="twitter:card" content="summary_large_image">

[#if content.image?? && damfn.getAsset(content.image)??]
    [#assign image = content.image]
[#elseif root.image?? && damfn.getAsset(root.image)??]
    [#assign image = root.image]
[/#if]

[#if image?has_content]
    [#assign imageLink = baseUrl + damfn.getAssetLink(root.image)!]
    [#assign imageMap = damfn.getAssetMap(root.image)!]
    <meta property="og:image" content="${imageLink!}">
    <meta property="og:image:width" content="${imageMap.metadata.mgnl.width?round?string.computer!}">
    <meta property="og:image:height" content="${imageMap.metadata.mgnl.height?round?string.computer!}">
    <meta name="twitter:image" content="${imageLink!}">
    <meta name="twitter:image:alt" content="${imageMap.caption!imageMap.description!}">
[/#if]

<!-- Application -->
[#assign app = def.parameters.app!"main"]
${resfn.css(["/main/webresources/app/" + app + ".*.css"])!}
<script>window.$$currentPath = "${ctx.contextPath}";</script>
