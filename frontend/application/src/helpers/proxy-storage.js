var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
export var storage = getProxy(localStorage);
export var session = getProxy(sessionStorage);
export default storage;
function getProxy(webStorage) {
    var hasStorage = hasStorageSupport(webStorage);
    return new Proxy({}, {
        set: function (_obj, prop, value) {
            hasStorage
                ? webStorage.setItem(prop.toString(), String(value))
                : writeCookie(prop.toString(), value);
            return true;
        },
        get: function (_obj, prop) {
            return hasStorage
                ? webStorage.getItem(prop.toString())
                : readCookie(prop.toString());
        },
        has: function (obj, prop) {
            return typeof Reflect.get(obj, prop) === "string";
        },
        deleteProperty: function (_obj, prop) {
            hasStorage
                ? webStorage.removeItem(prop.toString())
                : writeCookie(prop.toString(), "", -1);
            return true;
        },
    });
}
function hasStorageSupport(webStorage) {
    try {
        webStorage.setItem("__storage__", "foo");
        webStorage.removeItem("__storage__");
        return true;
    }
    catch (e) {
        return false;
    }
}
function readCookie(name) {
    var e_1, _a;
    var nameEQ = name + "=";
    var cas = document.cookie.split(";");
    try {
        for (var cas_1 = __values(cas), cas_1_1 = cas_1.next(); !cas_1_1.done; cas_1_1 = cas_1.next()) {
            var ca = cas_1_1.value;
            var c = ca;
            while (c.charAt(0) === " ") {
                c = c.substring(1, c.length);
            }
            if (c.indexOf(nameEQ) === 0) {
                return c.substring(nameEQ.length, c.length);
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (cas_1_1 && !cas_1_1.done && (_a = cas_1.return)) _a.call(cas_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return null;
}
function writeCookie(name, value, days) {
    if (days === void 0) { days = 365; }
    var expiration = (function () {
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
            return "; expires=" + date.toUTCString();
        }
        return "";
    })();
    document.cookie = name + "=" + value + expiration + "; path=/";
}
//# sourceMappingURL=proxy-storage.js.map