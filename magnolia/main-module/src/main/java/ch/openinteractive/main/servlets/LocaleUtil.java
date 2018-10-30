package ch.openinteractive.main.servlets;

import info.magnolia.cms.i18n.I18nContentSupport;
import info.magnolia.context.MgnlContext;
import info.magnolia.module.site.Site;
import info.magnolia.module.site.functions.SiteFunctions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Collection;
import java.util.Locale;

import static org.apache.commons.lang.StringUtils.split;

/**
 * Static utility methods for locales (languages).<br>
 */

public final class LocaleUtil {


    /**
     * Find locale in path
     */
    public static String determineLanguage(String handle, Collection<String> configuredLocales) {
        String localeString = null;
        String[] pathElements = split(handle, '/');

        for (String pathPart : pathElements) {
            if (configuredLocales.contains(pathPart)) {
                localeString = pathPart;
                break;
            }
        }
        return localeString;
    }

    /**
     * Returns a Collection of locales. If no locales are defined it returns a Collection with 0 elements.
     * Returns null if there is no i18n Node in the Site config!
     * @return
     */
    public static Collection<Locale> getLocales(SiteFunctions sitefn) {
        Collection<Locale> locales = null;
        Site site = sitefn.site();
        I18nContentSupport i18n = site.getI18n();

        if (i18n != null ) {
            locales = i18n.getLocales();
        }

        return locales;
    }


    public static boolean urlContainsLocale(String uri, Locale locale) {
        return uri.startsWith(MgnlContext.getContextPath() + "/" + locale + "/");
    }

}
