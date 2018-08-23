

[#if model.requiredSymbol?has_content && model.rightText?has_content]
    <p class="required"><span>${model.requiredSymbol}</span> ${model.rightText}</p>
[/#if]

<fieldset>
    <div class="fieldset-inner-wrapper [#if !cmsfn.editMode]o-flex is-multiline has-gutter[/#if]">
        [#assign title = content.title!cmsfn.editMode?string("Empty Field Set", "")]
        [#if title?has_content]
            <h2 class="[#if content.cell?has_content]cell-${content.cell}[/#if]">${title}</h2>
        [/#if]

        [@cms.area name="fields"/]
    </div>
</fieldset>
