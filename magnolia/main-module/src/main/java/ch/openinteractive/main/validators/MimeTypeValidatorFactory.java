package ch.openinteractive.main.validators;


import com.google.inject.Inject;
import com.vaadin.data.Validator;
import info.magnolia.dam.templating.functions.DamTemplatingFunctions;
import info.magnolia.ui.form.validator.factory.AbstractFieldValidatorFactory;

public class MimeTypeValidatorFactory extends AbstractFieldValidatorFactory<MimeTypeValidatorDefinition> {

    private DamTemplatingFunctions damfn;

    @Inject
    public MimeTypeValidatorFactory(MimeTypeValidatorDefinition definition, DamTemplatingFunctions damfn) {
        super(definition);
        this.damfn = damfn;
    }

    @Override
    public Validator createValidator() {
        return new MimeTypeValidator(damfn, ((MimeTypeValidatorDefinition)this.definition).getPattern(), this.getI18nErrorMessage());
    }
}
