[#assign hasGutter = content.hasGutter?? && content.hasGutter == true]
[#assign hasRatio = content.width?has_content && content.height?has_content]
[#if hasRatio]
    [#assign imageRatio = 1 / (content.width?eval / content.height?eval) * 100]
[/#if]

[#if !cmsfn.isEditMode()]
<multi-carousel v-bind:transition-delay="${content.transitionDelay!'1500'}"
                v-bind:delay="${content.delay!'5000'}"
                v-bind:autoplay="${(content.autoplay!false)?c}"
                v-bind:as-hero="${(content.asHero!false)?c}"
                v-bind:start-at="${content.startAt!'0'}"
                v-bind:render-type="'${content.renderType!'linear'}'"
                v-bind:orientation="'${content.orientation!'horizontal'}'"
                [#if imageRatio??]v-bind:slide-ratio="${imageRatio?string.computer!0}"[/#if]
                [#if content.columns??]v-bind:columns="${content.columns!'0'}"[/#if]
                [#if content.minWidth??]v-bind:min-width="${content.minWidth!'0'}"[/#if]
                [#if content.maxWidth??]v-bind:max-width="${content.maxWidth!'0'}"[/#if]
                class="o-carousel [#if hasGutter]has-inner-gutter[/#if]" [#if content.asHero?? && content.asHero == true]style="height: 100vh"[/#if]>
    <template slot="slides">
        [@cms.area name="slides" /]
    </template>
</multi-carousel>
[#else]
    [@cms.area name="slides" /]
[/#if]
