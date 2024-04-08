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
exports.ErrorBar = void 0;
const react_1 = __importDefault(require("react"));
const tiny_invariant_1 = __importDefault(require("tiny-invariant"));
const react_smooth_1 = __importDefault(require("react-smooth"));
const Layer_1 = require("../container/Layer");
const ReactUtils_1 = require("../util/ReactUtils");
function ErrorBar(props) {
    const { offset, layout, width, dataKey, data, dataPointFormatter, xAxis, yAxis, isAnimationActive, animationBegin, animationDuration, animationEasing } = props, others = __rest(props, ["offset", "layout", "width", "dataKey", "data", "dataPointFormatter", "xAxis", "yAxis", "isAnimationActive", "animationBegin", "animationDuration", "animationEasing"]);
    const svgProps = (0, ReactUtils_1.filterProps)(others, false);
    (0, tiny_invariant_1.default)(!(props.direction === 'x' && xAxis.type !== 'number'), 'ErrorBar requires Axis type property to be "number".');
    const errorBars = data.map((entry) => {
        const { x, y, value, errorVal } = dataPointFormatter(entry, dataKey);
        if (!errorVal) {
            return null;
        }
        const lineCoordinates = [];
        let lowBound, highBound;
        if (Array.isArray(errorVal)) {
            [lowBound, highBound] = errorVal;
        }
        else {
            lowBound = highBound = errorVal;
        }
        if (layout === 'vertical') {
            const { scale } = xAxis;
            const yMid = y + offset;
            const yMin = yMid + width;
            const yMax = yMid - width;
            const xMin = scale(value - lowBound);
            const xMax = scale(value + highBound);
            lineCoordinates.push({ x1: xMax, y1: yMin, x2: xMax, y2: yMax });
            lineCoordinates.push({ x1: xMin, y1: yMid, x2: xMax, y2: yMid });
            lineCoordinates.push({ x1: xMin, y1: yMin, x2: xMin, y2: yMax });
        }
        else if (layout === 'horizontal') {
            const { scale } = yAxis;
            const xMid = x + offset;
            const xMin = xMid - width;
            const xMax = xMid + width;
            const yMin = scale(value - lowBound);
            const yMax = scale(value + highBound);
            lineCoordinates.push({ x1: xMin, y1: yMax, x2: xMax, y2: yMax });
            lineCoordinates.push({ x1: xMid, y1: yMin, x2: xMid, y2: yMax });
            lineCoordinates.push({ x1: xMin, y1: yMin, x2: xMax, y2: yMin });
        }
        return (react_1.default.createElement(Layer_1.Layer, Object.assign({ className: "recharts-errorBar", key: `bar-${lineCoordinates.map(c => `${c.x1}-${c.x2}-${c.y1}-${c.y2}`)}` }, svgProps), lineCoordinates.map(coordinates => {
            const lineStyle = isAnimationActive ? { transformOrigin: `${coordinates.x1 - 5}px` } : undefined;
            return (react_1.default.createElement(react_smooth_1.default, { from: "scale(0, 1)", to: "scale(1, 1)", attributeName: "transform", begin: animationBegin, easing: animationEasing, isActive: isAnimationActive, duration: animationDuration, key: `line-${coordinates.x1}-${coordinates.x2}-${coordinates.y1}-${coordinates.y2}` },
                react_1.default.createElement("line", Object.assign({}, coordinates, { style: lineStyle }))));
        })));
    });
    return react_1.default.createElement(Layer_1.Layer, { className: "recharts-errorBars" }, errorBars);
}
exports.ErrorBar = ErrorBar;
ErrorBar.defaultProps = {
    stroke: 'black',
    strokeWidth: 1.5,
    width: 5,
    offset: 0,
    layout: 'horizontal',
    isAnimationActive: true,
    animationBegin: 0,
    animationDuration: 200,
    animationEasing: 'ease-in-out',
};
ErrorBar.displayName = 'ErrorBar';
//# sourceMappingURL=ErrorBar.js.map