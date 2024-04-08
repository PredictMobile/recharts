"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Global = void 0;
const parseIsSsrByDefault = () => !(typeof window !== 'undefined' && window.document && window.document.createElement && window.setTimeout);
exports.Global = {
    isSsr: parseIsSsrByDefault(),
    get: (key) => {
        return exports.Global[key];
    },
    set: (key, value) => {
        if (typeof key === 'string') {
            exports.Global[key] = value;
        }
        else {
            const keys = Object.keys(key);
            if (keys && keys.length) {
                keys.forEach((k) => {
                    exports.Global[k] = key[k];
                });
            }
        }
    },
};
//# sourceMappingURL=Global.js.map