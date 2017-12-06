[#assign parent = cmsfn.parent(content, "mgnl:page")!]
[#assign isLarge = content.isLarge?? && content.isLarge == true]
[#assign hasBackground = content.backgroundTheme?has_content && content.backgroundTheme != "default"]
[#assign hasInnerSpace = hasBackground && !(content.space?? && (content.space?seq_contains("bottom") || content.space?seq_contains("top")))]
[#assign hasNoTopSpace = content.space?? && content.space?seq_contains("top") || hasBackground || hasInnerSpace]
[#assign hasNoBottomSpace = content.space?? && content.space?seq_contains("bottom") || hasBackground || hasInnerSpace]
<!-- Editorial -->
<section class="o-section [#if hasBackground]has-background -${content.backgroundTheme!} is-full-width[/#if] [#if hasNoTopSpace]has-no-top-space[/#if] [#if hasNoBottomSpace]has-no-bottom-space[/#if] [#if hasInnerSpace]has-inner-space[/#if]">
    <div class="o-group o-editorial [#if isLarge]is-large[/#if] [#if hasBackground]has-inner-gutter[/#if]">
        <header>
            [#if content.preHeader?has_content]
                <p class="pre-header">${content.preHeader!}</p>
            [/#if]
            [#if ctx.orderIndex > 0]
                [#if content.title?has_content]
                    <h2 class="title h2">${content.title!}</h2>
                [/#if]
            [#else]
                <h1 class="title h1">${content.title!parent.title!}</h1>
            [/#if]
        </header>

        [#if content.intro?has_content]
        <p class="intro">${cmsfn.decode(content).intro!}</p>
        [/#if]

        [#if content.body?has_content]
        ${cmsfn.decode(content).body!}
        [/#if]
    </div>
</section>
