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
exports.PolarGrid = void 0;
const clsx_1 = __importDefault(require("clsx"));
const react_1 = __importDefault(require("react"));
const ChartUtils_1 = require("../util/ChartUtils");
const chartLayoutContext_1 = require("../context/chartLayoutContext");
const PolarUtils_1 = require("../util/PolarUtils");
const ReactUtils_1 = require("../util/ReactUtils");
const getPolygonPath = (radius, cx, cy, polarAngles) => {
    let path = '';
    polarAngles.forEach((angle, i) => {
        const point = (0, PolarUtils_1.polarToCartesian)(cx, cy, radius, angle);
        if (i) {
            path += `L ${point.x},${point.y}`;
        }
        else {
            path += `M ${point.x},${point.y}`;
        }
    });
    path += 'Z';
    return path;
};
const PolarAngles = props => {
    const { cx, cy, innerRadius, outerRadius, polarAngles, radialLines } = props;
    if (!polarAngles || !polarAngles.length || !radialLines) {
        return null;
    }
    const polarAnglesProps = Object.assign({ stroke: '#ccc' }, (0, ReactUtils_1.filterProps)(props, false));
    return (react_1.default.createElement("g", { className: "recharts-polar-grid-angle" }, polarAngles.map(entry => {
        const start = (0, PolarUtils_1.polarToCartesian)(cx, cy, innerRadius, entry);
        const end = (0, PolarUtils_1.polarToCartesian)(cx, cy, outerRadius, entry);
        return react_1.default.createElement("line", Object.assign({}, polarAnglesProps, { key: `line-${entry}`, x1: start.x, y1: start.y, x2: end.x, y2: end.y }));
    })));
};
const ConcentricCircle = props => {
    const { cx, cy, radius, index } = props;
    const concentricCircleProps = Object.assign(Object.assign({ stroke: '#ccc' }, (0, ReactUtils_1.filterProps)(props, false)), { fill: 'none' });
    return (react_1.default.createElement("circle", Object.assign({}, concentricCircleProps, { className: (0, clsx_1.default)('recharts-polar-grid-concentric-circle', props.className), key: `circle-${index}`, cx: cx, cy: cy, r: radius })));
};
const ConcentricPolygon = props => {
    const { radius, index } = props;
    const concentricPolygonProps = Object.assign(Object.assign({ stroke: '#ccc' }, (0, ReactUtils_1.filterProps)(props, false)), { fill: 'none' });
    return (react_1.default.createElement("path", Object.assign({}, concentricPolygonProps, { className: (0, clsx_1.default)('recharts-polar-grid-concentric-polygon', props.className), key: `path-${index}`, d: getPolygonPath(radius, props.cx, props.cy, props.polarAngles) })));
};
const ConcentricGridPath = props => {
    const { polarRadius, gridType } = props;
    if (!polarRadius || !polarRadius.length) {
        return null;
    }
    return (react_1.default.createElement("g", { className: "recharts-polar-grid-concentric" }, polarRadius.map((entry, i) => {
        const key = i;
        if (gridType === 'circle')
            return react_1.default.createElement(ConcentricCircle, Object.assign({ key: key }, props, { radius: entry, index: i }));
        return react_1.default.createElement(ConcentricPolygon, Object.assign({ key: key }, props, { radius: entry, index: i }));
    })));
};
const PolarGrid = (_a) => {
    var _b, _c, _d, _e, _f, _g;
    var { gridType = 'polygon', radialLines = true } = _a, inputs = __rest(_a, ["gridType", "radialLines"]);
    const angleAxis = (0, chartLayoutContext_1.useArbitraryPolarAngleAxis)();
    const radiusAxis = (0, chartLayoutContext_1.useArbitraryPolarRadiusAxis)();
    const props = Object.assign({ cx: (_b = angleAxis === null || angleAxis === void 0 ? void 0 : angleAxis.cx) !== null && _b !== void 0 ? _b : 0, cy: (_c = angleAxis === null || angleAxis === void 0 ? void 0 : angleAxis.cy) !== null && _c !== void 0 ? _c : 0, innerRadius: (_d = angleAxis === null || angleAxis === void 0 ? void 0 : angleAxis.innerRadius) !== null && _d !== void 0 ? _d : 0, outerRadius: (_e = angleAxis === null || angleAxis === void 0 ? void 0 : angleAxis.outerRadius) !== null && _e !== void 0 ? _e : 0 }, inputs);
    const { polarAngles: polarAnglesInput, polarRadius: polarRadiusInput, cx, cy, innerRadius, outerRadius } = props;
    if (outerRadius <= 0) {
        return null;
    }
    const polarAngles = Array.isArray(polarAnglesInput)
        ? polarAnglesInput
        : (_f = (0, ChartUtils_1.getTicksOfAxis)(angleAxis, true)) === null || _f === void 0 ? void 0 : _f.map(entry => entry.coordinate);
    const polarRadius = Array.isArray(polarRadiusInput)
        ? polarRadiusInput
        : (_g = (0, ChartUtils_1.getTicksOfAxis)(radiusAxis, true)) === null || _g === void 0 ? void 0 : _g.map(entry => entry.coordinate);
    return (react_1.default.createElement("g", { className: "recharts-polar-grid" },
        react_1.default.createElement(PolarAngles, Object.assign({ cx: cx, cy: cy, innerRadius: innerRadius, outerRadius: outerRadius, gridType: gridType, radialLines: radialLines }, props, { polarAngles: polarAngles, polarRadius: polarRadius })),
        react_1.default.createElement(ConcentricGridPath, Object.assign({ cx: cx, cy: cy, innerRadius: innerRadius, outerRadius: outerRadius, gridType: gridType, radialLines: radialLines }, props, { polarAngles: polarAngles, polarRadius: polarRadius }))));
};
exports.PolarGrid = PolarGrid;
exports.PolarGrid.displayName = 'PolarGrid';
//# sourceMappingURL=PolarGrid.js.map