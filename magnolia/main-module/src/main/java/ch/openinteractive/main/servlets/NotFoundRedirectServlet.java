package ch.openinteractive.main.servlets;

import ch.openinteractive.main.StarterKit;
import info.magnolia.cms.util.RequestDispatchUtil;
import info.magnolia.context.MgnlContext;
import info.magnolia.module.site.functions.SiteFunctions;
import info.magnolia.templating.functions.TemplatingFunctions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.inject.Inject;
import javax.jcr.Node;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Locale;


public class NotFoundRedirectServlet extends HttpServlet {

    private static final long serialVersionUID = 5184656016934475004L;
    private SiteFunctions sitefn;
    private TemplatingFunctions cmsfn;
    private StarterKit mainModule;
    private static final Logger log = LoggerFactory.getLogger(NotFoundRedirectServlet.class);

    @Inject
    public NotFoundRedirectServlet(TemplatingFunctions cmsfn, SiteFunctions sitefn, StarterKit mainModule) {
        this.sitefn = sitefn;
        this.cmsfn = cmsfn;
        this.mainModule = mainModule;
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setStatus(HttpServletResponse.SC_NOT_FOUND);

        String handle = mainModule.getNotFoundPagePath();
        if(handle == null || handle.isEmpty()) {
            PrintWriter writer = response.getWriter();
            writer.write("404 page is not configuered.<br> Please add the path to the 404 page to the module config (/modules/main-module/config@notFoundPagePath)");
            return;
        }

        Node notFoundPage = null;
        try {
            notFoundPage = cmsfn.nodeByPath(handle);
        } catch (Exception e) {
            //404 page not found
            log.warn("404 page not found");
        }


        if(notFoundPage != null) {
            // using original uri from aggregation state
            String originalUri = MgnlContext.getAggregationState().getOriginalURI();

            for (Locale currentLocale : LocaleUtil.getLocales(sitefn)) {
                if (originalUri.startsWith("/" + currentLocale + "/")) {
                    handle = "/"+currentLocale+handle;
                }
            }

            RequestDispatchUtil.dispatch(RequestDispatchUtil.FORWARD_PREFIX + handle, request, response);
        } else {
            PrintWriter writer = response.getWriter();
            writer.write("404 page does not exist. Should be here: "+handle);
        }

    }


}
