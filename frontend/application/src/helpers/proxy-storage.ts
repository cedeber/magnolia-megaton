export const storage = getProxy(localStorage);
export const session = getProxy(sessionStorage);

export default storage;

/**
 * @param {Storage} webStorage
 * @returns {object}
 */
function getProxy(webStorage) {
    const hasStorage = hasStorageSupport(webStorage);

    return new Proxy(
        {},
        {
            set(_obj, prop, value) {
                hasStorage
                    ? webStorage.setItem(prop.toString(), String(value))
                    : writeCookie(prop.toString(), value);

                return true;
            },
            get(_obj, prop) {
                return hasStorage
                    ? webStorage.getItem(prop.toString())
                    : readCookie(prop.toString());
            },
            has(obj, prop) {
                return typeof Reflect.get(obj, prop) === "string";
            },
            deleteProperty(_obj, prop) {
                hasStorage
                    ? webStorage.removeItem(prop.toString())
                    : writeCookie(prop.toString(), "", -1);

                return true;
            },
        },
    );
}

/**
 * Whether the current browser supports local storage as a way of storing data
 * @param {Storage} webStorage
 * @returns {boolean}
 */
function hasStorageSupport(webStorage) {
    try {
        webStorage.setItem("__storage__", "foo");
        webStorage.removeItem("__storage__");
        return true;
    } catch (e) {
        return false;
    }
}

/**
 * @param {string} name The name of the property to read from this document's cookies
 * @returns {string|null} The specified cookie property's value (or null if it has not been set)
 */
function readCookie(name) {
    const nameEQ = name + "=";
    const cas = document.cookie.split(";");
    for (const ca of cas) {
        let c = ca;
        while (c.charAt(0) === " ") {
            c = c.substring(1, c.length);
        }
        if (c.indexOf(nameEQ) === 0) {
            return c.substring(nameEQ.length, c.length);
        }
    }

    return null;
}

/**
 * @param {string} name The name of the property to set by writing to a cookie
 * @param {string} value The value to use when setting the specified property
 * @param {number} [days] The number of days until the storage of this item expires
 */
function writeCookie(name, value, days?) {
    const expiration = (function() {
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
            return "; expires=" + date.toUTCString();
        }

        return "";
    })();

    document.cookie = name + "=" + value + expiration + "; path=/";
}
