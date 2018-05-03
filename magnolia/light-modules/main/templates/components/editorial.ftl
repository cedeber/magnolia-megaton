[#assign parent = cmsfn.parent(content, "mgnl:page")!]
[#assign cellOverride = content.layoutOverride?? && content.layoutOverride == true]
[#assign textAlignment = "is-" + content.textAlignment!'left']

<!-- Editorial -->
<div class="o-editorial ${textAlignment} cell-[#if cellOverride]1of1[#else]${ctx.cell!'no'}[/#if]">
    [#if content.preHeader?has_content || content.title?has_content || ctx.orderIndex == 0]
    <header>
        [#if content.preHeader?has_content]
            <p class="pre-header">${content.preHeader!}</p>
        [/#if]
        [#if ctx.orderIndex > 0]
            [#if content.title?has_content]
                <h1 class="title">${cmsfn.decode(content).title!}</h1>
            [/#if]
        [#else]
            <h1 class="title">
                [#if ctx.parentOrderIndex > 0]
                    ${cmsfn.decode(content).title!}
                [#else]
                    [#if content.title?has_content]
                        ${cmsfn.decode(content).title!}
                    [#else]
                        ${parent.title!}
                    [/#if]
                [/#if]
            </h1>
        [/#if]
    </header>
    [/#if]

    [#if content.intro?has_content]
    <p class="intro">${cmsfn.decode(content).intro!}</p>
    [/#if]

    [#if content.body?has_content]
    ${cmsfn.decode(content).body!}
    [/#if]
</div>
