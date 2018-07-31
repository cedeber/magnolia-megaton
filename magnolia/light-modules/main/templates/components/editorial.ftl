[#assign parent = cmsfn.parent(content, "mgnl:page")!]
[#assign textAlignment = "is-" + content.textAlignment!'left']

[#if ctx.cell?has_content]
    [#assign cellOverride = ctx.cell]
    [#if content.layoutOverride?has_content]
        [#if content.layoutOverride == "full"]
            [#assign cellOverride = "1of1"]
        [#elseif content.layoutOverride == "wider"]
            [#if ctx.cell == "1of3"]
                [#assign cellOverride = "2of3"]
            [#elseif ctx.cell == "1of4"]
                [#assign cellOverride = "3of4"]
            [/#if]
        [/#if]
    [/#if]
[/#if]

[#if content.callToActionText?has_content && content.callToActionLink?has_content]
    [#if content.callToActionLink == "Section" && content.callToActionLinkSection?has_content]
        [#assign scrollLink = content.callToActionLinkSection!]
    [#elseif content.callToActionLink == "Internal" && content.callToActionLinkInternal?has_content]
        [#assign internalContentMap = cmsfn.contentById(content.callToActionLinkInternal)!]
        [#if internalContentMap?has_content]
            [#assign redirectLink = navfn.link(internalContentMap)!]
        [/#if]
    [#elseif content.callToActionLink == "External" && content.callToActionLinkExternal?has_content]
        [#assign redirectLink = content.callToActionLinkExternal!]
    [/#if]
[/#if]

<!-- Editorial -->
<div class="o-editorial ${textAlignment} [#if cellOverride?has_content]cell-${cellOverride!}[/#if]">
    [#if content.preHeader?has_content || content.title?has_content || ctx.orderIndex?? && ctx.orderIndex == 0]
    <header>
        [#if content.preHeader?has_content]
            <p class="pre-header">${content.preHeader!}</p>
        [/#if]
        [#if content.title?has_content]
            [#if ctx.orderIndex?? && ctx.orderIndex > 0]
            <h1 class="title">${cmsfn.decode(content).title!}</h1>
            [#else]
            <h1 class="title">
                [#if ctx.parentOrderIndex?? && ctx.parentOrderIndex > 0]
                    ${cmsfn.decode(content).title!}
                [#else]
                    [#if content.title?has_content]
                        ${cmsfn.decode(content).title!}
                    [/#if]
                [/#if]
            </h1>
            [/#if]
        [/#if]
    </header>
    [/#if]

    [#if content.intro?has_content]
    <p class="intro">${cmsfn.decode(content).intro!}</p>
    [/#if]

    [#if content.body?has_content]
    ${cmsfn.decode(content).body!}
    [/#if]

    [#if scrollLink?has_content]
    <a v-scroll="'#${scrollLink!}'" class="call-to-action">
        ${content.callToActionText!}
    </a>
    [#elseif redirectLink?has_content]
    <a href="${redirectLink}" class="call-to-action"
       [#if content.callToActionLink == "External"]target="_blank" rel="noopener"[/#if]
       >
        ${content.callToActionText!}
    </a>
    [/#if]
</div>
