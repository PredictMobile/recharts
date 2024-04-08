"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shallowEqual = void 0;
function shallowEqual(a, b) {
    for (const key in a) {
        if ({}.hasOwnProperty.call(a, key) && (!{}.hasOwnProperty.call(b, key) || a[key] !== b[key])) {
            return false;
        }
    }
    for (const key in b) {
        if ({}.hasOwnProperty.call(b, key) && !{}.hasOwnProperty.call(a, key)) {
            return false;
        }
    }
    return true;
}
exports.shallowEqual = shallowEqual;
//# sourceMappingURL=ShallowEqual.js.map