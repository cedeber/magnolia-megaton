<toggle-field inline-template :default-value="'${model.value!}'">
    <div ${model.style!}>
        <input type="checkbox" id="${content.value!}" name="${content.value!}" [#if content.mandatory!false] required="required"[/#if]>
        <label for="${content.value!}">
        ${cmsfn.decode(content).label!}
        [#if content.mandatory!false]
            <dfn title="required">${model.requiredSymbol!}</dfn>
        [/#if]
        </label>
    </div>
</toggle-field>
