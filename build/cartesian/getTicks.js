"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTicks = void 0;
const isFunction_1 = __importDefault(require("lodash/isFunction"));
const DataUtils_1 = require("../util/DataUtils");
const DOMUtils_1 = require("../util/DOMUtils");
const Global_1 = require("../util/Global");
const TickUtils_1 = require("../util/TickUtils");
const getEquidistantTicks_1 = require("./getEquidistantTicks");
function getTicksEnd(sign, boundaries, getTickSize, ticks, minTickGap) {
    const result = (ticks || []).slice();
    const len = result.length;
    const { start } = boundaries;
    let { end } = boundaries;
    for (let i = len - 1; i >= 0; i--) {
        let entry = result[i];
        let size;
        const getSize = () => {
            if (size === undefined) {
                size = getTickSize(entry, i, ticks);
            }
            return size;
        };
        if (i === len - 1) {
            const gap = sign * (entry.coordinate + (sign * getSize()) / 2 - end);
            result[i] = entry = Object.assign(Object.assign({}, entry), { tickCoord: gap > 0 ? entry.coordinate - gap * sign : entry.coordinate });
        }
        else {
            result[i] = entry = Object.assign(Object.assign({}, entry), { tickCoord: entry.coordinate });
        }
        const isShow = (0, TickUtils_1.isVisible)(sign, entry.tickCoord, getSize, start, end);
        if (isShow) {
            end = entry.tickCoord - sign * (getSize() / 2 + minTickGap);
            result[i] = Object.assign(Object.assign({}, entry), { isShow: true });
        }
    }
    return result;
}
function getTicksStart(sign, boundaries, getTickSize, ticks, minTickGap, preserveEnd) {
    const result = (ticks || []).slice();
    const len = result.length;
    let { start, end } = boundaries;
    if (preserveEnd) {
        let tail = ticks[len - 1];
        const tailSize = getTickSize(tail, len - 1, ticks);
        const tailGap = sign * (tail.coordinate + (sign * tailSize) / 2 - end);
        result[len - 1] = tail = Object.assign(Object.assign({}, tail), { tickCoord: tailGap > 0 ? tail.coordinate - tailGap * sign : tail.coordinate });
        const isTailShow = (0, TickUtils_1.isVisible)(sign, tail.tickCoord, () => tailSize, start, end);
        if (isTailShow) {
            end = tail.tickCoord - sign * (tailSize / 2 + minTickGap);
            result[len - 1] = Object.assign(Object.assign({}, tail), { isShow: true });
        }
    }
    const count = preserveEnd ? len - 1 : len;
    for (let i = 0; i < count; i++) {
        let entry = result[i];
        let size;
        const getSize = () => {
            if (size === undefined) {
                size = getTickSize(entry, i, ticks);
            }
            return size;
        };
        if (i === 0) {
            const gap = sign * (entry.coordinate - (sign * getSize()) / 2 - start);
            result[i] = entry = Object.assign(Object.assign({}, entry), { tickCoord: gap < 0 ? entry.coordinate - gap * sign : entry.coordinate });
        }
        else {
            result[i] = entry = Object.assign(Object.assign({}, entry), { tickCoord: entry.coordinate });
        }
        const isShow = (0, TickUtils_1.isVisible)(sign, entry.tickCoord, getSize, start, end);
        if (isShow) {
            start = entry.tickCoord + sign * (getSize() / 2 + minTickGap);
            result[i] = Object.assign(Object.assign({}, entry), { isShow: true });
        }
    }
    return result;
}
function getTicks(props, fontSize, letterSpacing) {
    const { tick, ticks, viewBox, minTickGap, orientation, interval, tickFormatter, unit, angle } = props;
    if (!ticks || !ticks.length || !tick) {
        return [];
    }
    if ((0, DataUtils_1.isNumber)(interval) || Global_1.Global.isSsr) {
        return (0, TickUtils_1.getNumberIntervalTicks)(ticks, typeof interval === 'number' && (0, DataUtils_1.isNumber)(interval) ? interval : 0);
    }
    let candidates = [];
    const sizeKey = orientation === 'top' || orientation === 'bottom' ? 'width' : 'height';
    const unitSize = unit && sizeKey === 'width' ? (0, DOMUtils_1.getStringSize)(unit, { fontSize, letterSpacing }) : { width: 0, height: 0 };
    const getTickSize = (content, index, allTicks) => {
        const value = (0, isFunction_1.default)(tickFormatter) ? tickFormatter(content.value, index, allTicks) : content.value;
        return sizeKey === 'width'
            ? (0, TickUtils_1.getAngledTickWidth)((0, DOMUtils_1.getStringSize)(value, { fontSize, letterSpacing }), unitSize, angle)
            : (0, DOMUtils_1.getStringSize)(value, { fontSize, letterSpacing })[sizeKey];
    };
    const sign = ticks.length >= 2 ? (0, DataUtils_1.mathSign)(ticks[1].coordinate - ticks[0].coordinate) : 1;
    const boundaries = (0, TickUtils_1.getTickBoundaries)(viewBox, sign, sizeKey);
    if (interval === 'equidistantPreserveStart') {
        return (0, getEquidistantTicks_1.getEquidistantTicks)(sign, boundaries, getTickSize, ticks, minTickGap);
    }
    if (interval === 'preserveStart' || interval === 'preserveStartEnd') {
        candidates = getTicksStart(sign, boundaries, getTickSize, ticks, minTickGap, interval === 'preserveStartEnd');
    }
    else {
        candidates = getTicksEnd(sign, boundaries, getTickSize, ticks, minTickGap);
    }
    return candidates.filter(entry => entry.isShow);
}
exports.getTicks = getTicks;
//# sourceMappingURL=getTicks.js.map