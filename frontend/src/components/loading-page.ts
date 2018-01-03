import { Vue, Component } from "vue-property-decorator";
import { applyBeforeQuit, simulateLoading, pageLoaded } from "../helpers/loading";
import taggr from "../devtools/taggr";

const log = taggr("loading-page");

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
        log.success("Hello, world!");
    }

    private animateQuit() {
        return new Promise((resolve, _reject) => {
            const delay = 135;

            this.isHidden = false;
            setTimeout(() => { resolve(); }, delay);
            log.info(`Loads the new page in ${delay}ms`);
        });
    }
}

export default LoadingPage;
