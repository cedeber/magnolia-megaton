[#-------------- INCLUDE AND ASSIGN PART --------------]

[#-- Include: Global --]
[#if content.mandatory!false]
    [#assign requiredAttribute = cmsfn.createHtmlAttribute("required", "required")]
[/#if]



[#-------------- RENDERING PART --------------]

<toggle-item inline-template>
    <div ${model.style!} >
        <input ${requiredAttribute!} type="text" name="${content.controlName}" id="${content.controlName}"
                                     value="${model.value!}" maxlength="${content.maxLength!'50'}" v-model="content" @focus="toggleActive()" @blur="toggleActive()"/>

    [#if content.title?has_content]
        <label for="${content.controlName!}" :class="{active: isActive}">
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
    </div><!-- end ${model.style!} -->
</toggle-item>
