<fieldset>
    <div class="[#if !cmsfn.editMode]o-flex is-multiline has-bigmac-gutter[/#if] form__fieldset-main">
        [#assign title = content.title!cmsfn.editMode?string("Empty Field Set", "")]
        [#if title?has_content]
            <legend class="form__fieldset-title h2">${title}</legend>
        [/#if]

        [@cms.area name="fields"/]
    </div>
</fieldset>
[#if model.requiredSymbol?has_content && model.rightText?has_content]
    <p class="form__required-notice"><span>${model.requiredSymbol}</span> ${model.rightText}</p>
[/#if]
