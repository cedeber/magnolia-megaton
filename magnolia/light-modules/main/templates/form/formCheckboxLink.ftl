<toggle-field inline-template :default-value="'${model.value!}'">
    <div ${model.style!}>
        <input type="checkbox" id="${content.value!}" name="${content.value!}"
               required="${content.mandatory!?c}">
        <label for="${content.value!}">
        ${cmsfn.decode(content).label!}
        [#if content.mandatory!false]
            <dfn title="required">${model.requiredSymbol!}</dfn>
        [/#if]
        </label>
    </div>
</toggle-field>
