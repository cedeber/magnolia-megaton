<!-- Google Map -->
[#if content.markerIcon?has_content]
    [#assign markerAsset = damfn.getAsset(content.markerIcon)!]
    [#if markerAsset?has_content]
        [#assign markerAssetMap = damfn.getAssetMap(markerAsset)!]
        [#if markerAssetMap?? && markerAssetMap.metadata.mgnl.width?has_content && markerAssetMap.metadata.mgnl.height?has_content]
            [#assign markerWidth = (markerAssetMap.metadata.mgnl.width / 2)?round?string.computer]
            [#assign markerHeight = (markerAssetMap.metadata.mgnl.height / 2)?round?string.computer]
        [/#if]
    [/#if]
[/#if]

<google-map :lat="${content.lat!}"
            :long="${content.long!}"
            :api-key="'${content.apiKey!}'"
            [#if content.zoom?has_content]
                :zoom="${content.zoom!}"
            [/#if]
            [#if markerAssetMap?has_content]
                :marker-icon="'${damfn.getAssetLink(content.markerIcon)!}'"
                :marker-width="${markerWidth}"
                :marker-height="${markerHeight}"
            [/#if]
            [#if content.styles?has_content]
                :personalized="true"
                styles-path="${cmsfn.link(content)?replace('.html', '.json')}"
            [/#if]
            class="o-component">
    <p hidden>
    [#if content.info?has_content]
        ${cmsfn.decode(content).info!}
    [/#if]
    </p>
</google-map>

[#if cmsfn.isEditMode()]
    <div style="width: 100%; height: 200px; background-color: lightgrey" class="o-google-map o-component">
        Google map only visible in Preview mode.
    </div>
[/#if]
