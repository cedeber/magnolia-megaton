[#assign hasLayout = ctx.layout?has_content && ctx.layout == true]
[#assign index = 0]

[#list components as component]

    [#if hasLayout == true && ctx.cell?has_content]
        [#assign cellOverride = ctx.cell]
        [#if component.layoutOverride?has_content]
            [#if component.layoutOverride == "full"]
                [#assign cellOverride = "1of1"]
            [#elseif component.layoutOverride == "wider"]
                [#if ctx.cell == "1of3"]
                    [#assign cellOverride = "2of3"]
                [#elseif ctx.cell == "1of4"]
                    [#assign cellOverride = "3of4"]
                [/#if]
            [/#if]
        [/#if]
        <div class="[#if cellOverride?has_content]cell-${cellOverride!}[/#if] cell-1of1-sm">
    [/#if]

        [@cms.component content=component contextAttributes={"maxIndex": components?size - 1, "orderIndex": index, "cell": ctx.cell!, "parentOrderIndex": ctx.orderIndex!} /]
        [#assign index = index + 1 /]

    [#if hasLayout == true && ctx.cell?has_content]
        </div>
    [/#if]

[/#list]
