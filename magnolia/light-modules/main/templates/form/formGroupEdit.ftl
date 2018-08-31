

[#assign divID = cmsfn.createHtmlAttribute("class", "form-row cell-" + content.cell!)]

<div ${divID!} >
    [@cms.area name="edits" /]
</div>
