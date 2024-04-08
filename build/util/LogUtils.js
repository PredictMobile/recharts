"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.warn = void 0;
const isDev = process.env.NODE_ENV !== 'production';
const warn = (condition, format, ...args) => {
    if (isDev && typeof console !== 'undefined' && console.warn) {
        if (format === undefined) {
            console.warn('LogUtils requires an error message argument');
        }
        if (!condition) {
            if (format === undefined) {
                console.warn('Minified exception occurred; use the non-minified dev environment ' +
                    'for the full error message and additional helpful warnings.');
            }
            else {
                let argIndex = 0;
                console.warn(format.replace(/%s/g, () => args[argIndex++]));
            }
        }
    }
};
exports.warn = warn;
//# sourceMappingURL=LogUtils.js.map