import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import slice from "lodash-es/slice";
import size from "lodash-es/size";
import concat from "lodash-es/concat";
import "../utils/vertical-state";

const CACHE_QUANTITY = 5;
// let observer: IntersectionObserver;

// [TODO] This should be externalize to keep the own website API logic
// [TODO] Implement a partial loading logic
async function getCacheAsync(from: number, quantity: number): Promise<any[]> {
    const response = await fetch("./assets/messages.json");
    const messages = response.ok ? await response.json() : [];
    const result = slice(messages, from, Math.min(from + quantity, size(messages)));

    if (from > size(messages)) { return Promise.reject("no more items"); }
    return Promise.resolve(result);
}

/* ---------   ---------   --------- */

@Component
class InfiniteCascade extends Vue {
    public isTicking = false;
    public cache: any[] = [];
    public items: any[] = [];
    public itemsCached = 0;

    public async mounted() {
        // const scrollable = this.scrollRoot ? document.querySelector(this.scrollRoot) || undefined : undefined;
        // observer = new IntersectionObserver(e => e.forEach(f => console.log(f.target.__vue__)), {root: scrollable, threshold: 1});

        let i = 0;

        while (i >= 0) {
            try {
                this.items = concat(this.items, await this.getItem(i));
                i = i + 1;
            }
            catch (error) { i = -1; }
        }
    }

    public updated() {
        // console.log(this.$el.verticalState.topProgress, this.$el.verticalState.bottomProgress);
    }

    public async getCache(): Promise<boolean | Error> {
        try {
            const cache = await getCacheAsync(this.itemsCached, CACHE_QUANTITY);

            this.cache = concat(this.cache, cache);
            this.itemsCached += CACHE_QUANTITY;
            return Promise.resolve(true);
        }
        catch (error) {
            return Promise.reject(error);
        }
    }

    public async getItem(index: number): Promise<any | Error> {
        try {
            if (index >= this.itemsCached) { await this.getCache(); }

            const value = this.cache[index];

            if (value === undefined) { throw new Error("no value"); }
            return Promise.resolve(value);
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
}

/* ---------   ---------   --------- */

@Component
class InfiniteCascadeItem extends Vue {
    @Prop() public content: any;

    public mounted() {
        // console.log(this.$el.verticalState.ahead);
        // observer.observe(this.$el);
    }

    public beforeDestroy() {
        // observer.unobserve(this.$el);
    }
}

export { InfiniteCascade, InfiniteCascadeItem };
