package ch.openinteractive.main.templating;

import info.magnolia.cms.beans.config.ServerConfiguration;

import javax.inject.Inject;

public class OITemplatingFunctions {

    public static final String oiFunctionsName = "oifn";
    private ServerConfiguration config;

    @Inject
    public OITemplatingFunctions(ServerConfiguration config) {
        this.config = config;
    }

    public String getDefaultBaseUrl() {
        String url = config.getDefaultBaseUrl();
        return url.endsWith("/") ? url.substring(0, url.length() - 1) : url;
    }
}
