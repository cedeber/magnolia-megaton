package ch.openinteractive.main.templating;

import info.magnolia.cms.beans.config.ServerConfiguration;
import info.magnolia.cms.i18n.I18nContentSupport;
import info.magnolia.context.MgnlContext;
import info.magnolia.context.WebContext;
import info.magnolia.templating.functions.TemplatingFunctions;

import javax.inject.Inject;
import javax.inject.Provider;
import javax.jcr.Node;
import javax.jcr.RepositoryException;
import java.util.Locale;
import java.util.Map;

public class OITemplatingFunctions {

    public static final String oiFunctionsName = "oifn";
    private ServerConfiguration config;
    private final Provider<WebContext> webContextProvider;
    private Provider<I18nContentSupport> i18nContentSupport;
    private TemplatingFunctions cmsfn;

    @Inject
    public OITemplatingFunctions(ServerConfiguration config, Provider<I18nContentSupport> i18nContentSupport, Provider<WebContext> webContextProvider, TemplatingFunctions cmsfn) {
        this.config = config;
        this.webContextProvider = webContextProvider;
        this.i18nContentSupport = i18nContentSupport;
        this.cmsfn = cmsfn;
    }

    public String getDefaultBaseUrl() {
        String url = config.getDefaultBaseUrl();
        return url.endsWith("/") ? url.substring(0, url.length() - 1) : url;
    }

    /**
     * See getLocalizedLinks(Node currentContentNode)
     * @return
     * @throws RepositoryException
     */
    public Map<String, String> getLocalizedLinks() throws RepositoryException {
        return getLocalizedLinks(webContextProvider.get().getAggregationState().getCurrentContentNode());
    }

    /**
     * Return the localized links from the cmsfn.localizedLinks method
     * and adds the default locale to the default link
     * e.g. "/home" becomes "/de/home"
     * @return
     * @throws RepositoryException
     */
    public Map<String, String> getLocalizedLinks(Node currentContentNode) throws RepositoryException {
        Locale defaultLocale = i18nContentSupport.get().getDefaultLocale();

        Map<String, String> links = cmsfn.localizedLinks(currentContentNode);

        for (String key : links.keySet()) {
            if (key.equals(defaultLocale.getLanguage())) {
                String link = links.get(key);
                String contextPath = MgnlContext.getContextPath();
                link = contextPath + "/" + defaultLocale.getLanguage() + link.replaceFirst(contextPath, "");

                links.put(key, link);
            }
        }

        return links;
    }
}
