[#if content.mandatory!false]
    [#assign requiredAttribute = cmsfn.createHtmlAttribute("required", "required")]
[/#if]
<toggle-field inline-template :default-value="'${model.value!}'">
    <div ${model.style!}>
        <fieldset ${content.horizontal?string("class=\"mod\"", "")} >
        [#if content.legend?has_content]
            <legend>${content.legend}</legend>
        [/#if]

        [#if content.type?index_of("select") < 0 && content.labels?has_content]
            [#assign formItems=cmsfn.decode(content).labels?split("(\r\n|\r|\n|\x0085|\x2028|\x2029)", "rm")]
            [#if formItems?size > 1 && content.type = "checkbox"]
                [#assign renderedRequiredValue = ""]
            [#else]
                [#assign renderedRequiredValue = requiredAttribute!]
            [/#if]
            [#list formItems as label]
                [#assign checked=""]
                [#assign data=label?split(":")]

                [#if model.value == data[1]!data[0] ]
                    [#assign checked="checked=\"checked\""]
                [/#if]
                <div class="form-item">
                    <input ${renderedRequiredValue!} type="${content.type}"
                                                     id="${(content.controlName!'')}_${label_index}"
                                                     name="${(content.controlName!'')}"
                                                     value="${(data[1]!data[0])!?html}" ${checked!}/>
                    [#if content.type == "checkbox"]
                        <label for="${(content.controlName!'')}_${label_index}">${data[0]}</label>
                    [#else]
                        <label for="${(content.controlName!'')}_${label_index}">${data[0]!?html}</label>
                    [/#if]
                </div><!-- end form-item -->
            [/#list]
            [#if requiredAttribute?has_content && content.type="checkbox" && content.controlName?has_content && formItems?size > 1]
            <div class="form__checkbox-info">
                ${i18n['form.user.errorMessage.checkboxes']}
                <dfn title="required">${model.requiredSymbol!}</dfn>
            </div>
            [/#if]
        [#else]
        <form-select inline-template :select-id="'${(content.controlName!'')}'">
            <div class="form-select__wrapper" :class="{'is-open': isOpen, 'is-active': isActive, 'is-filled': isFilled}">
                <div class="form-select__input" v-on:click="toggleList">
                    <select class="is-visually-hidden" ${requiredAttribute!} id="${(content.controlName!'')}"
                            name="${(content.controlName!'')}" ${content.multiple?string("multiple=\"multiple\"", "")}
                            v-model="selected" v-on:focus="setActive(true)" v-on:blur="setActive(false)">
                        [#if content.labels?has_content]
                        [#list cmsfn.decode(content).labels?split("(\r\n|\r|\n|\x0085|\x2028|\x2029)", "rm") as label]
                            [#assign data=label?split(":")]
                            <option value="${(data[1]!data[0])!?html}">${data[0]!?html}</option>
                        [/#list]
                        [/#if]
                    </select>

                    <div class="form-select__input-text">
                        {{ this.content }}
                    </div>
                    <svg class="form-select__arrow" width="24" height="24" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                        <path fill="currentColor" d="M1395 736q0 13-10 23l-466 466q-10 10-23 10t-23-10l-466-466q-10-10-10-23t10-23l50-50q10-10 23-10t23 10l393 393 393-393q10-10 23-10t23 10l50 50q10 10 10 23z"></path>
                    </svg>
                    <ul class="form-select__options">
                    [#if content.labels?has_content]
                        [#list cmsfn.decode(content).labels?split("(\r\n|\r|\n|\x0085|\x2028|\x2029)", "rm") as label]
                            [#assign data=label?split(":")]
                            <li class="form-select__option" v-on:click="setSelected('${(data[1]!data[0])!?html}', '${data[0]!?html}')" :class="{'is-selected': content === '${data[0]!?html}'}">
                                <span>${data[0]!?html}</span>
                            </li>
                        [/#list]
                    [/#if]
                    </ul>
                </div>

                [#if content.title?has_content]
                    <label for="${content.controlName!''}" :class="{active: isActive || isFilled}">
                        <span>
                        [#if !model.isValid()]
                            <em>${i18n['form.error.field']}</em>
                        [/#if]
                            ${content.title!}
                        [#if content.mandatory!false]
                            <dfn title="required">${model.requiredSymbol!}</dfn>
                        [/#if]
                        </span>
                    </label>
                [/#if]
            </div>
        </form-select>
        [/#if]
        </fieldset>
    </div>
</toggle-field>
