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
exports.Scatter = void 0;
const react_1 = __importStar(require("react"));
const react_smooth_1 = __importDefault(require("react-smooth"));
const isNil_1 = __importDefault(require("lodash/isNil"));
const isEqual_1 = __importDefault(require("lodash/isEqual"));
const isFunction_1 = __importDefault(require("lodash/isFunction"));
const clsx_1 = __importDefault(require("clsx"));
const Layer_1 = require("../container/Layer");
const LabelList_1 = require("../component/LabelList");
const ReactUtils_1 = require("../util/ReactUtils");
const Global_1 = require("../util/Global");
const ZAxis_1 = require("./ZAxis");
const Curve_1 = require("../shape/Curve");
const ErrorBar_1 = require("./ErrorBar");
const Cell_1 = require("../component/Cell");
const DataUtils_1 = require("../util/DataUtils");
const ChartUtils_1 = require("../util/ChartUtils");
const types_1 = require("../util/types");
const ScatterUtils_1 = require("../util/ScatterUtils");
const legendPayloadContext_1 = require("../context/legendPayloadContext");
const computeLegendPayloadFromScatterProps = (props) => {
    const { dataKey, name, fill, legendType, hide } = props;
    return [
        {
            inactive: hide,
            dataKey,
            type: legendType,
            color: fill,
            value: name || dataKey,
            payload: props,
        },
    ];
};
function SetScatterLegend(props) {
    (0, legendPayloadContext_1.useLegendPayloadDispatch)(computeLegendPayloadFromScatterProps, props);
    return null;
}
class Scatter extends react_1.PureComponent {
    constructor() {
        super(...arguments);
        this.state = { isAnimationFinished: false };
        this.handleAnimationEnd = () => {
            this.setState({ isAnimationFinished: true });
        };
        this.handleAnimationStart = () => {
            this.setState({ isAnimationFinished: false });
        };
        this.id = (0, DataUtils_1.uniqueId)('recharts-scatter-');
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.animationId !== prevState.prevAnimationId) {
            return {
                prevAnimationId: nextProps.animationId,
                curPoints: nextProps.points,
                prevPoints: prevState.curPoints,
            };
        }
        if (nextProps.points !== prevState.curPoints) {
            return {
                curPoints: nextProps.points,
            };
        }
        return null;
    }
    renderSymbolsStatically(points) {
        const { shape, activeShape, activeIndex } = this.props;
        const baseProps = (0, ReactUtils_1.filterProps)(this.props, false);
        return points.map((entry, i) => {
            const isActive = activeIndex === i;
            const option = isActive ? activeShape : shape;
            const props = Object.assign(Object.assign({ key: `symbol-${i}` }, baseProps), entry);
            return (react_1.default.createElement(Layer_1.Layer, Object.assign({ className: "recharts-scatter-symbol" }, (0, types_1.adaptEventsOfChild)(this.props, entry, i), { key: `symbol-${entry === null || entry === void 0 ? void 0 : entry.cx}-${entry === null || entry === void 0 ? void 0 : entry.cy}-${entry === null || entry === void 0 ? void 0 : entry.size}-${i}`, role: "img" }),
                react_1.default.createElement(ScatterUtils_1.ScatterSymbol, Object.assign({ option: option, isActive: isActive }, props))));
        });
    }
    renderSymbolsWithAnimation() {
        const { points, isAnimationActive, animationBegin, animationDuration, animationEasing, animationId } = this.props;
        const { prevPoints } = this.state;
        return (react_1.default.createElement(react_smooth_1.default, { begin: animationBegin, duration: animationDuration, isActive: isAnimationActive, easing: animationEasing, from: { t: 0 }, to: { t: 1 }, key: `pie-${animationId}`, onAnimationEnd: this.handleAnimationEnd, onAnimationStart: this.handleAnimationStart }, ({ t }) => {
            const stepData = points.map((entry, index) => {
                const prev = prevPoints && prevPoints[index];
                if (prev) {
                    const interpolatorCx = (0, DataUtils_1.interpolateNumber)(prev.cx, entry.cx);
                    const interpolatorCy = (0, DataUtils_1.interpolateNumber)(prev.cy, entry.cy);
                    const interpolatorSize = (0, DataUtils_1.interpolateNumber)(prev.size, entry.size);
                    return Object.assign(Object.assign({}, entry), { cx: interpolatorCx(t), cy: interpolatorCy(t), size: interpolatorSize(t) });
                }
                const interpolator = (0, DataUtils_1.interpolateNumber)(0, entry.size);
                return Object.assign(Object.assign({}, entry), { size: interpolator(t) });
            });
            return react_1.default.createElement(Layer_1.Layer, null, this.renderSymbolsStatically(stepData));
        }));
    }
    renderSymbols() {
        const { points, isAnimationActive } = this.props;
        const { prevPoints } = this.state;
        if (isAnimationActive && points && points.length && (!prevPoints || !(0, isEqual_1.default)(prevPoints, points))) {
            return this.renderSymbolsWithAnimation();
        }
        return this.renderSymbolsStatically(points);
    }
    renderErrorBar() {
        const { isAnimationActive } = this.props;
        if (isAnimationActive && !this.state.isAnimationFinished) {
            return null;
        }
        const { points, xAxis, yAxis, children } = this.props;
        const errorBarItems = (0, ReactUtils_1.findAllByType)(children, ErrorBar_1.ErrorBar);
        if (!errorBarItems) {
            return null;
        }
        return errorBarItems.map((item, i) => {
            const { direction, dataKey: errorDataKey } = item.props;
            return react_1.default.cloneElement(item, {
                key: `${direction}-${errorDataKey}-${points[i]}`,
                data: points,
                xAxis,
                yAxis,
                layout: direction === 'x' ? 'vertical' : 'horizontal',
                dataPointFormatter: (dataPoint, dataKey) => {
                    return {
                        x: dataPoint.cx,
                        y: dataPoint.cy,
                        value: direction === 'x' ? +dataPoint.node.x : +dataPoint.node.y,
                        errorVal: (0, ChartUtils_1.getValueByDataKey)(dataPoint, dataKey),
                    };
                },
            });
        });
    }
    renderLine() {
        const { points, line, lineType, lineJointType } = this.props;
        const scatterProps = (0, ReactUtils_1.filterProps)(this.props, false);
        const customLineProps = (0, ReactUtils_1.filterProps)(line, false);
        let linePoints, lineItem;
        if (lineType === 'joint') {
            linePoints = points.map(entry => ({ x: entry.cx, y: entry.cy }));
        }
        else if (lineType === 'fitting') {
            const { xmin, xmax, a, b } = (0, DataUtils_1.getLinearRegression)(points);
            const linearExp = (x) => a * x + b;
            linePoints = [
                { x: xmin, y: linearExp(xmin) },
                { x: xmax, y: linearExp(xmax) },
            ];
        }
        const lineProps = Object.assign(Object.assign(Object.assign(Object.assign({}, scatterProps), { fill: 'none', stroke: scatterProps && scatterProps.fill }), customLineProps), { points: linePoints });
        if (react_1.default.isValidElement(line)) {
            lineItem = react_1.default.cloneElement(line, lineProps);
        }
        else if ((0, isFunction_1.default)(line)) {
            lineItem = line(lineProps);
        }
        else {
            lineItem = react_1.default.createElement(Curve_1.Curve, Object.assign({}, lineProps, { type: lineJointType }));
        }
        return (react_1.default.createElement(Layer_1.Layer, { className: "recharts-scatter-line", key: "recharts-scatter-line" }, lineItem));
    }
    render() {
        const { hide, points, line, className, xAxis, yAxis, left, top, width, height, id, isAnimationActive } = this.props;
        if (hide || !points || !points.length) {
            return react_1.default.createElement(SetScatterLegend, Object.assign({}, this.props));
        }
        const { isAnimationFinished } = this.state;
        const layerClass = (0, clsx_1.default)('recharts-scatter', className);
        const needClipX = xAxis && xAxis.allowDataOverflow;
        const needClipY = yAxis && yAxis.allowDataOverflow;
        const needClip = needClipX || needClipY;
        const clipPathId = (0, isNil_1.default)(id) ? this.id : id;
        return (react_1.default.createElement(Layer_1.Layer, { className: layerClass, clipPath: needClip ? `url(#clipPath-${clipPathId})` : null },
            react_1.default.createElement(SetScatterLegend, Object.assign({}, this.props)),
            needClipX || needClipY ? (react_1.default.createElement("defs", null,
                react_1.default.createElement("clipPath", { id: `clipPath-${clipPathId}` },
                    react_1.default.createElement("rect", { x: needClipX ? left : left - width / 2, y: needClipY ? top : top - height / 2, width: needClipX ? width : width * 2, height: needClipY ? height : height * 2 })))) : null,
            line && this.renderLine(),
            this.renderErrorBar(),
            react_1.default.createElement(Layer_1.Layer, { key: "recharts-scatter-symbols" }, this.renderSymbols()),
            (!isAnimationActive || isAnimationFinished) && LabelList_1.LabelList.renderCallByParent(this.props, points)));
    }
}
exports.Scatter = Scatter;
Scatter.displayName = 'Scatter';
Scatter.defaultProps = {
    xAxisId: 0,
    yAxisId: 0,
    zAxisId: 0,
    legendType: 'circle',
    lineType: 'joint',
    lineJointType: 'linear',
    data: [],
    shape: 'circle',
    hide: false,
    isAnimationActive: !Global_1.Global.isSsr,
    animationBegin: 0,
    animationDuration: 400,
    animationEasing: 'linear',
};
Scatter.getComposedData = ({ xAxis, yAxis, zAxis, item, displayedData, xAxisTicks, yAxisTicks, offset, }) => {
    const { tooltipType } = item.props;
    const cells = (0, ReactUtils_1.findAllByType)(item.props.children, Cell_1.Cell);
    const xAxisDataKey = (0, isNil_1.default)(xAxis.dataKey) ? item.props.dataKey : xAxis.dataKey;
    const yAxisDataKey = (0, isNil_1.default)(yAxis.dataKey) ? item.props.dataKey : yAxis.dataKey;
    const zAxisDataKey = zAxis && zAxis.dataKey;
    const defaultRangeZ = zAxis ? zAxis.range : ZAxis_1.ZAxis.defaultProps.range;
    const defaultZ = defaultRangeZ && defaultRangeZ[0];
    const xBandSize = xAxis.scale.bandwidth ? xAxis.scale.bandwidth() : 0;
    const yBandSize = yAxis.scale.bandwidth ? yAxis.scale.bandwidth() : 0;
    const points = displayedData.map((entry, index) => {
        const x = (0, ChartUtils_1.getValueByDataKey)(entry, xAxisDataKey);
        const y = (0, ChartUtils_1.getValueByDataKey)(entry, yAxisDataKey);
        const z = (!(0, isNil_1.default)(zAxisDataKey) && (0, ChartUtils_1.getValueByDataKey)(entry, zAxisDataKey)) || '-';
        const tooltipPayload = [
            {
                name: (0, isNil_1.default)(xAxis.dataKey) ? item.props.name : xAxis.name || xAxis.dataKey,
                unit: xAxis.unit || '',
                value: x,
                payload: entry,
                dataKey: xAxisDataKey,
                type: tooltipType,
            },
            {
                name: (0, isNil_1.default)(yAxis.dataKey) ? item.props.name : yAxis.name || yAxis.dataKey,
                unit: yAxis.unit || '',
                value: y,
                payload: entry,
                dataKey: yAxisDataKey,
                type: tooltipType,
            },
        ];
        if (z !== '-') {
            tooltipPayload.push({
                name: zAxis.name || zAxis.dataKey,
                unit: zAxis.unit || '',
                value: z,
                payload: entry,
                dataKey: zAxisDataKey,
                type: tooltipType,
            });
        }
        const cx = (0, ChartUtils_1.getCateCoordinateOfLine)({
            axis: xAxis,
            ticks: xAxisTicks,
            bandSize: xBandSize,
            entry,
            index,
            dataKey: xAxisDataKey,
        });
        const cy = (0, ChartUtils_1.getCateCoordinateOfLine)({
            axis: yAxis,
            ticks: yAxisTicks,
            bandSize: yBandSize,
            entry,
            index,
            dataKey: yAxisDataKey,
        });
        const size = z !== '-' ? zAxis.scale(z) : defaultZ;
        const radius = Math.sqrt(Math.max(size, 0) / Math.PI);
        return Object.assign(Object.assign(Object.assign({}, entry), { cx,
            cy, x: cx - radius, y: cy - radius, xAxis,
            yAxis,
            zAxis, width: 2 * radius, height: 2 * radius, size, node: { x, y, z }, tooltipPayload, tooltipPosition: { x: cx, y: cy }, payload: entry }), (cells && cells[index] && cells[index].props));
    });
    return Object.assign({ points }, offset);
};
//# sourceMappingURL=Scatter.js.map