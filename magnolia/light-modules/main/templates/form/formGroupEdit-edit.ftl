[#if components[0]?has_content]
    <div class="cell-2of3">
        [@cms.component content=components[0] /]
    </div>
[/#if]
[#if components[1]?has_content]
    <div class="cell-1of3">
        [@cms.component content=components[1] /]
    </div>
[/#if]

