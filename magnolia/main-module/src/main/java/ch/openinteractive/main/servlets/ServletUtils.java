package ch.openinteractive.main.servlets;

import info.magnolia.context.MgnlContext;
import info.magnolia.module.mail.MailModule;
import info.magnolia.module.mail.MailTemplate;
import info.magnolia.module.mail.MgnlMailFactory;
import info.magnolia.module.mail.templates.MailAttachment;
import info.magnolia.module.mail.templates.MgnlEmail;
import info.magnolia.objectfactory.Components;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.mail.Address;
import javax.mail.Message;
import javax.mail.internet.InternetAddress;
import javax.servlet.http.HttpServletRequest;
import java.util.*;

public class ServletUtils {


    public static void sendMailToRecipient(String recipient, String fromEmail, String subject, String templatePath, Map<String, Object> parameters, MailAttachment attachment, String recipientCC) throws Exception {
        MailModule mailModule = Components.getComponent(MailModule.class);

        MailTemplate template = new MailTemplate(mailModule);
        template.setTemplateFile(templatePath);
        template.setParameters(parameters);

        MgnlMailFactory mgnlMailFactory = mailModule.getFactory();

        MgnlEmail email = mgnlMailFactory.getEmailFromType(new HashMap<>(), "freemarker");
        email.setFrom(fromEmail);

        email.setSubject(subject);
        InternetAddress fromAddress = new InternetAddress(fromEmail);
        email.setFrom(fromAddress);
        email.setReplyTo(new Address[] { fromAddress });

        InternetAddress toAddress = new InternetAddress(recipient);
        email.setRecipient(Message.RecipientType.TO, toAddress);

        if (recipientCC != null && !recipientCC.equals("")) {
            email.addRecipient(Message.RecipientType.CC, new InternetAddress(recipientCC));
        }

        email.setTemplate(template);
        email.setBodyFromResourceFile();

        if (attachment != null) {
            email.addAttachment(attachment);
        }

        mailModule.getHandler().sendMail(email);
    }


    /**
     * Check if all required Parameters are present
     * @param req
     * @param requiredParameters
     * @return
     */
    public static boolean checkRequiredParams(HttpServletRequest req, Set<String> requiredParameters) {
        for (String requiredParam : requiredParameters) {
            if (req.getParameter(requiredParam) == null || req.getParameter(requiredParam).isEmpty()) {
                return false;
            }
        }
        return true;
    }


    /**
     * Save the given values to the form2db repository for legal reasons if the shouldSave parameter is true.
     * Else it just returns the created Node for further use
     * Will save into the form2DB workspace so we can use the export functionality of the form2DB App.
     *
     * @param values the values to be saved
     * @param shouldSave whether the session should be saved or not. It is used to be able to only get the created Node
     *                   to send an E-Mail
     * @return the created Node
     * @throws RepositoryException
     * @throws IllegalArgumentException when the orderid is missing (This should always be provided, if not someone is messing around with the JavaScript)
     */
    public static Node saveToJCR(Map<String, Object> values, List<String> parametersToSave, boolean shouldSave) throws RepositoryException, IllegalArgumentException {
        Node newNode;

        Session session = MgnlContext.getJCRSession("form2db");

        Node customMailNode;
        if (session.getRootNode().hasNode("mail")) {
            customMailNode = session.getRootNode().getNode("mail");
        } else {
            customMailNode = session.getRootNode().addNode("mail", "mgnl:folder");
        }

        newNode = customMailNode.addNode(UUID.randomUUID().toString(), "mgnl:formEntryNode");

        for (Map.Entry<String, Object> value : values.entrySet()) {
            if (parametersToSave.contains(value.getKey())) {
                newNode.setProperty(value.getKey(), value.getValue().toString());
            }
        }

        if (shouldSave) session.save();

        return newNode;
    }

}
