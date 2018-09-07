package ch.openinteractive.main.servlets;

import com.google.common.reflect.TypeToken;
import com.google.gson.Gson;
import info.magnolia.jcr.util.ContentMap;
import info.magnolia.templating.functions.TemplatingFunctions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.inject.Inject;
import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.lang.reflect.Type;
import java.util.*;

public class MailServlet extends HttpServlet {

    private static final Logger log = LoggerFactory.getLogger(MailServlet.class);
    private TemplatingFunctions cmsfn;
    private final boolean SHOULD_SAVE = false;
    private final String TEMPLATE_PATH = "main/templates/emails/mailTemplate.ftl";


    private final List<String> PARAMETERS_TO_SAVE = new ArrayList<>(Arrays
        .asList("address", "city", "company", "country", "email", "firstname", "lastname", "phone", "zip", "message"));

    private final List<String> REQUIRED_PARAMETERS = new ArrayList<>(Arrays
        .asList("firstname", "lastname", "email", "address", "city", "zip", "country"));



    @Inject
    public MailServlet(TemplatingFunctions cmsfn) {
        this.cmsfn = cmsfn;
    }


    @Override
    public void doPost(HttpServletRequest req, HttpServletResponse resp) {
        log.debug("Mail Servlet Called");

        try {
            resp.setContentType("text/html");

            Map<String, Object> parameters = getParameters(req);
            String fromEmail = parameters.get("fromEmail").toString();
            String recipient = parameters.get("recipient").toString();
            String subject = parameters.get("subject").toString();


            if (checkRequiredParameters(parameters)) {
                Node node = ServletUtils.saveToJCR(parameters, PARAMETERS_TO_SAVE, SHOULD_SAVE);
                ContentMap contentMap = cmsfn.asContentMap(node);

                Map<String, Object> mailTemplateParameters = new HashMap<>();
                mailTemplateParameters.put("content", contentMap);

                ServletUtils.sendMailToRecipient(recipient, fromEmail, subject, TEMPLATE_PATH, mailTemplateParameters, null, null);
                resp.setStatus(HttpServletResponse.SC_OK);
            } else {
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


    @Override
    public void doGet(HttpServletRequest req, HttpServletResponse resp) { doPost(req, resp); }



    /**
     * Check if the required parameters are set
     * @param parameters
     * @return
     */
    private boolean checkRequiredParameters(Map<String, Object> parameters) {
        for (String parameter : REQUIRED_PARAMETERS) {
            if (!parameters.containsKey(parameter) && (parameters.get(parameter) != null || "".equals(parameters.get(parameter)))) return false;
        }

        return true;
    }

    /**
     * Get the parameters from the given request object
     * @param req
     * @return
     * @throws IOException
     */
    private Map<String, Object> getParameters(HttpServletRequest req) throws IOException {
        StringBuilder jsonBuff = new StringBuilder();
        String line;
        BufferedReader reader = req.getReader();
        while ((line = reader.readLine()) != null) {
            jsonBuff.append(line);
        }

        Gson gson = new Gson();
        Type type = new TypeToken<Map<String, Object>>(){}.getType();
        return gson.fromJson(jsonBuff.toString(), type);
    }

}
