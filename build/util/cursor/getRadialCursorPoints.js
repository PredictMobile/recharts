"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRadialCursorPoints = void 0;
const PolarUtils_1 = require("../PolarUtils");
function getRadialCursorPoints(activeCoordinate) {
    const { cx, cy, radius, startAngle, endAngle } = activeCoordinate;
    const startPoint = (0, PolarUtils_1.polarToCartesian)(cx, cy, radius, startAngle);
    const endPoint = (0, PolarUtils_1.polarToCartesian)(cx, cy, radius, endAngle);
    return {
        points: [startPoint, endPoint],
        cx,
        cy,
        radius,
        startAngle,
        endAngle,
    };
}
exports.getRadialCursorPoints = getRadialCursorPoints;
//# sourceMappingURL=getRadialCursorPoints.js.map