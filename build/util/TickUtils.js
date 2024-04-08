"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNumberIntervalTicks = exports.isVisible = exports.getTickBoundaries = exports.getAngledTickWidth = void 0;
const CartesianUtils_1 = require("./CartesianUtils");
const getEveryNthWithCondition_1 = require("./getEveryNthWithCondition");
function getAngledTickWidth(contentSize, unitSize, angle) {
    const size = { width: contentSize.width + unitSize.width, height: contentSize.height + unitSize.height };
    return (0, CartesianUtils_1.getAngledRectangleWidth)(size, angle);
}
exports.getAngledTickWidth = getAngledTickWidth;
function getTickBoundaries(viewBox, sign, sizeKey) {
    const isWidth = sizeKey === 'width';
    const { x, y, width, height } = viewBox;
    if (sign === 1) {
        return {
            start: isWidth ? x : y,
            end: isWidth ? x + width : y + height,
        };
    }
    return {
        start: isWidth ? x + width : y + height,
        end: isWidth ? x : y,
    };
}
exports.getTickBoundaries = getTickBoundaries;
function isVisible(sign, tickPosition, getSize, start, end) {
    if (sign * tickPosition < sign * start || sign * tickPosition > sign * end) {
        return false;
    }
    const size = getSize();
    return sign * (tickPosition - (sign * size) / 2 - start) >= 0 && sign * (tickPosition + (sign * size) / 2 - end) <= 0;
}
exports.isVisible = isVisible;
function getNumberIntervalTicks(ticks, interval) {
    return (0, getEveryNthWithCondition_1.getEveryNthWithCondition)(ticks, interval + 1);
}
exports.getNumberIntervalTicks = getNumberIntervalTicks;
//# sourceMappingURL=TickUtils.js.map