<toggle-field inline-template :default-value="'${model.value!}'">
    <div ${model.style!}>
        <input type="checkbox" id="${content.controlName!}" name="${content.controlName!}" [#if content.mandatory!false] required="required"[/#if]>
        <label for="${content.controlName!}">
        ${cmsfn.decode(content).label!}
        [#if content.mandatory!false]
            <dfn title="required">${model.requiredSymbol!}</dfn>
        [/#if]
        </label>
    </div>
</toggle-field>
