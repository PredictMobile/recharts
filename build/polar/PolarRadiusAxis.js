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
exports.PolarRadiusAxis = exports.PolarRadiusAxisWrapper = void 0;
const react_1 = __importStar(require("react"));
const maxBy_1 = __importDefault(require("lodash/maxBy"));
const minBy_1 = __importDefault(require("lodash/minBy"));
const isFunction_1 = __importDefault(require("lodash/isFunction"));
const clsx_1 = __importDefault(require("clsx"));
const chartLayoutContext_1 = require("../context/chartLayoutContext");
const Text_1 = require("../component/Text");
const Label_1 = require("../component/Label");
const Layer_1 = require("../container/Layer");
const PolarUtils_1 = require("../util/PolarUtils");
const types_1 = require("../util/types");
const ReactUtils_1 = require("../util/ReactUtils");
const ChartUtils_1 = require("../util/ChartUtils");
const AXIS_TYPE = 'radiusAxis';
const PolarRadiusAxisWrapper = defaultsAndInputs => {
    var _a;
    const { radiusAxisId } = defaultsAndInputs;
    const axisOptions = (0, chartLayoutContext_1.useMaybePolarRadiusAxis)(radiusAxisId);
    const props = Object.assign(Object.assign({}, defaultsAndInputs), axisOptions);
    const { tick, axisLine } = props;
    const ticks = (_a = (0, ChartUtils_1.getTicksOfAxis)(axisOptions, true)) !== null && _a !== void 0 ? _a : defaultsAndInputs.ticks;
    if (!ticks || !ticks.length) {
        return null;
    }
    const getTickValueCoord = ({ coordinate }) => {
        const { angle, cx, cy } = props;
        return (0, PolarUtils_1.polarToCartesian)(cx, cy, coordinate, angle);
    };
    const getTickTextAnchor = () => {
        const { orientation } = props;
        let textAnchor;
        switch (orientation) {
            case 'left':
                textAnchor = 'end';
                break;
            case 'right':
                textAnchor = 'start';
                break;
            default:
                textAnchor = 'middle';
                break;
        }
        return textAnchor;
    };
    const getViewBox = () => {
        const { cx, cy, angle } = props;
        const maxRadiusTick = (0, maxBy_1.default)(ticks, (entry) => entry.coordinate || 0);
        const minRadiusTick = (0, minBy_1.default)(ticks, (entry) => entry.coordinate || 0);
        return {
            cx,
            cy,
            startAngle: angle,
            endAngle: angle,
            innerRadius: minRadiusTick.coordinate || 0,
            outerRadius: maxRadiusTick.coordinate || 0,
        };
    };
    const renderAxisLine = () => {
        const { cx, cy, angle } = props, others = __rest(props, ["cx", "cy", "angle"]);
        const extent = ticks.reduce((result, entry) => [Math.min(result[0], entry.coordinate), Math.max(result[1], entry.coordinate)], [Infinity, -Infinity]);
        const point0 = (0, PolarUtils_1.polarToCartesian)(cx, cy, extent[0], angle);
        const point1 = (0, PolarUtils_1.polarToCartesian)(cx, cy, extent[1], angle);
        const axisLineProps = Object.assign(Object.assign(Object.assign(Object.assign({}, (0, ReactUtils_1.filterProps)(others, false)), { fill: 'none' }), (0, ReactUtils_1.filterProps)(axisLine, false)), { x1: point0.x, y1: point0.y, x2: point1.x, y2: point1.y });
        return react_1.default.createElement("line", Object.assign({ className: "recharts-polar-radius-axis-line" }, axisLineProps));
    };
    const renderTickItem = (option, tickProps, value) => {
        let tickItem;
        if (react_1.default.isValidElement(option)) {
            tickItem = react_1.default.cloneElement(option, tickProps);
        }
        else if ((0, isFunction_1.default)(option)) {
            tickItem = option(tickProps);
        }
        else {
            tickItem = (react_1.default.createElement(Text_1.Text, Object.assign({}, tickProps, { className: "recharts-polar-radius-axis-tick-value" }), value));
        }
        return tickItem;
    };
    const renderTicks = () => {
        const { angle, tickFormatter, stroke } = props, others = __rest(props, ["angle", "tickFormatter", "stroke"]);
        const textAnchor = getTickTextAnchor();
        const axisProps = (0, ReactUtils_1.filterProps)(others, false);
        const customTickProps = (0, ReactUtils_1.filterProps)(tick, false);
        const items = ticks.map((entry, i) => {
            const coord = getTickValueCoord(entry);
            const tickProps = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ textAnchor, transform: `rotate(${90 - angle}, ${coord.x}, ${coord.y})` }, axisProps), { stroke: 'none', fill: stroke }), customTickProps), { index: i }), coord), { payload: entry });
            return (react_1.default.createElement(Layer_1.Layer, Object.assign({ className: (0, clsx_1.default)('recharts-polar-radius-axis-tick', (0, PolarUtils_1.getTickClassName)(tick)), key: `tick-${entry.coordinate}` }, (0, types_1.adaptEventsOfChild)(props, entry, i)), renderTickItem(tick, tickProps, tickFormatter ? tickFormatter(entry.value, i, ticks) : entry.value)));
        });
        return react_1.default.createElement(Layer_1.Layer, { className: "recharts-polar-radius-axis-ticks" }, items);
    };
    return (react_1.default.createElement(Layer_1.Layer, { className: (0, clsx_1.default)('recharts-polar-radius-axis', AXIS_TYPE, props.className) },
        axisLine && renderAxisLine(),
        tick && renderTicks(),
        Label_1.Label.renderCallByParent(props, getViewBox())));
};
exports.PolarRadiusAxisWrapper = PolarRadiusAxisWrapper;
class PolarRadiusAxis extends react_1.PureComponent {
    render() {
        return react_1.default.createElement(exports.PolarRadiusAxisWrapper, Object.assign({}, this.props));
    }
}
exports.PolarRadiusAxis = PolarRadiusAxis;
PolarRadiusAxis.displayName = 'PolarRadiusAxis';
PolarRadiusAxis.axisType = AXIS_TYPE;
PolarRadiusAxis.defaultProps = {
    type: 'number',
    radiusAxisId: 0,
    cx: 0,
    cy: 0,
    angle: 0,
    orientation: 'right',
    stroke: '#ccc',
    axisLine: true,
    tick: true,
    tickCount: 5,
    allowDataOverflow: false,
    scale: 'auto',
    allowDuplicatedCategory: true,
};
//# sourceMappingURL=PolarRadiusAxis.js.map