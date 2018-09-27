package ch.openinteractive.main.filters;

import info.magnolia.cms.filters.AbstractMgnlFilter;
import info.magnolia.cms.i18n.I18nContentSupport;
import info.magnolia.context.MgnlContext;
import info.magnolia.module.site.Site;
import info.magnolia.module.site.functions.SiteFunctions;
import info.magnolia.templating.functions.TemplatingFunctions;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Collection;
import java.util.Locale;

public class LanguageDetectionFilter extends AbstractMgnlFilter {

    SiteFunctions sitefn;
    TemplatingFunctions cmsfn;

    public LanguageDetectionFilter(SiteFunctions sitefn, TemplatingFunctions cmsfn) {
        this.sitefn = sitefn;
        this.cmsfn = cmsfn;
    }

    @Override
    public void doFilter(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws IOException, ServletException {
        try {
            String URI = request.getRequestURI();

            if (!URI.contains(".magnolia") && !cmsfn.isEditMode() && request.getHeader("Accept").contains("html")) {

                Collection<Locale> locales = getLocales();

                if (locales != null && locales.size() > 0) {

                    if (shouldProceed(request, locales)) {
                        boolean isCurrentlyDefaultLocale = isCurrentlyDefaultLocale(request, locales);

                        setLangAttribute(request, isCurrentlyDefaultLocale, locales);

                        Object langAttribute = request.getSession().getAttribute("lang");
                        String language = langAttribute == null ? "" : langAttribute.toString();

                        Site site = sitefn.site();

                        if (isCurrentlyDefaultLocale || language.equals(site.getI18n().getDefaultLocale().getLanguage())) {
                            String redirectURI;

                            String contextPath = MgnlContext.getContextPath();
                            redirectURI = contextPath + "/" + language + URI.replaceFirst(contextPath, "");

                            if (!language.equals(site.getI18n().getDefaultLocale().getLanguage())) {
                                response.sendRedirect(redirectURI);
                            }
                        }
                    }
                }
            }
        } catch (Exception ignored) {}

        filterChain.doFilter(request, response);
    }

    /**
     * Returns a Collection of locales. If no locales are defined it returns a Collection with 0 elements.
     * Returns null if there is no i18n Node in the Site config!
     * @return
     */
    private Collection<Locale> getLocales() {
        Collection<Locale> locales = null;
        Site site = sitefn.site();
        I18nContentSupport i18n = site.getI18n();

        if (i18n != null ) {
            locales = i18n.getLocales();
        }

        return locales;
    }

    /**
     * Decide whether the procedure should be proceeded or not
     * @param request The current request
     * @param locales All available locales
     * @return
     */
    private boolean shouldProceed(HttpServletRequest request, Collection<Locale> locales) {
        String URI = request.getRequestURI();

        if (!locales.contains(request.getLocale())) return false;

        Object langAttribute = request.getSession().getAttribute("lang");
        String language = langAttribute == null ? "" : langAttribute.toString();

        for (Locale currentLocale : locales) {
            if (URI.contains("/" + currentLocale + "/") && currentLocale.getLanguage().equals(language)) {
                return false;
            }
        }


        return true;
    }

    /**
     * Returns true if the current URI contains no locale
     * @param request The current request
     * @param locales All available locales
     * @return
     */
    private boolean isCurrentlyDefaultLocale(HttpServletRequest request, Collection<Locale> locales) {
        String URI = request.getRequestURI();
        boolean isCurrentlyDefaultLocale = true;


        for (Locale currentLocale : locales) {
            if (URI.contains("/" + currentLocale + "/")) {
                isCurrentlyDefaultLocale = false;
            }
        }

        return isCurrentlyDefaultLocale;
    }

    /**
     * Set the correct language in the session attribute
     * @param request The current request
     * @param isCurrentlyDefaultLocale Whether the current locale is the default locale
     * @param locales All available locals
     */
    private void setLangAttribute(HttpServletRequest request, boolean isCurrentlyDefaultLocale, Collection<Locale> locales) {
        Locale preferredLocale = request.getLocale();

        String URI = request.getRequestURI();
        Locale currentLocale = preferredLocale;
        for (Locale locale : locales) {
            if (URI.contains("/" + locale + "/")) {
                currentLocale = locale;
            }
        }

        Object langAttribute = request.getSession().getAttribute("lang");
        String language = langAttribute == null ? "" : langAttribute.toString();

        if (isCurrentlyDefaultLocale && ("".equals(language))) {
            request.getSession().setAttribute("lang", preferredLocale.getLanguage().substring(0, 2));
        } else if (!isCurrentlyDefaultLocale) {
            request.getSession().setAttribute("lang", currentLocale.getLanguage().substring(0, 2));
        }

    }
}
