package ch.openinteractive.main.form;

import info.magnolia.jcr.util.PropertyUtil;
import info.magnolia.module.form.templates.components.FormFieldModel;
import info.magnolia.rendering.model.RenderingModel;
import info.magnolia.rendering.template.RenderableDefinition;
import info.magnolia.templating.functions.TemplatingFunctions;

import javax.inject.Inject;
import javax.jcr.Node;
import javax.jcr.RepositoryException;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class OIFormFieldModel<RD extends RenderableDefinition> extends FormFieldModel {
    private static final Logger log = LoggerFactory.getLogger(OIFormFieldModel.class);
    private String cellStyling = getCellStyling();
    private String style = "class=\"form-row " + cellStyling + "\"";
    protected final TemplatingFunctions functions;

    @Inject
    public OIFormFieldModel(Node content, RD definition, RenderingModel<?> parent, TemplatingFunctions functions) {
        super(content, definition, parent, functions);
        this.functions = functions;
    }

    @Override
    public String execute() {
        log.debug("Executing {}", this.getClass());
        super.execute();
        this.handleStyle();
        return "";
    }

    @Override
    protected void handleStyle() {
        String cssClass = "";
        if (!this.isValid()) {
            cssClass = "form-row error " + cellStyling;
        }

        try {
            if (this.content.hasProperty("editLength")) {
                String style2 = PropertyUtil.getString(this.content, "editLength");
                if (!StringUtils.isEmpty(style2)) {
                    if (!StringUtils.isEmpty(cssClass)) {
                        cssClass = cssClass + " " + style2;
                    } else {
                        cssClass = style2;
                    }
                }
            }
        } catch (RepositoryException var3) {
            log.debug("failed to get edit control style", var3);
        }

        if (StringUtils.isNotBlank(cssClass)) {
            this.style = "class=\"" + cssClass + "\"";
        }

    }

    @Override
    public String getStyle() {
        return this.style;
    }

    private String getCellStyling() {
        try {
            Object cellObject = super.content.getProperty("cell").getString();
            return cellObject != null ? "cell-" + cellObject.toString() : "";
        } catch (RepositoryException e) {
            log.error("Cell Property not found in form field. Form field path: " + super.content + "/r/n", e);
        }
        return "";
    }
}
