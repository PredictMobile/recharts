"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cursor = void 0;
const react_1 = require("react");
const clsx_1 = __importDefault(require("clsx"));
const Curve_1 = require("../shape/Curve");
const Cross_1 = require("../shape/Cross");
const getCursorRectangle_1 = require("../util/cursor/getCursorRectangle");
const Rectangle_1 = require("../shape/Rectangle");
const getRadialCursorPoints_1 = require("../util/cursor/getRadialCursorPoints");
const Sector_1 = require("../shape/Sector");
const getCursorPoints_1 = require("../util/cursor/getCursorPoints");
const ReactUtils_1 = require("../util/ReactUtils");
const tooltipContext_1 = require("../context/tooltipContext");
const chartLayoutContext_1 = require("../context/chartLayoutContext");
function Cursor(props) {
    var _a;
    const { element, tooltipEventType, tooltipAxisBandSize, layout, chartName } = props;
    const { active, coordinate, payload, index } = (0, tooltipContext_1.useTooltipContext)();
    const offset = (0, chartLayoutContext_1.useOffset)();
    const isActive = (_a = element.props.active) !== null && _a !== void 0 ? _a : active;
    const activeCoordinate = coordinate;
    const activePayload = payload;
    const activeTooltipIndex = index;
    if (!element ||
        !element.props.cursor ||
        !isActive ||
        !activeCoordinate ||
        (chartName !== 'ScatterChart' && tooltipEventType !== 'axis')) {
        return null;
    }
    let restProps;
    let cursorComp = Curve_1.Curve;
    if (chartName === 'ScatterChart') {
        restProps = activeCoordinate;
        cursorComp = Cross_1.Cross;
    }
    else if (chartName === 'BarChart') {
        restProps = (0, getCursorRectangle_1.getCursorRectangle)(layout, activeCoordinate, offset, tooltipAxisBandSize);
        cursorComp = Rectangle_1.Rectangle;
    }
    else if (layout === 'radial') {
        const { cx, cy, radius, startAngle, endAngle } = (0, getRadialCursorPoints_1.getRadialCursorPoints)(activeCoordinate);
        restProps = {
            cx,
            cy,
            startAngle,
            endAngle,
            innerRadius: radius,
            outerRadius: radius,
        };
        cursorComp = Sector_1.Sector;
    }
    else {
        restProps = { points: (0, getCursorPoints_1.getCursorPoints)(layout, activeCoordinate, offset) };
        cursorComp = Curve_1.Curve;
    }
    const cursorProps = Object.assign(Object.assign(Object.assign(Object.assign({ stroke: '#ccc', pointerEvents: 'none' }, offset), restProps), (0, ReactUtils_1.filterProps)(element.props.cursor, false)), { payload: activePayload, payloadIndex: activeTooltipIndex, className: (0, clsx_1.default)('recharts-tooltip-cursor', element.props.cursor.className) });
    return (0, react_1.isValidElement)(element.props.cursor)
        ? (0, react_1.cloneElement)(element.props.cursor, cursorProps)
        : (0, react_1.createElement)(cursorComp, cursorProps);
}
exports.Cursor = Cursor;
//# sourceMappingURL=Cursor.js.map