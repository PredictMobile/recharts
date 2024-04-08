"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartesianGrid = void 0;
const react_1 = __importDefault(require("react"));
const isFunction_1 = __importDefault(require("lodash/isFunction"));
const LogUtils_1 = require("../util/LogUtils");
const DataUtils_1 = require("../util/DataUtils");
const ReactUtils_1 = require("../util/ReactUtils");
const ChartUtils_1 = require("../util/ChartUtils");
const getTicks_1 = require("./getTicks");
const CartesianAxis_1 = require("./CartesianAxis");
const chartLayoutContext_1 = require("../context/chartLayoutContext");
const Background = (props) => {
    const { fill } = props;
    if (!fill || fill === 'none') {
        return null;
    }
    const { fillOpacity, x, y, width, height } = props;
    return (react_1.default.createElement("rect", { x: x, y: y, width: width, height: height, stroke: "none", fill: fill, fillOpacity: fillOpacity, className: "recharts-cartesian-grid-bg" }));
};
function renderLineItem(option, props) {
    let lineItem;
    if (react_1.default.isValidElement(option)) {
        lineItem = react_1.default.cloneElement(option, props);
    }
    else if ((0, isFunction_1.default)(option)) {
        lineItem = option(props);
    }
    else {
        const { x1, y1, x2, y2, key } = props, others = __rest(props, ["x1", "y1", "x2", "y2", "key"]);
        const _a = (0, ReactUtils_1.filterProps)(others, false), { offset: __ } = _a, restOfFilteredProps = __rest(_a, ["offset"]);
        lineItem = react_1.default.createElement("line", Object.assign({}, restOfFilteredProps, { x1: x1, y1: y1, x2: x2, y2: y2, fill: "none", key: key }));
    }
    return lineItem;
}
function HorizontalGridLines(props) {
    const { x, width, horizontal = true, horizontalPoints } = props;
    if (!horizontal || !horizontalPoints || !horizontalPoints.length) {
        return null;
    }
    const items = horizontalPoints.map((entry, i) => {
        const lineItemProps = Object.assign(Object.assign({}, props), { x1: x, y1: entry, x2: x + width, y2: entry, key: `line-${i}`, index: i });
        return renderLineItem(horizontal, lineItemProps);
    });
    return react_1.default.createElement("g", { className: "recharts-cartesian-grid-horizontal" }, items);
}
function VerticalGridLines(props) {
    const { y, height, vertical = true, verticalPoints } = props;
    if (!vertical || !verticalPoints || !verticalPoints.length) {
        return null;
    }
    const items = verticalPoints.map((entry, i) => {
        const lineItemProps = Object.assign(Object.assign({}, props), { x1: entry, y1: y, x2: entry, y2: y + height, key: `line-${i}`, index: i });
        return renderLineItem(vertical, lineItemProps);
    });
    return react_1.default.createElement("g", { className: "recharts-cartesian-grid-vertical" }, items);
}
function HorizontalStripes(props) {
    const { horizontalFill, fillOpacity, x, y, width, height, horizontalPoints, horizontal = true } = props;
    if (!horizontal || !horizontalFill || !horizontalFill.length) {
        return null;
    }
    const roundedSortedHorizontalPoints = horizontalPoints.map(e => Math.round(e + y - y)).sort((a, b) => a - b);
    if (y !== roundedSortedHorizontalPoints[0]) {
        roundedSortedHorizontalPoints.unshift(0);
    }
    const items = roundedSortedHorizontalPoints.map((entry, i) => {
        const lastStripe = !roundedSortedHorizontalPoints[i + 1];
        const lineHeight = lastStripe ? y + height - entry : roundedSortedHorizontalPoints[i + 1] - entry;
        if (lineHeight <= 0) {
            return null;
        }
        const colorIndex = i % horizontalFill.length;
        return (react_1.default.createElement("rect", { key: `react-${i}`, y: entry, x: x, height: lineHeight, width: width, stroke: "none", fill: horizontalFill[colorIndex], fillOpacity: fillOpacity, className: "recharts-cartesian-grid-bg" }));
    });
    return react_1.default.createElement("g", { className: "recharts-cartesian-gridstripes-horizontal" }, items);
}
function VerticalStripes(props) {
    const { vertical = true, verticalFill, fillOpacity, x, y, width, height, verticalPoints } = props;
    if (!vertical || !verticalFill || !verticalFill.length) {
        return null;
    }
    const roundedSortedVerticalPoints = verticalPoints.map(e => Math.round(e + x - x)).sort((a, b) => a - b);
    if (x !== roundedSortedVerticalPoints[0]) {
        roundedSortedVerticalPoints.unshift(0);
    }
    const items = roundedSortedVerticalPoints.map((entry, i) => {
        const lastStripe = !roundedSortedVerticalPoints[i + 1];
        const lineWidth = lastStripe ? x + width - entry : roundedSortedVerticalPoints[i + 1] - entry;
        if (lineWidth <= 0) {
            return null;
        }
        const colorIndex = i % verticalFill.length;
        return (react_1.default.createElement("rect", { key: `react-${i}`, x: entry, y: y, width: lineWidth, height: height, stroke: "none", fill: verticalFill[colorIndex], fillOpacity: fillOpacity, className: "recharts-cartesian-grid-bg" }));
    });
    return react_1.default.createElement("g", { className: "recharts-cartesian-gridstripes-vertical" }, items);
}
const defaultVerticalCoordinatesGenerator = ({ xAxis, width, height, offset }, syncWithTicks) => (0, ChartUtils_1.getCoordinatesOfGrid)((0, getTicks_1.getTicks)(Object.assign(Object.assign(Object.assign({}, CartesianAxis_1.CartesianAxis.defaultProps), xAxis), { ticks: (0, ChartUtils_1.getTicksOfAxis)(xAxis, true), viewBox: { x: 0, y: 0, width, height } })), offset.left, offset.left + offset.width, syncWithTicks);
const defaultHorizontalCoordinatesGenerator = ({ yAxis, width, height, offset }, syncWithTicks) => (0, ChartUtils_1.getCoordinatesOfGrid)((0, getTicks_1.getTicks)(Object.assign(Object.assign(Object.assign({}, CartesianAxis_1.CartesianAxis.defaultProps), yAxis), { ticks: (0, ChartUtils_1.getTicksOfAxis)(yAxis, true), viewBox: { x: 0, y: 0, width, height } })), offset.top, offset.top + offset.height, syncWithTicks);
const defaultProps = {
    horizontal: true,
    vertical: true,
    horizontalPoints: [],
    verticalPoints: [],
    stroke: '#ccc',
    fill: 'none',
    verticalFill: [],
    horizontalFill: [],
};
function CartesianGrid(props) {
    var _a, _b, _c, _d, _e, _f;
    const chartWidth = (0, chartLayoutContext_1.useChartWidth)();
    const chartHeight = (0, chartLayoutContext_1.useChartHeight)();
    const offset = (0, chartLayoutContext_1.useOffset)();
    const propsIncludingDefaults = Object.assign(Object.assign({}, props), { stroke: (_a = props.stroke) !== null && _a !== void 0 ? _a : defaultProps.stroke, fill: (_b = props.fill) !== null && _b !== void 0 ? _b : defaultProps.fill, horizontal: (_c = props.horizontal) !== null && _c !== void 0 ? _c : defaultProps.horizontal, horizontalFill: (_d = props.horizontalFill) !== null && _d !== void 0 ? _d : defaultProps.horizontalFill, vertical: (_e = props.vertical) !== null && _e !== void 0 ? _e : defaultProps.vertical, verticalFill: (_f = props.verticalFill) !== null && _f !== void 0 ? _f : defaultProps.verticalFill, x: (0, DataUtils_1.isNumber)(props.x) ? props.x : offset.left, y: (0, DataUtils_1.isNumber)(props.y) ? props.y : offset.top, width: (0, DataUtils_1.isNumber)(props.width) ? props.width : offset.width, height: (0, DataUtils_1.isNumber)(props.height) ? props.height : offset.height });
    const { x, y, width, height, syncWithTicks, horizontalValues, verticalValues } = propsIncludingDefaults;
    const xAxis = (0, chartLayoutContext_1.useArbitraryXAxis)();
    const yAxis = (0, chartLayoutContext_1.useYAxisWithFiniteDomainOrRandom)();
    if (!(0, DataUtils_1.isNumber)(width) ||
        width <= 0 ||
        !(0, DataUtils_1.isNumber)(height) ||
        height <= 0 ||
        !(0, DataUtils_1.isNumber)(x) ||
        x !== +x ||
        !(0, DataUtils_1.isNumber)(y) ||
        y !== +y) {
        return null;
    }
    const verticalCoordinatesGenerator = propsIncludingDefaults.verticalCoordinatesGenerator || defaultVerticalCoordinatesGenerator;
    const horizontalCoordinatesGenerator = propsIncludingDefaults.horizontalCoordinatesGenerator || defaultHorizontalCoordinatesGenerator;
    let { horizontalPoints, verticalPoints } = propsIncludingDefaults;
    if ((!horizontalPoints || !horizontalPoints.length) && (0, isFunction_1.default)(horizontalCoordinatesGenerator)) {
        const isHorizontalValues = horizontalValues && horizontalValues.length;
        const generatorResult = horizontalCoordinatesGenerator({
            yAxis: yAxis
                ? Object.assign(Object.assign({}, yAxis), { ticks: isHorizontalValues ? horizontalValues : yAxis.ticks }) : undefined,
            width: chartWidth,
            height: chartHeight,
            offset,
        }, isHorizontalValues ? true : syncWithTicks);
        (0, LogUtils_1.warn)(Array.isArray(generatorResult), `horizontalCoordinatesGenerator should return Array but instead it returned [${typeof generatorResult}]`);
        if (Array.isArray(generatorResult)) {
            horizontalPoints = generatorResult;
        }
    }
    if ((!verticalPoints || !verticalPoints.length) && (0, isFunction_1.default)(verticalCoordinatesGenerator)) {
        const isVerticalValues = verticalValues && verticalValues.length;
        const generatorResult = verticalCoordinatesGenerator({
            xAxis: xAxis
                ? Object.assign(Object.assign({}, xAxis), { ticks: isVerticalValues ? verticalValues : xAxis.ticks }) : undefined,
            width: chartWidth,
            height: chartHeight,
            offset,
        }, isVerticalValues ? true : syncWithTicks);
        (0, LogUtils_1.warn)(Array.isArray(generatorResult), `verticalCoordinatesGenerator should return Array but instead it returned [${typeof generatorResult}]`);
        if (Array.isArray(generatorResult)) {
            verticalPoints = generatorResult;
        }
    }
    return (react_1.default.createElement("g", { className: "recharts-cartesian-grid" },
        react_1.default.createElement(Background, { fill: propsIncludingDefaults.fill, fillOpacity: propsIncludingDefaults.fillOpacity, x: propsIncludingDefaults.x, y: propsIncludingDefaults.y, width: propsIncludingDefaults.width, height: propsIncludingDefaults.height }),
        react_1.default.createElement(HorizontalGridLines, Object.assign({}, propsIncludingDefaults, { offset: offset, horizontalPoints: horizontalPoints, xAxis: xAxis, yAxis: yAxis })),
        react_1.default.createElement(VerticalGridLines, Object.assign({}, propsIncludingDefaults, { offset: offset, verticalPoints: verticalPoints, xAxis: xAxis, yAxis: yAxis })),
        react_1.default.createElement(HorizontalStripes, Object.assign({}, propsIncludingDefaults, { horizontalPoints: horizontalPoints })),
        react_1.default.createElement(VerticalStripes, Object.assign({}, propsIncludingDefaults, { verticalPoints: verticalPoints }))));
}
exports.CartesianGrid = CartesianGrid;
CartesianGrid.displayName = 'CartesianGrid';
//# sourceMappingURL=CartesianGrid.js.map