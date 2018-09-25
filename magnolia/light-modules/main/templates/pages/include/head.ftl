[#assign root = navfn.rootPage(content)!content!]

[#assign webAppShortName = "Megaton"]
[#assign webAppThemeColor = "#000000"]

<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no[#--, viewport-fit=cover--]">
<title>${content.metaTitle!content.windowTitle!content.navigationTitle!content.title!}</title>
<meta name="description" content="${content.description!}">
<meta name="keywords" content="${content.keywords!root.keywords!}">

<!-- Web Application -->
<style media="screen">
    [#include "/main/webresources/build/module/shell.css"]
</style>

[#if cmsfn.isEditMode()]
<style>
    .no-edit { display: none; }
    .o-flex > .mgnlEditorBar { flex-basis: 100%; }
</style>
[/#if]
<script>window.mgnlContextPath = "${ctx.contextPath}";</script>

<link rel="manifest" href="${ctx.contextPath}/manifest.json">

<!-- Android / Standard: 192x192px -->
<meta name="application-name" content="${webAppShortName!}">
<meta name="mobile-web-app-capable" content="no">
<meta name="theme-color" content="${webAppThemeColor!}">
<link rel="icon" sizes="192x192" href="${ctx.contextPath}/icns-touch-icon.png">

<!-- iOS: 152x152px (180x180px) -->
<meta name="apple-mobile-web-app-capable" content="no">
<meta name="apple-mobile-web-app-title" content="${webAppShortName!}">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="format-detection" content="telephone=no">
<link rel="apple-touch-icon" href="${ctx.contextPath}/icns-apple-touch-icon.png">

<!-- Safari pinned tab: 80x80px -->
<link rel="mask-icon" href="${ctx.contextPath}/icns-website-icon.svg" color="${webAppThemeColor!}">

<!-- Windows: 144x144px -->
<meta name="msapplication-TileImage" content="${ctx.contextPath}/icns-ms-touch-icon.png">
<meta name="msapplication-TileColor" content="${webAppThemeColor!}">
<meta name="msapplication-tap-highlight" content="no">

<!-- Social networks -->
<meta property="og:title" content="${content.metaTitle!content.windowTitle!content.navigationTitle!content.title!}">
<meta property="og:description" content="${content.description!root.description!}">
<meta property="og:url" content="${oifn.getDefaultBaseUrl()!}">
<meta property="og:site_name" content="${webAppShortName!}">
<meta property="og:locale" content="${cmsfn.language()!}">

<meta name="twitter:title" content="${content.metaTitle!content.windowTitle!content.navigationTitle!content.title!}">
<meta name="twitter:description" content="${content.description!root.description!}">

[#if content.image?? && damfn.getAsset(content.image)??]
    [#assign image = content.image]
[#elseif root.image?? && damfn.getAsset(root.image)??]
    [#assign image = root.image]
[/#if]

[#if image?has_content]
    [#assign imageLink = oifn.getDefaultBaseUrl() + damfn.getAssetLink(image)!]
    [#assign imageMap = damfn.getAssetMap(image)!]
    <meta property="og:image" content="${imageLink!}">
    <meta property="og:image:width" content="${imageMap.metadata.mgnl.width?round?string.computer!}">
    <meta property="og:image:height" content="${imageMap.metadata.mgnl.height?round?string.computer!}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:image" content="${imageLink!}">
    <meta name="twitter:image:alt" content="${imageMap.caption!imageMap.description!}">
[/#if]
