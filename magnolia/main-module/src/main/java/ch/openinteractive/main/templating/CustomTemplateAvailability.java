package ch.openinteractive.main.templating;

import info.magnolia.module.site.templates.ConfiguredSiteTemplateAvailability;
import info.magnolia.rendering.template.TemplateAvailability;
import info.magnolia.rendering.template.TemplateDefinition;
import info.magnolia.repository.RepositoryConstants;
import info.magnolia.templating.functions.TemplatingFunctions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.inject.Inject;
import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Workspace;

/**
 * This class is added in the site definition under templates->availability and
 * controls the template availability depending on the type of the page.
 */
public class CustomTemplateAvailability extends ConfiguredSiteTemplateAvailability implements TemplateAvailability {

    private static final Logger log = LoggerFactory.getLogger(CustomTemplateAvailability.class);
    private final TemplatingFunctions cmsfn;

    /**
     * Is only allowed on root
     */
    private final String HOME = "home";

    /**
     * Is allowed everywhere
     */
    private final String PAGE = "page";

    /**
     * Is allowed only under a page
     */
    private final String SUBPAGE = "subpage";


    @Inject
    public CustomTemplateAvailability(TemplatingFunctions cmsfn) {
        this.cmsfn = cmsfn;
    }

    @Override
    public boolean isAvailable(Node node, TemplateDefinition templateDefinition) {

        Workspace workspace;
        try {
            workspace = node.getSession().getWorkspace();
            if (!RepositoryConstants.WEBSITE.equals(workspace.getName())) return false;

        } catch (RepositoryException e) {
            log.error("Not able to access the Node's session or workspace.", e);
            return false;
        }

        try {
            final String type = templateDefinition.getType();
            if(type != null && !"".equals(type) && isKnownType(type)) {
                if (node.getDepth() == 1) {
                    // root
                    if(type.equals(HOME)) {
                        return true;
                    }
                } else {
                    // anywhere but root
                    if(type.equals(PAGE)) {
                        return true;
                    }
                    final String parentTemplateType = cmsfn.templateType(node.getParent());
                    if(parentTemplateType.equals(PAGE) && type.equals(SUBPAGE)) {
                        return true;
                    }
                }
                return false;
            } else {
                //The type is empty or unknown
                return false;
            }
        }
        catch (RepositoryException e) {
            log.error("Can't verify availability of the template", e);
        }

        //If an error happens. Fallback is true.
        return true;
    }


    private boolean isKnownType(String type) {
        return type.equals(HOME) || type.equals(PAGE) || type.equals(SUBPAGE);
    }

}
