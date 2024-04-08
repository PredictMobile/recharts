"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLinearRegression = exports.findEntryInArray = exports.interpolateNumber = exports.hasDuplicate = exports.getAnyElementOfObject = exports.getPercentValue = exports.uniqueId = exports.isNumOrStr = exports.isNumber = exports.isPercent = exports.mathSign = void 0;
const isString_1 = __importDefault(require("lodash/isString"));
const isNaN_1 = __importDefault(require("lodash/isNaN"));
const get_1 = __importDefault(require("lodash/get"));
const isNumber_1 = __importDefault(require("lodash/isNumber"));
const mathSign = (value) => {
    if (value === 0) {
        return 0;
    }
    if (value > 0) {
        return 1;
    }
    return -1;
};
exports.mathSign = mathSign;
const isPercent = (value) => (0, isString_1.default)(value) && value.indexOf('%') === value.length - 1;
exports.isPercent = isPercent;
const isNumber = (value) => (0, isNumber_1.default)(value) && !(0, isNaN_1.default)(value);
exports.isNumber = isNumber;
const isNumOrStr = (value) => (0, exports.isNumber)(value) || (0, isString_1.default)(value);
exports.isNumOrStr = isNumOrStr;
let idCounter = 0;
const uniqueId = (prefix) => {
    const id = ++idCounter;
    return `${prefix || ''}${id}`;
};
exports.uniqueId = uniqueId;
const getPercentValue = (percent, totalValue, defaultValue = 0, validate = false) => {
    if (!(0, exports.isNumber)(percent) && !(0, isString_1.default)(percent)) {
        return defaultValue;
    }
    let value;
    if ((0, exports.isPercent)(percent)) {
        const index = percent.indexOf('%');
        value = (totalValue * parseFloat(percent.slice(0, index))) / 100;
    }
    else {
        value = +percent;
    }
    if ((0, isNaN_1.default)(value)) {
        value = defaultValue;
    }
    if (validate && value > totalValue) {
        value = totalValue;
    }
    return value;
};
exports.getPercentValue = getPercentValue;
const getAnyElementOfObject = (obj) => {
    if (!obj) {
        return null;
    }
    const keys = Object.keys(obj);
    if (keys && keys.length) {
        return obj[keys[0]];
    }
    return null;
};
exports.getAnyElementOfObject = getAnyElementOfObject;
const hasDuplicate = (ary) => {
    if (!Array.isArray(ary)) {
        return false;
    }
    const len = ary.length;
    const cache = {};
    for (let i = 0; i < len; i++) {
        if (!cache[ary[i]]) {
            cache[ary[i]] = true;
        }
        else {
            return true;
        }
    }
    return false;
};
exports.hasDuplicate = hasDuplicate;
const interpolateNumber = (numberA, numberB) => {
    if ((0, exports.isNumber)(numberA) && (0, exports.isNumber)(numberB)) {
        return (t) => numberA + t * (numberB - numberA);
    }
    return () => numberB;
};
exports.interpolateNumber = interpolateNumber;
function findEntryInArray(ary, specifiedKey, specifiedValue) {
    if (!ary || !ary.length) {
        return null;
    }
    return ary.find(entry => entry && (typeof specifiedKey === 'function' ? specifiedKey(entry) : (0, get_1.default)(entry, specifiedKey)) === specifiedValue);
}
exports.findEntryInArray = findEntryInArray;
const getLinearRegression = (data) => {
    if (!data || !data.length) {
        return null;
    }
    const len = data.length;
    let xsum = 0;
    let ysum = 0;
    let xysum = 0;
    let xxsum = 0;
    let xmin = Infinity;
    let xmax = -Infinity;
    let xcurrent = 0;
    let ycurrent = 0;
    for (let i = 0; i < len; i++) {
        xcurrent = data[i].cx || 0;
        ycurrent = data[i].cy || 0;
        xsum += xcurrent;
        ysum += ycurrent;
        xysum += xcurrent * ycurrent;
        xxsum += xcurrent * xcurrent;
        xmin = Math.min(xmin, xcurrent);
        xmax = Math.max(xmax, xcurrent);
    }
    const a = len * xxsum !== xsum * xsum ? (len * xysum - xsum * ysum) / (len * xxsum - xsum * xsum) : 0;
    return {
        xmin,
        xmax,
        a,
        b: (ysum - a * xsum) / len,
    };
};
exports.getLinearRegression = getLinearRegression;
//# sourceMappingURL=DataUtils.js.map