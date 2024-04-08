"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEquidistantTicks = void 0;
const TickUtils_1 = require("../util/TickUtils");
const getEveryNthWithCondition_1 = require("../util/getEveryNthWithCondition");
function getEquidistantTicks(sign, boundaries, getTickSize, ticks, minTickGap) {
    const result = (ticks || []).slice();
    const { start: initialStart, end } = boundaries;
    let index = 0;
    let stepsize = 1;
    let start = initialStart;
    while (stepsize <= result.length) {
        const entry = ticks === null || ticks === void 0 ? void 0 : ticks[index];
        if (entry === undefined) {
            return (0, getEveryNthWithCondition_1.getEveryNthWithCondition)(ticks, stepsize);
        }
        const i = index;
        let size;
        const getSize = () => {
            if (size === undefined) {
                size = getTickSize(entry, i, ticks);
            }
            return size;
        };
        const tickCoord = entry.coordinate;
        const isShow = index === 0 || (0, TickUtils_1.isVisible)(sign, tickCoord, getSize, start, end);
        if (!isShow) {
            index = 0;
            start = initialStart;
            stepsize += 1;
        }
        if (isShow) {
            start = tickCoord + sign * (getSize() / 2 + minTickGap);
            index += stepsize;
        }
    }
    return [];
}
exports.getEquidistantTicks = getEquidistantTicks;
//# sourceMappingURL=getEquidistantTicks.js.map