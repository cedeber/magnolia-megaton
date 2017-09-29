<meta charset="utf-8">
[#-- <meta http-equiv="X-UA-Compatible" content="IE=edge"> --]
[#-- <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no"> --]
<meta name="viewport" content="initial-scale=1[#--, viewport-fit=cover--]">
<title>${content.windowTitle!content.title!}</title>
<meta name="description" content="${content.description!}">
<meta name="keywords" content="${content.keywords!}">

<!-- Android / Standard: 192x192px -->
<meta name="application-name" content="My Website">
<meta name="mobile-web-app-capable" content="yes">
<meta name="theme-color" content="#000000">
<link rel="icon" sizes="192x192" href="${ctx.contextPath}/.resources/main/webresources/icons/touch-icon.png">

<!-- iOS: 152x152px (180x180px) -->
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="My Website">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="format-detection" content="telephone=no">
<link rel="apple-touch-icon" href="${ctx.contextPath}/.resources/main/webresources/icons/apple-touch-icon.png">

<!-- Safari pinned tab: 80x80px -->
<link rel="mask-icon" href="${ctx.contextPath}/.resources/main/webresources/icons/website-icon.svg" color="#000000">

<!-- Windows: 144x144px -->
<meta name="msapplication-TileImage" content="${ctx.contextPath}/.resources/main/webresources/icons/ms-touch-icon.png">
<meta name="msapplication-TileColor" content="#000000">
<meta name="msapplication-tap-highlight" content="no">

${resfn.css(["/main/webresources/css/.*css"])!}
<script> window.$$currentPath = "${ctx.contextPath}";</script>
