[#-------------- INCLUDE AND ASSIGN PART --------------]

[#-- Include: Global --]
[#if content.mandatory!false]
    [#assign requiredAttribute = cmsfn.createHtmlAttribute("required", "required")]
[/#if]



[#-------------- RENDERING PART --------------]

<toggle-item inline-template>
    <div ${model.style!}>
        <fieldset ${content.horizontal?string("class=\"mod\"", "")} >
        [#if content.legend?has_content]
            <legend>${content.legend}</legend>
        [/#if]

        [#if content.labels?has_content]
            [#assign formItems=cmsfn.decode(content).labels?split("(\r\n|\r|\n|\x0085|\x2028|\x2029)", "rm")]
            [#if formItems?size > 1]
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
                    <input ${renderedRequiredValue!} type="checkbox"
                                                     id="${(content.controlName!'')}_${label_index}"
                                                     name="${(content.controlName!'')}"
                                                     value="${(data[1]!data[0])!?html}" ${checked!}/>

                    <label for="${(content.controlName!'')}_${label_index}">${data[0]}</label>
                </div><!-- end form-item -->
            [/#list]
            <div id="checkbox-error" class="text error" style="display:none">
                <ul>
                    <li>${i18n['form.user.errorMessage.checkboxes']}</li>
                </ul>
            </div>
            [#if requiredAttribute?has_content && content.controlName?has_content && formItems?size > 1]
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
        [/#if]
        </fieldset>

    </div><!-- end ${model.style!} -->
</toggle-item>
