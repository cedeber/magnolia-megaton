import { Vue, Component } from "vue-property-decorator";
import { simulateLoading, pageLoaded } from "../helpers/loading";
import taggr from "../devtools/taggr";

const log = taggr("loading-page");

/**
 * Replace all links events to run the callback before loading the new page
 * @param {() => Promise<any>} callback
 */
function applyBeforeQuit(callback: () => Promise<any>) {
    log.info("A loading click Event is added to the document");

    document.addEventListener("click", async (event: MouseEvent) => {
        log.info("You click on the document");

        // Test for left click.
        if (event.button !== 0) {
            log.error("Not a left click");
            return;
        }

        let element = event.target as Element | null;

        // Go up through the DOM tree to search for a link
        while (element && !element.hasAttribute("href")) {
            element = element.parentElement;
        }

        if (element) {
            const location = element.getAttribute("href");

            // If the link is for e-mail, phone or new window, do nothing
            if ((location && /^((mailto|tel):|#)/.test(location)) || element.hasAttribute("target")) {
                log.info("This link is for e-mail, phone or a new window");
                return;
            }

            event.preventDefault();

            try {
                await callback();
            } catch {
                log.error(`The callback '${callback.name}' failed`);
            }

            // Once callback returns a promise, go to the new page
            if (location) {
                log.info(`Navigate to the new page '${location}'`);
                window.location.assign(location);
            }
        }
    });
}

@Component
class LoadingPage extends Vue {
    public isLoading = true;
    public isHidden = false;

    public mounted() {
        applyBeforeQuit(this.animateQuit);
        Promise.all([simulateLoading(), pageLoaded()]).then(this.animateEnter);
    }

    private animateEnter() {
        this.isHidden = true;
        this.isLoading = false;
        log.info("Hello, world!");
    }

    private animateQuit() {
        return new Promise((resolve, _reject) => {
            const delay = 135;

            this.isHidden = false;
            setTimeout(() => {
                resolve();
            }, delay);
            log.info(`Loads the new page in ${delay}ms`);
        });
    }
}

export default LoadingPage;
