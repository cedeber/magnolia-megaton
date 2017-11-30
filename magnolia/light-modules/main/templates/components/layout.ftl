[#assign parent = cmsfn.parent(content, "mgnl:page")!]
[#assign isLarge = content.isLarge?? && content.isLarge == true]
[#assign hasBackground = content.backgroundTheme?has_content && content.backgroundTheme != "default"]
[#assign hasInnerSpace = hasBackground && !(content.space?? && (content.space?seq_contains("bottom") || content.space?seq_contains("top")))]
[#assign hasNoTopSpace = content.space?? && content.space?seq_contains("top") || hasBackground || hasInnerSpace]
[#assign hasNoBottomSpace = content.space?? && content.space?seq_contains("bottom") || hasBackground || hasInnerSpace]

<!-- Layout -->
<section class="o-section [#if hasBackground]has-background -${content.backgroundTheme!} is-full-width[/#if] [#if hasNoTopSpace]has-no-top-space[/#if] [#if hasNoBottomSpace]has-no-bottom-space[/#if] [#if hasInnerSpace]has-inner-space[/#if]">
    <div class="o-group o-flex is-multiline [#if content.sectionLayout! == "hasGutter"]has-gutter[/#if] [#if content.topBorder?has_content && content.topBorder]has-top-border[/#if] [#if isLarge]is-large[/#if] [#if hasBackground]has-inner-gutter[/#if]">
        [#if content.tilte?has_content]
            <h1>${content.title!}</h1>
        [/#if]
        [@cms.area name="content" contextAttributes={"layout":content.layout!} /]
    </div>
</section>
