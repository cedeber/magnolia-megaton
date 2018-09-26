package ch.openinteractive.main.setup.tasks;

import ch.openinteractive.main.filters.LanguageDetectionFilter;
import info.magnolia.context.MgnlContext;
import info.magnolia.module.InstallContext;
import info.magnolia.module.delta.AbstractRepositoryTask;
import info.magnolia.module.delta.TaskExecutionException;

import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;

public class LanguageDetectionFilterTask extends AbstractRepositoryTask {

    private String name;

    public LanguageDetectionFilterTask(String name, String description) {
        super(name, description);
        this.name = name;
    }

    @Override
    protected void doExecute(InstallContext installContext) throws RepositoryException, TaskExecutionException {
        Session session = MgnlContext.getJCRSession("config");
        Node filters = session.getNode("/server/filters");

        try {
            Node node = filters.addNode(name, "mgnl:content");
            node.setProperty("class", LanguageDetectionFilter.class.getName());
            node.setProperty("enabled", false);

            session.save();
        } catch (Exception ignored) {}
    }
}
