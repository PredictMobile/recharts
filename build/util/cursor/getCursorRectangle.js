"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCursorRectangle = void 0;
function getCursorRectangle(layout, activeCoordinate, offset, tooltipAxisBandSize) {
    const halfSize = tooltipAxisBandSize / 2;
    return {
        stroke: 'none',
        fill: '#ccc',
        x: layout === 'horizontal' ? activeCoordinate.x - halfSize : offset.left + 0.5,
        y: layout === 'horizontal' ? offset.top + 0.5 : activeCoordinate.y - halfSize,
        width: layout === 'horizontal' ? tooltipAxisBandSize : offset.width - 1,
        height: layout === 'horizontal' ? offset.height - 1 : tooltipAxisBandSize,
    };
}
exports.getCursorRectangle = getCursorRectangle;
//# sourceMappingURL=getCursorRectangle.js.map