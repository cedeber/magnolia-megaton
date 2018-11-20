[#assign parent = cmsfn.parent(content, "mgnl:page")!]
[#assign isLarge = content.sectionLayout?? && content.sectionLayout == "large"]
[#assign isBoundless = (content.sectionLayout?? && content.sectionLayout == "boundless") || (content.sectionLayout?? && content.sectionLayout == "fullwidth")]
[#assign hasBackground = content.backgroundTheme?has_content && content.backgroundTheme != "default"]
[#assign hasNoTopSpace = content.space?? && content.space?seq_contains("top")]
[#assign hasNoBottomSpace = content.space?? && content.space?seq_contains("bottom")]
[#assign hasMultiCells = content.cell?? && content.cell != "1of1"]
[#assign hasGutter = content.hasGutter?? && content.hasGutter == true && hasMultiCells]
[#assign noPageGutters = content.sectionLayout?? && content.sectionLayout == "fullwidth"]

<!-- Layout -->
[@compress single_line=true]
<section class="o-section
                [#if hasBackground]has-background is-full-width[/#if]
                [#if hasNoTopSpace || hasBackground]has-no-top-space[/#if]
                [#if hasNoBottomSpace || hasBackground]has-no-bottom-space[/#if]
                [#if hasBackground && !hasNoTopSpace]has-top-inner-space[/#if]
                [#if hasBackground && !hasNoBottomSpace]has-bottom-inner-space[/#if]
                [#if !hasBackground && isBoundless]is-full-width[/#if]
                [#if hasBackground]-${content.backgroundTheme!'default'}[/#if]
                [#--if hasBackground]is-${model.brightness(content.backgroundTheme)!}[/#if--]
                "
         [#if content.sectionID?has_content]id="${content.sectionID!}"[/#if]
>
[/@compress]
    <div class="o-group [#if isBoundless]is-full-width[#elseif isLarge]is-large[/#if] [#if hasBackground && !noPageGutters]has-inner-gutter[/#if]">
        [#if hasMultiCells]
        <div class="o-flex is-multiline [#if hasGutter]has-gutter[/#if]">
            [@cms.area name="content" contextAttributes={"cell": content.cell!} /]
        </div>
        [#else]
            [@cms.area name="content" /]
        [/#if]
    </div>
</section>
