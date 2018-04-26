import { Payload, Store } from "vuex";
import taggr from "../devtools/taggr";
import set from "lodash-es/set";
import merge from "lodash-es/merge";
import isObject from "lodash-es/isObject";

const log = taggr("vuex-session");

/**
 * Save the store into session storage so that you can share it between pages
 * @example
 * new Vuex.Store({ plugins: [ createSessionStorage("[KEY]") ], .. });
 * @param {string?} key You can save only a part of the store if needed => store[key]
 * @returns {(store: Store<any>) => void}
 */
function createSessionStorage(key?: string): (store: Store<any>) => void {
    function doSubscribe(_mutation: Payload, state: any) {
        // Retrieve the data from the store
        const data = key ? state[key] : state;

        // Try to save it into the session storage called "vuex"
        try {
            window.sessionStorage.setItem("vuex", JSON.stringify(data));
            log.success(
                `vuex store with the key '${key}' saved into sessionStorage`,
            );
        } catch {
            log
                .list(data)
                .error(
                    "Can't save the vuex store into sessionStorage. Safari in private mode?",
                );
        }
    }

    return function(store: Store<any>) {
        // Retrive the data from the session storage
        const sessionData = window.sessionStorage.getItem("vuex");

        if (sessionData) {
            try {
                const parsedData = JSON.parse(sessionData);

                if (isObject(parsedData)) {
                    // If a key is defined, create a void store object in order to merge it
                    const data = key ? set({}, key, parsedData) : parsedData;

                    // Merge the current store with the retrieved data from session storage
                    store.replaceState(merge(store.state, data));
                    log.success(
                        "vuex sessionStorage data saved into the vuex store with the key '${key}'",
                    );
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

export default createSessionStorage;
