package ch.openinteractive.main.validators;

import com.google.inject.Inject;
import com.vaadin.v7.data.validator.RegexpValidator;
import info.magnolia.dam.api.Asset;
import info.magnolia.dam.templating.functions.DamTemplatingFunctions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class MimeTypeValidator extends RegexpValidator {
    private DamTemplatingFunctions damfn;
    private Pattern pattern;
    private transient Matcher matcher;

    @Inject
    public MimeTypeValidator(DamTemplatingFunctions damfn, String regexp, String errorMessage) {
        super(regexp, errorMessage);
        this.damfn = damfn;
        this.pattern = Pattern.compile(regexp);
    }

    @Override
    protected boolean isValidValue(String value) {
        String mimeType = null;
        Asset asset = damfn.getAsset(value);

        if (asset != null) {
            mimeType = asset.getMimeType();
        } else if (damfn.getFolder(value) != null) {
            mimeType = "folder";
        }

        if (mimeType != null && !mimeType.isEmpty()) {
            return this.getMatcher(mimeType).find();
        } else {
            return true;
        }
    }

    private Matcher getMatcher(String value) {
        if (this.matcher == null) {
            this.matcher = this.pattern.matcher(value);
        } else {
            this.matcher.reset(value);
        }

        return this.matcher;
    }
}
