package ch.openinteractive.main.setup;

import ch.openinteractive.main.filters.LanguageDetectionFilter;
import ch.openinteractive.main.templating.OITemplatingFunctions;
import info.magnolia.module.DefaultModuleVersionHandler;
import info.magnolia.module.InstallContext;
import info.magnolia.module.delta.*;
import info.magnolia.rendering.module.setup.InstallRendererContextAttributeTask;

import java.util.ArrayList;
import java.util.List;

/**
 * This class is optional and lets you manage the versions of your module,
 * by registering "deltas" to maintain the module's configuration, or other type of content.
 * If you don't need this, simply remove the reference to this class in the module descriptor xml.
 *
 * @see info.magnolia.module.DefaultModuleVersionHandler
 * @see info.magnolia.module.ModuleVersionHandler
 * @see info.magnolia.module.delta.Task
 */
public class StarterKitVersionHandler extends DefaultModuleVersionHandler {

    @Override
    protected List<Task> getExtraInstallTasks(InstallContext installContext) {
        List<Task> extraInstallTasks = new ArrayList<>(super.getExtraInstallTasks(installContext));
        extraInstallTasks.addAll(getFunctionsInstallerTask());
        extraInstallTasks.addAll(getLanguageDetectionInstallTasks());
        extraInstallTasks.add(new OrderFilterBeforeTask("languageDetection", new String[] { "cache" }));
        return extraInstallTasks;
    }

    private List<Task> getFunctionsInstallerTask() {
        List<Task> tasks = new ArrayList<>();
        tasks.add(new InstallRendererContextAttributeTask("rendering", "freemarker", OITemplatingFunctions.oiFunctionsName, OITemplatingFunctions.class.getName()));
        return tasks;
    }

    private List<Task> getLanguageDetectionInstallTasks() {
        List<Task> tasks = new ArrayList<>();
        tasks.add(new NodeExistsDelegateTask("languageDetection", "/server/filters/languageDetection", null, new CreateNodeTask("languageDetection", "/server/filters", "languageDetection", "mgnl:content")));
        tasks.add(new CheckOrCreatePropertyTask("class", "/server/filters/languageDetection", "class", LanguageDetectionFilter.class.getName()));
        tasks.add(new CheckOrCreatePropertyTask("enabled", "/server/filters/languageDetection", "enabled", "false"));
        return tasks;
    }
}
