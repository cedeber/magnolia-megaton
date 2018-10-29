package ch.openinteractive.main.form;

import com.vaadin.v7.data.Item;
import info.magnolia.ui.api.action.ActionExecutionException;
import info.magnolia.ui.dialog.action.SaveDialogAction;
import info.magnolia.ui.form.EditorCallback;
import info.magnolia.ui.form.EditorValidator;
import info.magnolia.ui.vaadin.integration.jcr.JcrNodeAdapter;

import javax.jcr.Node;
import javax.jcr.RepositoryException;

public class SaveSingleCheckboxAction extends SaveDialogAction<SaveSingleCheckboxActionDefinition> {

    public SaveSingleCheckboxAction(SaveSingleCheckboxActionDefinition definition, Item item, EditorValidator validator, EditorCallback callback) {
        super(definition, item, validator, callback);
    }

    @Override
    public void execute() throws ActionExecutionException {
        super.execute();

        //Save the controlName property also as value
        if(item instanceof JcrNodeAdapter) {
            Node node = ((JcrNodeAdapter) item).getJcrItem();
            try {
                if(node.hasProperty("controlName")) {
                    String controlName = node.getProperty("controlName").getString();
                    node.setProperty("value", controlName);
                    node.getSession().save();
                }
            } catch (RepositoryException e) {
                e.printStackTrace();
            }
        }

    }
}
