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
exports.CartesianAxis = void 0;
const react_1 = __importStar(require("react"));
const isFunction_1 = __importDefault(require("lodash/isFunction"));
const get_1 = __importDefault(require("lodash/get"));
const clsx_1 = __importDefault(require("clsx"));
const ShallowEqual_1 = require("../util/ShallowEqual");
const Layer_1 = require("../container/Layer");
const Text_1 = require("../component/Text");
const Label_1 = require("../component/Label");
const DataUtils_1 = require("../util/DataUtils");
const types_1 = require("../util/types");
const ReactUtils_1 = require("../util/ReactUtils");
const getTicks_1 = require("./getTicks");
class CartesianAxis extends react_1.Component {
    constructor(props) {
        super(props);
        this.state = { fontSize: '', letterSpacing: '' };
    }
    shouldComponentUpdate(_a, nextState) {
        var { viewBox } = _a, restProps = __rest(_a, ["viewBox"]);
        const _b = this.props, { viewBox: viewBoxOld } = _b, restPropsOld = __rest(_b, ["viewBox"]);
        return (!(0, ShallowEqual_1.shallowEqual)(viewBox, viewBoxOld) ||
            !(0, ShallowEqual_1.shallowEqual)(restProps, restPropsOld) ||
            !(0, ShallowEqual_1.shallowEqual)(nextState, this.state));
    }
    componentDidMount() {
        const htmlLayer = this.layerReference;
        if (!htmlLayer)
            return;
        const tick = htmlLayer.getElementsByClassName('recharts-cartesian-axis-tick-value')[0];
        if (tick) {
            this.setState({
                fontSize: window.getComputedStyle(tick).fontSize,
                letterSpacing: window.getComputedStyle(tick).letterSpacing,
            });
        }
    }
    getTickLineCoord(data) {
        const { x, y, width, height, orientation, tickSize, mirror, tickMargin } = this.props;
        let x1, x2, y1, y2, tx, ty;
        const sign = mirror ? -1 : 1;
        const finalTickSize = data.tickSize || tickSize;
        const tickCoord = (0, DataUtils_1.isNumber)(data.tickCoord) ? data.tickCoord : data.coordinate;
        switch (orientation) {
            case 'top':
                x1 = x2 = data.coordinate;
                y2 = y + +!mirror * height;
                y1 = y2 - sign * finalTickSize;
                ty = y1 - sign * tickMargin;
                tx = tickCoord;
                break;
            case 'left':
                y1 = y2 = data.coordinate;
                x2 = x + +!mirror * width;
                x1 = x2 - sign * finalTickSize;
                tx = x1 - sign * tickMargin;
                ty = tickCoord;
                break;
            case 'right':
                y1 = y2 = data.coordinate;
                x2 = x + +mirror * width;
                x1 = x2 + sign * finalTickSize;
                tx = x1 + sign * tickMargin;
                ty = tickCoord;
                break;
            default:
                x1 = x2 = data.coordinate;
                y2 = y + +mirror * height;
                y1 = y2 + sign * finalTickSize;
                ty = y1 + sign * tickMargin;
                tx = tickCoord;
                break;
        }
        return { line: { x1, y1, x2, y2 }, tick: { x: tx, y: ty } };
    }
    getTickTextAnchor() {
        const { orientation, mirror } = this.props;
        let textAnchor;
        switch (orientation) {
            case 'left':
                textAnchor = mirror ? 'start' : 'end';
                break;
            case 'right':
                textAnchor = mirror ? 'end' : 'start';
                break;
            default:
                textAnchor = 'middle';
                break;
        }
        return textAnchor;
    }
    getTickVerticalAnchor() {
        const { orientation, mirror } = this.props;
        let verticalAnchor = 'end';
        switch (orientation) {
            case 'left':
            case 'right':
                verticalAnchor = 'middle';
                break;
            case 'top':
                verticalAnchor = mirror ? 'start' : 'end';
                break;
            default:
                verticalAnchor = mirror ? 'end' : 'start';
                break;
        }
        return verticalAnchor;
    }
    renderAxisLine() {
        const { x, y, width, height, orientation, mirror, axisLine } = this.props;
        let props = Object.assign(Object.assign(Object.assign({}, (0, ReactUtils_1.filterProps)(this.props, false)), (0, ReactUtils_1.filterProps)(axisLine, false)), { fill: 'none' });
        if (orientation === 'top' || orientation === 'bottom') {
            const needHeight = +((orientation === 'top' && !mirror) || (orientation === 'bottom' && mirror));
            props = Object.assign(Object.assign({}, props), { x1: x, y1: y + needHeight * height, x2: x + width, y2: y + needHeight * height });
        }
        else {
            const needWidth = +((orientation === 'left' && !mirror) || (orientation === 'right' && mirror));
            props = Object.assign(Object.assign({}, props), { x1: x + needWidth * width, y1: y, x2: x + needWidth * width, y2: y + height });
        }
        return react_1.default.createElement("line", Object.assign({}, props, { className: (0, clsx_1.default)('recharts-cartesian-axis-line', (0, get_1.default)(axisLine, 'className')) }));
    }
    static renderTickItem(option, props, value) {
        let tickItem;
        if (react_1.default.isValidElement(option)) {
            tickItem = react_1.default.cloneElement(option, props);
        }
        else if ((0, isFunction_1.default)(option)) {
            tickItem = option(props);
        }
        else {
            tickItem = (react_1.default.createElement(Text_1.Text, Object.assign({}, props, { className: "recharts-cartesian-axis-tick-value" }), value));
        }
        return tickItem;
    }
    renderTicks(ticks, fontSize, letterSpacing) {
        const { tickLine, stroke, tick, tickFormatter, unit } = this.props;
        const finalTicks = (0, getTicks_1.getTicks)(Object.assign(Object.assign({}, this.props), { ticks }), fontSize, letterSpacing);
        const textAnchor = this.getTickTextAnchor();
        const verticalAnchor = this.getTickVerticalAnchor();
        const axisProps = (0, ReactUtils_1.filterProps)(this.props, false);
        const customTickProps = (0, ReactUtils_1.filterProps)(tick, false);
        const tickLineProps = Object.assign(Object.assign(Object.assign({}, axisProps), { fill: 'none' }), (0, ReactUtils_1.filterProps)(tickLine, false));
        const items = finalTicks.map((entry, i) => {
            const { line: lineCoord, tick: tickCoord } = this.getTickLineCoord(entry);
            const tickProps = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ textAnchor,
                verticalAnchor }, axisProps), { stroke: 'none', fill: stroke }), customTickProps), tickCoord), { index: i, payload: entry, visibleTicksCount: finalTicks.length, tickFormatter });
            return (react_1.default.createElement(Layer_1.Layer, Object.assign({ className: "recharts-cartesian-axis-tick", key: `tick-${entry.value}-${entry.coordinate}-${entry.tickCoord}` }, (0, types_1.adaptEventsOfChild)(this.props, entry, i)),
                tickLine && (react_1.default.createElement("line", Object.assign({}, tickLineProps, lineCoord, { className: (0, clsx_1.default)('recharts-cartesian-axis-tick-line', (0, get_1.default)(tickLine, 'className')) }))),
                tick &&
                    CartesianAxis.renderTickItem(tick, tickProps, `${(0, isFunction_1.default)(tickFormatter) ? tickFormatter(entry.value, i, finalTicks) : entry.value}${unit || ''}`)));
        });
        return react_1.default.createElement("g", { className: "recharts-cartesian-axis-ticks" }, items);
    }
    render() {
        const { axisLine, width, height, ticksGenerator, className, hide } = this.props;
        if (hide) {
            return null;
        }
        const _a = this.props, { ticks } = _a, noTicksProps = __rest(_a, ["ticks"]);
        let finalTicks = ticks;
        if ((0, isFunction_1.default)(ticksGenerator)) {
            finalTicks = ticks && ticks.length > 0 ? ticksGenerator(this.props) : ticksGenerator(noTicksProps);
        }
        if (width <= 0 || height <= 0 || !finalTicks || !finalTicks.length) {
            return null;
        }
        return (react_1.default.createElement(Layer_1.Layer, { className: (0, clsx_1.default)('recharts-cartesian-axis', className), ref: ref => {
                this.layerReference = ref;
            } },
            axisLine && this.renderAxisLine(),
            this.renderTicks(finalTicks, this.state.fontSize, this.state.letterSpacing),
            Label_1.Label.renderCallByParent(this.props)));
    }
}
exports.CartesianAxis = CartesianAxis;
CartesianAxis.displayName = 'CartesianAxis';
CartesianAxis.defaultProps = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    viewBox: { x: 0, y: 0, width: 0, height: 0 },
    orientation: 'bottom',
    ticks: [],
    stroke: '#666',
    tickLine: true,
    axisLine: true,
    tick: true,
    mirror: false,
    minTickGap: 5,
    tickSize: 6,
    tickMargin: 2,
    interval: 'preserveEnd',
};
//# sourceMappingURL=CartesianAxis.js.map