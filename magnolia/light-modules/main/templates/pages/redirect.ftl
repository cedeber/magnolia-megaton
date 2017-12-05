[#if content.redirect?has_content]
    [#if content.redirect == "internal" && content.redirectinternal?has_content]
        [#assign internalContentMap = cmsfn.contentById(content.redirectinternal)!]
        [#if internalContentMap?has_content]
            [#assign redirectLink = navfn.link(internalContentMap)!]
        [/#if]
    [#elseif content.redirect == "external" && content.redirectexternal?has_content]
        [#assign redirectLink = content.redirectexternal!]
    [/#if]
[/#if]

<!DOCTYPE html>
<html lang="en">
    <head>
    [@cms.page /]
    [#if !cmsfn.isEditMode() && redirectLink?has_content]
        <meta http-equiv="refresh" content="0; url=${redirectLink}">
    [/#if]
    </head>
    <body>
        <main id="view" class="o-view">
            [#if cmsfn.isEditMode()]
                [#if redirectLink?has_content]
                    Redirect to Page: ${redirectLink}
                [#else]
                    No valid redirect link found!
                [/#if]
            [#else]
                [#if redirectLink?has_content]
                    You will be redirected to <a href="${redirectLink}">this page</a>
                [/#if]
            [/#if]
        </main>
    </body>
</html>
