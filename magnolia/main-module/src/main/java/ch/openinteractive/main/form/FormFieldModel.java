package ch.openinteractive.main.form;

import info.magnolia.jcr.util.PropertyUtil;
import info.magnolia.module.form.engine.FormField;
import info.magnolia.module.form.templates.components.AbstractFormModel;
import info.magnolia.rendering.model.RenderingModel;
import info.magnolia.rendering.model.RenderingModelImpl;
import info.magnolia.rendering.template.RenderableDefinition;
import info.magnolia.templating.functions.TemplatingFunctions;

import javax.inject.Inject;
import javax.jcr.Node;
import javax.jcr.RepositoryException;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class FormFieldModel<RD extends RenderableDefinition> extends RenderingModelImpl<RD> {
    private static final Logger log = LoggerFactory.getLogger(FormFieldModel.class);
    private Object value;
    private String cellStyling = getCellStyling();
    private String border = getBorder();
    private String style = "class=\"form-row " + cellStyling + " " + border + "\"";
    private boolean valid;
    protected final TemplatingFunctions functions;

    @Inject
    public FormFieldModel(Node content, RD definition, RenderingModel<?> parent, TemplatingFunctions functions) {
        super(content, definition, parent);
        this.functions = functions;
    }

    public String execute() {
        log.debug("Executing {}", this.getClass());
        this.validate();
        this.handleValue();
        this.handleStyle();
        return "";
    }

    private void validate() {
        FormField field = this.getFormModel().getFormField(this.getControlName());
        this.valid = field == null || field.isValid();
    }

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

    public boolean isValid() {
        return this.valid;
    }

    public Object getValue() {
        return this.value;
    }

    protected void handleValue() {
        FormField field = this.getFormModel().getFormField(this.getControlName());
        Object val = field != null ? field.getValue() : null;
        if (val == null) {
            val = PropertyUtil.getString(this.content, "default");
        }

        if (val == null) {
            val = "";
        }

        this.value = val;
    }

    public String getStyle() {
        return this.style;
    }

    public String getRightText() throws RepositoryException {
        return this.getFormModel().getRightText();
    }

    public String getRequiredSymbol() throws RepositoryException {
        return this.getFormModel().getRequiredSymbol();
    }

    private String getControlName() {
        return PropertyUtil.getString(this.content, "controlName");
    }

    private AbstractFormModel getFormModel() {
        for (RenderingModel model = this.parentModel; model != null; model = model.getParent()) {
            if (model instanceof AbstractFormModel) {
                return (AbstractFormModel) model;
            }
        }

        return null;
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

    private String getBorder() {
        try {
            boolean hasBorder = super.content.getProperty("border").getBoolean();
            return hasBorder ? "" : "no-border";
        } catch (RepositoryException e) {
            log.error("Border Property not found in form field. Form field path: " + super.content + "/r/n", e);
        }
        return "";
    }
}
