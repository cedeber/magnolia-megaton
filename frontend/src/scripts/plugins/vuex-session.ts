import Vuex from "vuex";
import _ from "lodash-es";

function createSessionStorage(key?: string) {
    function doSubscribe(_mutation: Vuex.Payload, state: any) {
        const data = key ? (state[key]) : state;

        window.sessionStorage.setItem("vuex", JSON.stringify(data));
    }

    return function(store: Vuex.Store<any>) {
        const sessionData = window.sessionStorage.getItem("vuex");

        if (sessionData) {
            try {
                const parsedData = JSON.parse(sessionData);

                if (_.isObject(parsedData)) {
                    const data = key ? _.set({}, key, parsedData) : parsedData;

                    store.replaceState(_.merge(store.state, data));
                }
            }
            catch (_unusedError) { /* empty */ }
        }

        store.subscribe(doSubscribe);
    };
}

export { createSessionStorage };
