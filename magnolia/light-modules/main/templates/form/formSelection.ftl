[#-------------- INCLUDE AND ASSIGN PART --------------]

[#-- Include: Global --]
[#if content.mandatory!false]
    [#assign requiredAttribute = cmsfn.createHtmlAttribute("required", "required")]
[/#if]



[#-------------- RENDERING PART --------------]

<toggle-item inline-template :default-value="'${model.value!}'">
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
            <div id="checkbox-error" class="text error" style="display:none">
                <ul>
                    <li>${i18n['form.user.errorMessage.checkboxes']}</li>
                </ul>
            </div>
            [#if requiredAttribute?has_content && content.type="checkbox" && content.controlName?has_content && formItems?size > 1]
                <script type="text/javascript">
                    var checkboxes = document.getElementsByName("${content.controlName}");
                    var element = checkboxes[0].form;
                    var valid = false;
                    element.onsubmit = function () {
                        for (var i = 0; i < checkboxes.length; i++) {
                            if (checkboxes[i].checked) {
                                valid = true;
                                break;
                            }
                        }
                        if (valid) {
                            document.getElementById("checkbox-error").style.display = "none";
                        } else {
                            document.getElementById("checkbox-error").style.display = "block";
                        }
                        return valid;
                    }
                </script>
            [/#if]
        [#else]
        <v-selection inline-template :select-id="'${(content.controlName!'')}'">
            <div class="selection-wrapper">
                <div class="selection-input" v-on:click="focusSelect()">
                    <select class="hidden" ${requiredAttribute!} id="${(content.controlName!'')}"
                            name="${(content.controlName!'')}" ${content.multiple?string("multiple=\"multiple\"", "")}
                            @focus="toggleActive()" @blur="unfocusSelect()" @change="changeSelect()" v-model="selected">
                    [#if content.labels?has_content]
                    [#list cmsfn.decode(content).labels?split("(\r\n|\r|\n|\x0085|\x2028|\x2029)", "rm") as label]
                        [#assign data=label?split(":")]
                        <option value="${(data[1]!data[0])!?html}">${data[0]!?html}</option>
                    [/#list]
                    [/#if]
                    </select>
                    <div class="selection-selected" v-on:click="focusSelect()">
                        <span>{{ this.content }}</span>
                    </div>
                    <svg class="arrow" :class="{active: isOpen}" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                        viewBox="0 0 25.4 13.2" style="enable-background:new 0 0 25.4 13.2;" xml:space="preserve">
                        <path style="fill:#333333;" d="M12.7,13.2c-0.1,0-0.3,0-0.3-0.1L0.2,0.9C0,0.7,0,0.4,0.2,0.2c0,0,0,0,0,0c0.2-0.2,0.5-0.2,0.7,0
                        c0,0,0,0,0,0L12.7,12L24.5,0.2C24.7,0,25,0,25.2,0.2c0,0,0,0,0,0c0.2,0.2,0.2,0.5,0,0.7c0,0,0,0,0,0L13.1,13.1
                        C13,13.2,12.8,13.2,12.7,13.2z"></path>
                    </svg>

                    [#if content.title?has_content]
                        <label for="${content.controlName!''}" :class="{active: isActive}">
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

                <div class="selection-list" :class="{active: isOpen}">
                    <ul>
                    [#if content.labels?has_content]
                        [#list cmsfn.decode(content).labels?split("(\r\n|\r|\n|\x0085|\x2028|\x2029)", "rm") as label]
                            [#assign data=label?split(":")]
                            <li v-on:click="setSelected('${(data[1]!data[0])!?html}')">${data[0]!?html}</li>
                        [/#list]
                    [/#if]
                    </ul>
                </div>
            </div>
        </v-selection>
        [/#if]
        </fieldset>

    </div><!-- end ${model.style!} -->
</toggle-item>
