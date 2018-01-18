import { Payload, Store } from "vuex";
import set from "lodash-es/set";
import merge from "lodash-es/merge";
import isObject from "lodash-es/isObject";
import taggr from "../devtools/taggr";

const log = taggr("vuex-session");

function createSessionStorage(key?: string) {
    function doSubscribe(_mutation: Payload, state: any) {
        const data = key ? state[key] : state;

        try {
            window.sessionStorage.setItem("vuex", JSON.stringify(data));
            log.success(`vuex store with the key '${key}' saved into sessionStorage`);
        } catch {
            log.list(data).error("Can't save the vuex store into sessionStorage. Safari in private mode?");
        }
    }

    return function(store: Store<any>) {
        const sessionData = window.sessionStorage.getItem("vuex");

        if (sessionData) {
            try {
                const parsedData = JSON.parse(sessionData);

                if (isObject(parsedData)) {
                    const data = key ? set({}, key, parsedData) : parsedData;

                    store.replaceState(merge(store.state, data));
                    log.success("vuex sessionStorage data saved into the vuex store");
                }
            } catch {
                log.list(sessionData).error("vuex sessionStorage import fails");
            }
        } else {
            log.warning("vuex sessionStorage doesn't exist");
        }

        store.subscribe(doSubscribe);
    };
}

export { createSessionStorage };
