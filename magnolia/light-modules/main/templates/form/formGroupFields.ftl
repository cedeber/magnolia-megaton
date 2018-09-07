

[#if model.requiredSymbol?has_content && model.rightText?has_content]
    <p class="required"><span>${model.requiredSymbol}</span> ${model.rightText}</p>
[/#if]

<fieldset>
    <div class="fieldset-inner-wrapper [#if !cmsfn.editMode]o-flex is-multiline has-gutter[/#if]">
        [#assign title = content.title!cmsfn.editMode?string("Empty Field Set", "")]
        [#if title?has_content]
            <legend class="form__fieldset-title">${title}</legend>
        [/#if]

        [@cms.area name="fields"/]
    </div>
</fieldset>
