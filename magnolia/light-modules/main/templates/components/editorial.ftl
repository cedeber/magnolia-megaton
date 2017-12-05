[#assign parent = cmsfn.parent(content, "mgnl:page")!]
[#assign cellOverride = content.layoutOverride?? && content.layoutOverride == true]

<!-- Editorial -->
<div class="o-editorial cell-[#if cellOverride]1of1[#else]${ctx.cell!'no'}[/#if]">
    <header>
        [#if content.preHeader?has_content]
            <p class="pre-header">${content.preHeader!}</p>
        [/#if]
        [#if ctx.orderIndex > 0]
            [#if content.title?has_content]
                <h2 class="title h2">${content.title!}</h2>
            [/#if]
        [#else]
            <h1 class="title h1">
                [#if ctx.parentOrderIndex! > 0]
                    ${content.title!}
                [#else]
                    ${content.title!parent.title!}
                [/#if]
            </h1>
        [/#if]
    </header>

    [#if content.intro?has_content]
    <p class="intro">${cmsfn.decode(content).intro!}</p>
    [/#if]

    [#if content.body?has_content]
    ${cmsfn.decode(content).body!}
    [/#if]
</div>
