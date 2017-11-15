package ch.openinteractive.main.validators;


import info.magnolia.ui.form.validator.definition.RegexpValidatorDefinition;

public class MimeTypeValidatorDefinition extends RegexpValidatorDefinition {

    private String pattern;

    public MimeTypeValidatorDefinition() {
        setFactoryClass(MimeTypeValidatorFactory.class);
    }

    public String getPattern() {
        return this.pattern;
    }

    public void setPattern(String pattern) {
        this.pattern = pattern;
    }
}
