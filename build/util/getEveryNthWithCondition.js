"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEveryNthWithCondition = void 0;
function getEveryNthWithCondition(array, n, isValid) {
    if (n < 1) {
        return [];
    }
    if (n === 1 && isValid === undefined) {
        return array;
    }
    const result = [];
    for (let i = 0; i < array.length; i += n) {
        if (isValid === undefined || isValid(array[i]) === true) {
            result.push(array[i]);
        }
        else {
            return undefined;
        }
    }
    return result;
}
exports.getEveryNthWithCondition = getEveryNthWithCondition;
//# sourceMappingURL=getEveryNthWithCondition.js.map