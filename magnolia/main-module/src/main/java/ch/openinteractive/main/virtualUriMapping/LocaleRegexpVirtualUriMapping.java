package ch.openinteractive.main.virtualUriMapping;

import info.magnolia.context.MgnlContext;
import info.magnolia.virtualuri.mapping.RegexpVirtualUriMapping;
import org.apache.commons.lang3.StringUtils;

import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;


/**
 * Solution based on Matteo Pelucco's code (http://maips21.altervista.org/wordpress/2015/05/05/how-to-build-a-locale-aware-virtualurimapping-in-magnolia-with-regexp/)
 *
 * Allows to define a toUri for every locale
 *
 * Example:
 *
 * class: ch.openinteractive.main.virtualUriMapping.LocaleRegexpVirtualUriMapping
 * fromUri: /scia
 * toUri: redirect:/programme/smart-city/scia
 * localizedToURI:
 *   de: redirect:/programme/smart-city/scia
 *   fr: redirect:/fr/programme/smart-city/scia
 *   it: redirect:/it/programme/smart-city/scia
 */

public class LocaleRegexpVirtualUriMapping extends RegexpVirtualUriMapping {

    private Map<String , String> localizedToURI = new LinkedHashMap();

    @Override
    public String getToUri() {

        String language = "";
        Locale locale = MgnlContext.getAggregationState().getLocale();
        if (locale != null) {
            language = locale.getLanguage();
        }

        return StringUtils.defaultIfEmpty(localizedToURI.get(language), super.getToUri());
    }


    /** node2bean **/
    public Map<String , String> getLocalizedToURI() {
        return localizedToURI;
    }

    public void setLocalizedToURI(Map<String , String> localizedToURI) {
        this.localizedToURI = localizedToURI;
    }

    public void addLocalizedToURI(String key, String value) {
        this.localizedToURI.put(key, value);
    }

}
