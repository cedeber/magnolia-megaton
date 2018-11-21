[#assign hasRatio = content.width?has_content && content.height?has_content]
[#if hasRatio]
    [#assign imageRatio = 1 / (content.width?eval / content.height?eval) * 100]
[/#if]

[#if !cmsfn.isEditMode()]
<single-carousel v-bind:delay="${content.delay!'5000'}"
                 v-bind:autoplay="${(content.autoplay!false)?c}"
                 v-bind:as-hero="${(content.asHero!false)?c}"
                 v-bind:render-type="'${content.renderType!'linear'}'"
                 v-bind:orientation="'${content.orientation!'horizontal'}'"
                 [#if imageRatio??]v-bind:slide-ratio="${imageRatio?string.computer!0}"[/#if]
                 class="o-carousel o-component" [#if content.asHero?? && content.asHero == true]style="height: 100vh"[/#if]>
    <template slot="slides">
        [@cms.area name="slides" /]
    </template>
</single-carousel>
[#else]
    [@cms.area name="slides" /]
[/#if]
