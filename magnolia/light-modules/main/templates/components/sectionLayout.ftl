[#assign parent = cmsfn.parent(content, "mgnl:page")!]
[#assign isLarge = content.sectionLayout?? && content.sectionLayout == "large"]
[#assign isFullWidth = content.sectionLayout?? && content.sectionLayout == "wide"]
[#assign hasBackground = content.backgroundTheme?has_content && content.backgroundTheme != "default"]
[#assign hasInnerSpace = hasBackground && !(content.space?? && (content.space?seq_contains("bottom") || content.space?seq_contains("top")))]
[#assign hasNoTopSpace = content.space?? && content.space?seq_contains("top") || hasBackground || hasInnerSpace]
[#assign hasNoBottomSpace = content.space?? && content.space?seq_contains("bottom") || hasBackground || hasInnerSpace]
[#assign hasMultiCells = content.cell?? && content.cell != "1of1"]
[#assign hasGutter = content.hasGutter?? && content.hasGutter == true && hasMultiCells]

<!-- Layout -->
<section class="o-section [#if hasBackground]has-background -${content.backgroundTheme!} is-full-width[/#if] [#if hasNoTopSpace]has-no-top-space[/#if] [#if hasNoBottomSpace]has-no-bottom-space[/#if] [#if hasInnerSpace]has-inner-space[/#if] [#if !hasBackground && isFullWidth]is-full-width[/#if]">
    <div class="o-group [#if isFullWidth]is-full-width[#elseif isLarge]is-large[/#if] [#if hasBackground]has-inner-gutter[/#if]">
        [#if hasMultiCells]
        <div class="o-flex is-multiline [#if hasGutter]has-gutter[/#if]">
            [@cms.area name="content" contextAttributes={"cell": content.cell!} /]
        </div>
        [#else]
            [@cms.area name="content" /]
        [/#if]
    </div>
</section>
