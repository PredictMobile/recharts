"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCursorPoints = void 0;
const PolarUtils_1 = require("../PolarUtils");
const getRadialCursorPoints_1 = require("./getRadialCursorPoints");
function getCursorPoints(layout, activeCoordinate, offset) {
    let x1, y1, x2, y2;
    if (layout === 'horizontal') {
        x1 = activeCoordinate.x;
        x2 = x1;
        y1 = offset.top;
        y2 = offset.top + offset.height;
    }
    else if (layout === 'vertical') {
        y1 = activeCoordinate.y;
        y2 = y1;
        x1 = offset.left;
        x2 = offset.left + offset.width;
    }
    else if (activeCoordinate.cx != null && activeCoordinate.cy != null) {
        if (layout === 'centric') {
            const { cx, cy, innerRadius, outerRadius, angle } = activeCoordinate;
            const innerPoint = (0, PolarUtils_1.polarToCartesian)(cx, cy, innerRadius, angle);
            const outerPoint = (0, PolarUtils_1.polarToCartesian)(cx, cy, outerRadius, angle);
            x1 = innerPoint.x;
            y1 = innerPoint.y;
            x2 = outerPoint.x;
            y2 = outerPoint.y;
        }
        else {
            return (0, getRadialCursorPoints_1.getRadialCursorPoints)(activeCoordinate);
        }
    }
    return [
        { x: x1, y: y1 },
        { x: x2, y: y2 },
    ];
}
exports.getCursorPoints = getCursorPoints;
//# sourceMappingURL=getCursorPoints.js.map