package ch.openinteractive.main.language;

import info.magnolia.cms.beans.config.VirtualURIMapping;
import info.magnolia.context.MgnlContext;
import info.magnolia.module.site.Site;
import info.magnolia.module.site.functions.SiteFunctions;
import info.magnolia.templating.functions.TemplatingFunctions;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import java.util.Collection;
import java.util.List;
import java.util.Locale;

public class BrowserLocaleHandler implements VirtualURIMapping {

    private SiteFunctions sitefn;
    private TemplatingFunctions cmsfn;
    private final Logger log = LoggerFactory.getLogger(getClass());

    public BrowserLocaleHandler(SiteFunctions sitefn, TemplatingFunctions cmsfn) {
        this.sitefn = sitefn;
        this.cmsfn = cmsfn;
    }

    public MappingResult mapURI(final String uri) {
        if (cmsfn.isEditMode()) {
            return null;
        }

        boolean isWebsiteUri;
        try {
            isWebsiteUri = isFromWebsiteRepository(uri);
        } catch (NullPointerException e) {
            return null;
        }

        if (!(isWebsiteUri || uri.equals("/"))) {
            return null;
        }

        Locale preferredLocale = MgnlContext.getWebContext().getRequest().getLocale();
        Site site = sitefn.site();

        if (site.getI18n() == null) {
            return null;
        }

        // Shorten the language. Example: en_GB --> en
        String preferredLanguage = preferredLocale.toLanguageTag().substring(0, 2);
        String defaultLocale = site.getI18n().getDefaultLocale().toLanguageTag();
        String originalBrowserURI = StringUtils.defaultIfEmpty(MgnlContext.getAggregationState().getOriginalBrowserURI(), "");

        if (originalBrowserURI.equals("/") && (defaultLocale.equals(preferredLanguage) && defaultLocale.equals(preferredLocale.toLanguageTag()))) {
            return null;
        }

        boolean uriContainsLocale = false;
        boolean isValidLanguage = false;
        Collection availableLocales = site.getI18n().getLocales();

        for (Object availableLocale : availableLocales) {
            Locale locale = (Locale) availableLocale;

            if (originalBrowserURI.contains("/" + locale.toLanguageTag() + "/")) {
                uriContainsLocale = true;
                break;
            }

            if (locale.toLanguageTag().contains(preferredLanguage)) {
                isValidLanguage = true;
            }
        }

        if (!uriContainsLocale && preferredLanguage.equals(defaultLocale)) {
            return null;
        }

        if (uriContainsLocale && !(originalBrowserURI.contains("/" + defaultLocale + "/") && defaultLocale.equals(preferredLanguage))) {
            return null;
        }

        if (!isValidLanguage) {
            preferredLanguage = defaultLocale;
        }

        if (originalBrowserURI.contains("/" + preferredLanguage) && !preferredLanguage.equals(defaultLocale)) {
            return null;
        }

        String toURI;
        if (preferredLanguage.equals(defaultLocale) && originalBrowserURI.contains("/" + defaultLocale)) {
            toURI = "redirect:" + uri;
        } else {
            toURI = "redirect:/" + preferredLanguage + uri;
        }

        MappingResult mappingResult = new MappingResult();
        mappingResult.setLevel(255); // Probably not the best solution
        mappingResult.setToURI(toURI);
        return mappingResult;
    }

    /**
     * Calls isFromWebsiteRepository(Node rootNode, String uri)
     * @param uri
     * @return
     */
    private boolean isFromWebsiteRepository(String uri) {
        return isFromWebsiteRepository(cmsfn.nodeByPath("/", "website"), uri);
    }

    /**
     * This method checks if the given uri links to the website repository
     * @param rootNode
     * @param uri
     * @return
     */
    private boolean isFromWebsiteRepository(Node rootNode, String uri) {
        try {
            List<Node> nodes = cmsfn.children(rootNode, "mgnl:page");

            for (Node node : nodes) {
                if (node.hasNodes() && isFromWebsiteRepository(node, uri)) {
                    return true;
                }

                if (uri.contains(cmsfn.link(node)) || cmsfn.link(node).contains(uri)) {
                    return true;
                }
            }
        } catch (RepositoryException e) {
            log.error("An error occurred while checking if the uri is part of the website workspace", e);
        }
        return false;
    }

}
