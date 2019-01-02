package ch.openinteractive.main.servlets;

import info.magnolia.cms.beans.runtime.Document;
import info.magnolia.context.MgnlContext;
import info.magnolia.jcr.util.ContentMap;
import info.magnolia.module.mail.templates.MailAttachment;
import info.magnolia.templating.functions.TemplatingFunctions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.inject.Inject;
import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

public class CustomFormServlet extends HttpServlet {

    private static final Logger log = LoggerFactory.getLogger(CustomFormServlet.class);
    private TemplatingFunctions cmsfn;
    private final boolean SHOULD_SAVE = false;
    private final String TEMPLATE_PATH = "main/templates/emails/mailTemplate.ftl";
    private final String HONEYPOT_NAME = "winnie";


    private final List<String> PARAMETERS_NOT_TO_SAVE = new ArrayList<>(Arrays
        .asList(""));

    private final List<String> REQUIRED_PARAMETERS = new ArrayList<>(Arrays
        .asList("firstname", "lastname", "email", "address", "city", "zip", "country"));



    @Inject
    public CustomFormServlet(TemplatingFunctions cmsfn) {
        this.cmsfn = cmsfn;
    }


    @Override
    public void doPost(HttpServletRequest req, HttpServletResponse resp) {

        log.debug("Custom Form MailServlet called");

        try {
            resp.setContentType("text/html");

            Map<String, String> parameters = getParameters(req);

            if (!isHoneypotFieldValid(parameters)) {
                throw new Exception("Honeypot field should be empty!");
            }

            Map<String, Object> mailTemplateParameters = new HashMap<>();
            MailAttachment attachment = null;
            Document document = MgnlContext.getWebContext().getPostedForm().getDocuments().get("file-upload");

            boolean isValidDocument = ServletUtils.isValidDocument(document);
            boolean hasDocument = document != null;

            File file = isValidDocument ? document.getFile() : null;

            if (file != null) {
                attachment = new MailAttachment(file, file.getName(), "", "");
            }

            if (checkRequiredParameters(parameters) && (isValidDocument || !hasDocument)) {
                String fromEmail = parameters.get("fromEmail");
                String recipient = parameters.get("recipient");
                String subject = parameters.get("subject");

                Node node = ServletUtils.saveToJCR(parameters, PARAMETERS_NOT_TO_SAVE, SHOULD_SAVE);
                ContentMap contentMap = cmsfn.asContentMap(node);

                mailTemplateParameters.put("content", contentMap);

                ServletUtils.sendMailToRecipient(recipient, fromEmail, subject, TEMPLATE_PATH, mailTemplateParameters, attachment, null);
                resp.setStatus(HttpServletResponse.SC_OK);
            } else {
                log.warn("Request not valid");
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            }

        } catch (RepositoryException e) {
            log.error("An error occurred while trying to save the data to the JCR", e);
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        } catch (IOException e) {
            log.error("An error occurred while trying get the parameters", e);
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            log.error("Exception in MailServlet", e);
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    private boolean isHoneypotFieldValid(Map<String, String> parameters) {
        if (!parameters.containsKey(HONEYPOT_NAME) && parameters.get(HONEYPOT_NAME) != null) {
            return false;
        }

        if (!"".equals(parameters.get(HONEYPOT_NAME))) {
            return false;
        }

        return true;
    }

    /**
     * Check if the required parameters are set
     * @param parameters
     * @return
     */
    private boolean checkRequiredParameters(Map<String, String> parameters) {
        for (String parameterKey : REQUIRED_PARAMETERS) {
            if (!parameters.containsKey(parameterKey) || parameters.get(parameterKey) == null || "".equals(parameters.get(parameterKey))) {
                log.warn("Required parameter missing: "+parameterKey);
                return false;
            }
        }
        return true;
    }

    /**
     * Get the parameters from the given request object
     * @param req
     * @return
     * @throws IOException
     */
    private Map<String, String> getParameters(HttpServletRequest req) {
        Map<String, String[]> parametersArray = req.getParameterMap();

        return parametersArray.entrySet().stream()
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        e -> e.getValue()[0]
                ));
    }

}
