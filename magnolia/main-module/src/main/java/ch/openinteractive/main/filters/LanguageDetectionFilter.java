package ch.openinteractive.main.filters;

import ch.openinteractive.main.servlets.LocaleUtil;
import info.magnolia.cms.filters.AbstractMgnlFilter;
import info.magnolia.cms.i18n.I18nContentSupport;
import info.magnolia.context.MgnlContext;
import info.magnolia.module.site.Site;
import info.magnolia.module.site.functions.SiteFunctions;
import info.magnolia.templating.functions.TemplatingFunctions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.inject.Inject;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Collection;
import java.util.Enumeration;
import java.util.Locale;

public class LanguageDetectionFilter extends AbstractMgnlFilter {

    private static final Logger log = LoggerFactory.getLogger(LanguageDetectionFilter.class);

    private SiteFunctions sitefn;
    private TemplatingFunctions cmsfn;

    @Inject
    public LanguageDetectionFilter(SiteFunctions sitefn, TemplatingFunctions cmsfn) {
        this.sitefn = sitefn;
        this.cmsfn = cmsfn;
    }

    @Override
    public void doFilter(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws IOException, ServletException {
        try {
            String uri = request.getRequestURI();

            // TODO exclude favicon.ico.
            if (!uri.contains(".magnolia") && !uri.contains(".servlet") && !uri.contains("/404") && !uri.contains("VAADIN") && !uri.contains(".resources") && !cmsfn.isEditMode() && request.getHeader("Accept").contains("html")) {

                Collection<Locale> locales = LocaleUtil.getLocales(sitefn);

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
                            redirectURI = contextPath + "/" + language + uri.replaceFirst(contextPath, "");

                            if (!language.equals(site.getI18n().getDefaultLocale().getLanguage())) {
                                response.sendRedirect(redirectURI);
                                log.debug("Redirected user from:"+ uri +" to: "+ redirectURI);
                            }
                        }
                    }
                }
            }
        } catch (Exception ignored) {}

        filterChain.doFilter(request, response);
    }

    /**
     * Decide whether the procedure should be proceeded or not
     * @param request The current request
     * @param locales All available locales
     * @return
     */
    private boolean shouldProceed(HttpServletRequest request, Collection<Locale> locales) {
        String URI = request.getRequestURI();

        Object langAttribute = request.getSession().getAttribute("lang");
        String language = langAttribute == null ? "" : langAttribute.toString().substring(0, 2);

        for (Locale currentLocale : locales) {
            if (LocaleUtil.urlContainsLocale(URI, currentLocale) && currentLocale.getLanguage().equals(language)) {
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
            if (LocaleUtil.urlContainsLocale(URI, currentLocale)) {
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
        Locale preferredLocale = new Locale(request.getLocale().getLanguage());

        Enumeration<Locale> preferredLocales = request.getLocales();
        while (preferredLocales.hasMoreElements() && !locales.contains(preferredLocale)) {
            preferredLocale = new Locale(preferredLocales.nextElement().getLanguage());
        }

        String URI = request.getRequestURI();
        Locale currentLocale = preferredLocale;
        for (Locale locale : locales) {
            if (LocaleUtil.urlContainsLocale(URI, locale)) {
                currentLocale = locale;
            }
        }

        if (!locales.contains(preferredLocale) && currentLocale.equals(preferredLocale)) {
            Locale englishLocale = new Locale("en");

            if (locales.contains(englishLocale)) {
                currentLocale = englishLocale;
            } else {
                currentLocale = sitefn.site().getI18n().getDefaultLocale();
            }

            preferredLocale = currentLocale;
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
