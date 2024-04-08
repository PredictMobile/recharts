"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolarAngleAxis = exports.PolarAngleAxisWrapper = void 0;
const react_1 = __importStar(require("react"));
const isFunction_1 = __importDefault(require("lodash/isFunction"));
const clsx_1 = __importDefault(require("clsx"));
const Layer_1 = require("../container/Layer");
const Dot_1 = require("../shape/Dot");
const Polygon_1 = require("../shape/Polygon");
const Text_1 = require("../component/Text");
const types_1 = require("../util/types");
const ReactUtils_1 = require("../util/ReactUtils");
const PolarUtils_1 = require("../util/PolarUtils");
const ChartUtils_1 = require("../util/ChartUtils");
const chartLayoutContext_1 = require("../context/chartLayoutContext");
const RADIAN = Math.PI / 180;
const eps = 1e-5;
const AXIS_TYPE = 'angleAxis';
const PolarAngleAxisWrapper = defaultsAndInputs => {
    var _a;
    const { angleAxisId } = defaultsAndInputs;
    const axisOptions = (0, chartLayoutContext_1.useMaybePolarAngleAxis)(angleAxisId);
    const props = Object.assign(Object.assign({}, defaultsAndInputs), axisOptions);
    const { axisLine } = props;
    const ticks = (_a = (0, ChartUtils_1.getTicksOfAxis)(axisOptions, true)) !== null && _a !== void 0 ? _a : defaultsAndInputs.ticks;
    if (!ticks || !ticks.length) {
        return null;
    }
    const getTickLineCoord = (data) => {
        const { cx, cy, radius, orientation, tickSize } = props;
        const tickLineSize = tickSize || 8;
        const p1 = (0, PolarUtils_1.polarToCartesian)(cx, cy, radius, data.coordinate);
        const p2 = (0, PolarUtils_1.polarToCartesian)(cx, cy, radius + (orientation === 'inner' ? -1 : 1) * tickLineSize, data.coordinate);
        return { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y };
    };
    const getTickTextAnchor = (data) => {
        const { orientation } = props;
        const cos = Math.cos(-data.coordinate * RADIAN);
        let textAnchor;
        if (cos > eps) {
            textAnchor = orientation === 'outer' ? 'start' : 'end';
        }
        else if (cos < -eps) {
            textAnchor = orientation === 'outer' ? 'end' : 'start';
        }
        else {
            textAnchor = 'middle';
        }
        return textAnchor;
    };
    const renderAxisLine = () => {
        const { cx, cy, radius, axisLineType } = props;
        const axisLineProps = Object.assign(Object.assign(Object.assign({}, (0, ReactUtils_1.filterProps)(props, false)), { fill: 'none' }), (0, ReactUtils_1.filterProps)(axisLine, false));
        if (axisLineType === 'circle') {
            return react_1.default.createElement(Dot_1.Dot, Object.assign({ className: "recharts-polar-angle-axis-line" }, axisLineProps, { cx: cx, cy: cy, r: radius }));
        }
        const points = ticks.map(entry => (0, PolarUtils_1.polarToCartesian)(cx, cy, radius, entry.coordinate));
        return react_1.default.createElement(Polygon_1.Polygon, Object.assign({ className: "recharts-polar-angle-axis-line" }, axisLineProps, { points: points }));
    };
    const renderTickItem = (option, tickProps, value) => {
        let tickItem;
        if (react_1.default.isValidElement(option)) {
            tickItem = react_1.default.cloneElement(option, tickProps);
        }
        else if ((0, isFunction_1.default)(option)) {
            tickItem = option(props);
        }
        else {
            tickItem = (react_1.default.createElement(Text_1.Text, Object.assign({}, tickProps, { className: "recharts-polar-angle-axis-tick-value" }), value));
        }
        return tickItem;
    };
    const renderTicks = () => {
        const { tick, tickLine, tickFormatter, stroke } = props;
        const axisProps = (0, ReactUtils_1.filterProps)(props, false);
        const customTickProps = (0, ReactUtils_1.filterProps)(tick, false);
        const tickLineProps = Object.assign(Object.assign(Object.assign({}, axisProps), { fill: 'none' }), (0, ReactUtils_1.filterProps)(tickLine, false));
        const items = ticks.map((entry, i) => {
            const lineCoord = getTickLineCoord(entry);
            const textAnchor = getTickTextAnchor(entry);
            const tickProps = Object.assign(Object.assign(Object.assign(Object.assign({ textAnchor }, axisProps), { stroke: 'none', fill: stroke }), customTickProps), { index: i, payload: entry, x: lineCoord.x2, y: lineCoord.y2 });
            return (react_1.default.createElement(Layer_1.Layer, Object.assign({ className: (0, clsx_1.default)('recharts-polar-angle-axis-tick', (0, PolarUtils_1.getTickClassName)(tick)), key: `tick-${entry.coordinate}` }, (0, types_1.adaptEventsOfChild)(props, entry, i)),
                tickLine && react_1.default.createElement("line", Object.assign({ className: "recharts-polar-angle-axis-tick-line" }, tickLineProps, lineCoord)),
                tick && renderTickItem(tick, tickProps, tickFormatter ? tickFormatter(entry.value, i, ticks) : entry.value)));
        });
        return react_1.default.createElement(Layer_1.Layer, { className: "recharts-polar-angle-axis-ticks" }, items);
    };
    return (react_1.default.createElement(Layer_1.Layer, { className: (0, clsx_1.default)('recharts-polar-angle-axis', AXIS_TYPE, props.className) },
        axisLine && renderAxisLine(),
        renderTicks()));
};
exports.PolarAngleAxisWrapper = PolarAngleAxisWrapper;
class PolarAngleAxis extends react_1.PureComponent {
    render() {
        if (this.props.radius <= 0)
            return null;
        return react_1.default.createElement(exports.PolarAngleAxisWrapper, Object.assign({}, this.props));
    }
}
exports.PolarAngleAxis = PolarAngleAxis;
PolarAngleAxis.displayName = 'PolarAngleAxis';
PolarAngleAxis.axisType = AXIS_TYPE;
PolarAngleAxis.defaultProps = {
    type: 'category',
    angleAxisId: 0,
    scale: 'auto',
    cx: 0,
    cy: 0,
    orientation: 'outer',
    axisLine: true,
    tickLine: true,
    tickSize: 8,
    tick: true,
    hide: false,
    allowDuplicatedCategory: true,
};
//# sourceMappingURL=PolarAngleAxis.js.map