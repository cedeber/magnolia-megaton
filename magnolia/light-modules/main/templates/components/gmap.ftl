<!-- Gmap -->
<section class="o-section o-map has-no-top-space has-no-gutter">
    <div class="o-group has-inner-gutter">
        [#if content.title?has_content]
            <hr/>
            <h2>${content.title!}</h2>
        [/#if]
        <div class="content o-editorial">
        </div>
        <br>
        [#if content.markerIcon?has_content]
            [#assign markerAsset = damfn.getAsset(content.markerIcon)!]
            [#if markerAsset?has_content]
            [#assign markerAssetMap = damfn.getAssetMap(markerAsset)!]
                [#if markerAssetMap.metadata.mgnl.width?has_content && markerAssetMap.metadata.mgnl.height?has_content]
                    [#assign markerWidth = (markerAssetMap.metadata.mgnl.width / 2)?round]
                    [#assign markerHeight = (markerAssetMap.metadata.mgnl.height / 2)]
                [/#if]
            [/#if]
        [/#if]
        <g-map  :lat="${content.lat!}"
                :long="${content.long!}"
                :api-key="'${content.apiKey!}'"
                [#if content.zoom?has_content]
                    :zoom="${content.zoom!}"
                [/#if]
                [#if content.infoWindow?has_content]
                    :info-window-content="'${content.infoWindow!}'"
                [/#if]
                [#if markerAssetMap?has_content]
                    :marker-icon="'${damfn.getAssetLink(content.markerIcon)!}'"
                    :marker-width="${markerWidth}"
                    :marker-height="${markerHeight}"
                [/#if]
                inline-template="true">
            <div id="map" class="map" style="background-color: #5c5c5c; text-align: center;"></div>
        </g-map>
    </div>
</section>
