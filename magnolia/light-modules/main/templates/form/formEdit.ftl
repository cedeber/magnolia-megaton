<toggle-field inline-template :default-value="'${model.value!}'">
    <div ${model.style!}>
    [#assign attributes]name="${content.controlName}" id="${content.controlName}"
        [#if content.maxlength?has_content] maxlength="${content.maxlength}"[/#if]
        [#if content.placeholder?has_content] placeholder="${content.placeholder}"[/#if]
        [#if content.min?has_content] min="${content.min}"[/#if]
        [#if content.max?has_content] max="${content.max}"[/#if]
        [#if content.step?has_content] step="${content.step}"[/#if]
        [#if content.patternDescription?has_content] title="${content.patternDescription!}"[/#if]
        [#if content.readonly!false] readonly[/#if]
        [#if content.disabled!false] disabled[/#if]
        [#if content.mandatory!false] required[/#if]
        [#if content.autofocus!false] autofocus[/#if]
        autocomplete=[#if content.autocomplete!false]"on"[#else]"off"[/#if]
    [/#assign]

    [#if content.rows?has_content && content.rows > 1]
        <textarea ${attributes} [#if content.rows?has_content]rows="${content.rows}"[/#if] v-model="content"
                                v-on:focus="toggleActive" v-on:blur="toggleActive">${model.value!}</textarea>
    [#else]
        <input ${attributes} type="${content.inputType!"text"}" value="${model.value!}" v-model="content"
                             v-on:focus="toggleActive" v-on:blur="toggleActive">
    [/#if]

    [#if content.title?has_content]
        <label for="${content.controlName}" :class="{ active: isActive }">
            <span>
                [#if !model.isValid()]
                    <em>${i18n['form.error.field']}</em>
                [/#if]
                ${content.title}
                [#if content.mandatory!false]
                    <dfn title="required">${model.requiredSymbol!}</dfn>
                [/#if]
            </span>
        </label>
    [/#if]

    [#if content.description?has_content]
        <span>${content.description}</span>
    [/#if]
    </div>
</toggle-field>
