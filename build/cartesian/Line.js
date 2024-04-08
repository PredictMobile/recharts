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
exports.Line = void 0;
const react_1 = __importStar(require("react"));
const react_smooth_1 = __importDefault(require("react-smooth"));
const isFunction_1 = __importDefault(require("lodash/isFunction"));
const isNil_1 = __importDefault(require("lodash/isNil"));
const isEqual_1 = __importDefault(require("lodash/isEqual"));
const clsx_1 = __importDefault(require("clsx"));
const Curve_1 = require("../shape/Curve");
const Dot_1 = require("../shape/Dot");
const Layer_1 = require("../container/Layer");
const LabelList_1 = require("../component/LabelList");
const ErrorBar_1 = require("./ErrorBar");
const DataUtils_1 = require("../util/DataUtils");
const ReactUtils_1 = require("../util/ReactUtils");
const Global_1 = require("../util/Global");
const ChartUtils_1 = require("../util/ChartUtils");
const legendPayloadContext_1 = require("../context/legendPayloadContext");
const computeLegendPayloadFromAreaData = (props) => {
    const { dataKey, name, stroke, legendType, hide } = props;
    return [
        {
            inactive: hide,
            dataKey,
            type: legendType,
            color: stroke,
            value: name || dataKey,
            payload: props,
        },
    ];
};
function SetLineLegend(props) {
    (0, legendPayloadContext_1.useLegendPayloadDispatch)(computeLegendPayloadFromAreaData, props);
    return null;
}
class Line extends react_1.PureComponent {
    constructor() {
        super(...arguments);
        this.state = {
            isAnimationFinished: true,
            totalLength: 0,
        };
        this.generateSimpleStrokeDasharray = (totalLength, length) => {
            return `${length}px ${totalLength - length}px`;
        };
        this.getStrokeDasharray = (length, totalLength, lines) => {
            const lineLength = lines.reduce((pre, next) => pre + next);
            if (!lineLength) {
                return this.generateSimpleStrokeDasharray(totalLength, length);
            }
            const count = Math.floor(length / lineLength);
            const remainLength = length % lineLength;
            const restLength = totalLength - length;
            let remainLines = [];
            for (let i = 0, sum = 0; i < lines.length; sum += lines[i], ++i) {
                if (sum + lines[i] > remainLength) {
                    remainLines = [...lines.slice(0, i), remainLength - sum];
                    break;
                }
            }
            const emptyLines = remainLines.length % 2 === 0 ? [0, restLength] : [restLength];
            return [...Line.repeat(lines, count), ...remainLines, ...emptyLines].map(line => `${line}px`).join(', ');
        };
        this.id = (0, DataUtils_1.uniqueId)('recharts-line-');
        this.pathRef = (node) => {
            this.mainCurve = node;
        };
        this.handleAnimationEnd = () => {
            this.setState({ isAnimationFinished: true });
            if (this.props.onAnimationEnd) {
                this.props.onAnimationEnd();
            }
        };
        this.handleAnimationStart = () => {
            this.setState({ isAnimationFinished: false });
            if (this.props.onAnimationStart) {
                this.props.onAnimationStart();
            }
        };
    }
    componentDidMount() {
        if (!this.props.isAnimationActive) {
            return;
        }
        const totalLength = this.getTotalLength();
        this.setState({ totalLength });
    }
    componentDidUpdate() {
        if (!this.props.isAnimationActive) {
            return;
        }
        const totalLength = this.getTotalLength();
        if (totalLength !== this.state.totalLength) {
            this.setState({ totalLength });
        }
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
    getTotalLength() {
        const curveDom = this.mainCurve;
        try {
            return (curveDom && curveDom.getTotalLength && curveDom.getTotalLength()) || 0;
        }
        catch (err) {
            return 0;
        }
    }
    static repeat(lines, count) {
        const linesUnit = lines.length % 2 !== 0 ? [...lines, 0] : lines;
        let result = [];
        for (let i = 0; i < count; ++i) {
            result = [...result, ...linesUnit];
        }
        return result;
    }
    renderErrorBar(needClip, clipPathId) {
        if (this.props.isAnimationActive && !this.state.isAnimationFinished) {
            return null;
        }
        const { points, xAxis, yAxis, layout, children } = this.props;
        const errorBarItems = (0, ReactUtils_1.findAllByType)(children, ErrorBar_1.ErrorBar);
        if (!errorBarItems) {
            return null;
        }
        const dataPointFormatter = (dataPoint, dataKey) => {
            return {
                x: dataPoint.x,
                y: dataPoint.y,
                value: dataPoint.value,
                errorVal: (0, ChartUtils_1.getValueByDataKey)(dataPoint.payload, dataKey),
            };
        };
        const errorBarProps = {
            clipPath: needClip ? `url(#clipPath-${clipPathId})` : null,
        };
        return (react_1.default.createElement(Layer_1.Layer, Object.assign({}, errorBarProps), errorBarItems.map((item) => react_1.default.cloneElement(item, {
            key: `bar-${item.props.dataKey}`,
            data: points,
            xAxis,
            yAxis,
            layout,
            dataPointFormatter,
        }))));
    }
    static renderDotItem(option, props) {
        let dotItem;
        if (react_1.default.isValidElement(option)) {
            dotItem = react_1.default.cloneElement(option, props);
        }
        else if ((0, isFunction_1.default)(option)) {
            dotItem = option(props);
        }
        else {
            const className = (0, clsx_1.default)('recharts-line-dot', typeof option !== 'boolean' ? option.className : '');
            dotItem = react_1.default.createElement(Dot_1.Dot, Object.assign({}, props, { className: className }));
        }
        return dotItem;
    }
    renderDots(needClip, clipDot, clipPathId) {
        const { isAnimationActive } = this.props;
        if (isAnimationActive && !this.state.isAnimationFinished) {
            return null;
        }
        const { dot, points, dataKey } = this.props;
        const lineProps = (0, ReactUtils_1.filterProps)(this.props, false);
        const customDotProps = (0, ReactUtils_1.filterProps)(dot, true);
        const dots = points.map((entry, i) => {
            const dotProps = Object.assign(Object.assign(Object.assign({ key: `dot-${i}`, r: 3 }, lineProps), customDotProps), { value: entry.value, dataKey, cx: entry.x, cy: entry.y, index: i, payload: entry.payload });
            return Line.renderDotItem(dot, dotProps);
        });
        const dotsProps = {
            clipPath: needClip ? `url(#clipPath-${clipDot ? '' : 'dots-'}${clipPathId})` : null,
        };
        return (react_1.default.createElement(Layer_1.Layer, Object.assign({ className: "recharts-line-dots", key: "dots" }, dotsProps), dots));
    }
    renderCurveStatically(points, needClip, clipPathId, props) {
        const _a = this.props, { type, layout, connectNulls, ref } = _a, others = __rest(_a, ["type", "layout", "connectNulls", "ref"]);
        const curveProps = Object.assign(Object.assign(Object.assign(Object.assign({}, (0, ReactUtils_1.filterProps)(others, true)), { fill: 'none', className: 'recharts-line-curve', clipPath: needClip ? `url(#clipPath-${clipPathId})` : null, points }), props), { type,
            layout,
            connectNulls });
        return react_1.default.createElement(Curve_1.Curve, Object.assign({}, curveProps, { pathRef: this.pathRef }));
    }
    renderCurveWithAnimation(needClip, clipPathId) {
        const { points, strokeDasharray, isAnimationActive, animationBegin, animationDuration, animationEasing, animationId, animateNewValues, width, height, } = this.props;
        const { prevPoints, totalLength } = this.state;
        return (react_1.default.createElement(react_smooth_1.default, { begin: animationBegin, duration: animationDuration, isActive: isAnimationActive, easing: animationEasing, from: { t: 0 }, to: { t: 1 }, key: `line-${animationId}`, onAnimationEnd: this.handleAnimationEnd, onAnimationStart: this.handleAnimationStart }, ({ t }) => {
            if (prevPoints) {
                const prevPointsDiffFactor = prevPoints.length / points.length;
                const stepData = points.map((entry, index) => {
                    const prevPointIndex = Math.floor(index * prevPointsDiffFactor);
                    if (prevPoints[prevPointIndex]) {
                        const prev = prevPoints[prevPointIndex];
                        const interpolatorX = (0, DataUtils_1.interpolateNumber)(prev.x, entry.x);
                        const interpolatorY = (0, DataUtils_1.interpolateNumber)(prev.y, entry.y);
                        return Object.assign(Object.assign({}, entry), { x: interpolatorX(t), y: interpolatorY(t) });
                    }
                    if (animateNewValues) {
                        const interpolatorX = (0, DataUtils_1.interpolateNumber)(width * 2, entry.x);
                        const interpolatorY = (0, DataUtils_1.interpolateNumber)(height / 2, entry.y);
                        return Object.assign(Object.assign({}, entry), { x: interpolatorX(t), y: interpolatorY(t) });
                    }
                    return Object.assign(Object.assign({}, entry), { x: entry.x, y: entry.y });
                });
                return this.renderCurveStatically(stepData, needClip, clipPathId);
            }
            const interpolator = (0, DataUtils_1.interpolateNumber)(0, totalLength);
            const curLength = interpolator(t);
            let currentStrokeDasharray;
            if (strokeDasharray) {
                const lines = `${strokeDasharray}`.split(/[,\s]+/gim).map(num => parseFloat(num));
                currentStrokeDasharray = this.getStrokeDasharray(curLength, totalLength, lines);
            }
            else {
                currentStrokeDasharray = this.generateSimpleStrokeDasharray(totalLength, curLength);
            }
            return this.renderCurveStatically(points, needClip, clipPathId, {
                strokeDasharray: currentStrokeDasharray,
            });
        }));
    }
    renderCurve(needClip, clipPathId) {
        const { points, isAnimationActive } = this.props;
        const { prevPoints, totalLength } = this.state;
        if (isAnimationActive &&
            points &&
            points.length &&
            ((!prevPoints && totalLength > 0) || !(0, isEqual_1.default)(prevPoints, points))) {
            return this.renderCurveWithAnimation(needClip, clipPathId);
        }
        return this.renderCurveStatically(points, needClip, clipPathId);
    }
    render() {
        var _a;
        const { hide, dot, points, className, xAxis, yAxis, top, left, width, height, isAnimationActive, id } = this.props;
        if (hide || !points || !points.length) {
            return react_1.default.createElement(SetLineLegend, Object.assign({}, this.props));
        }
        const { isAnimationFinished } = this.state;
        const hasSinglePoint = points.length === 1;
        const layerClass = (0, clsx_1.default)('recharts-line', className);
        const needClipX = xAxis && xAxis.allowDataOverflow;
        const needClipY = yAxis && yAxis.allowDataOverflow;
        const needClip = needClipX || needClipY;
        const clipPathId = (0, isNil_1.default)(id) ? this.id : id;
        const { r = 3, strokeWidth = 2 } = (_a = (0, ReactUtils_1.filterProps)(dot, false)) !== null && _a !== void 0 ? _a : { r: 3, strokeWidth: 2 };
        const { clipDot = true } = (0, ReactUtils_1.isDotProps)(dot) ? dot : {};
        const dotSize = r * 2 + strokeWidth;
        return (react_1.default.createElement(Layer_1.Layer, { className: layerClass },
            react_1.default.createElement(SetLineLegend, Object.assign({}, this.props)),
            needClipX || needClipY ? (react_1.default.createElement("defs", null,
                react_1.default.createElement("clipPath", { id: `clipPath-${clipPathId}` },
                    react_1.default.createElement("rect", { x: needClipX ? left : left - width / 2, y: needClipY ? top : top - height / 2, width: needClipX ? width : width * 2, height: needClipY ? height : height * 2 })),
                !clipDot && (react_1.default.createElement("clipPath", { id: `clipPath-dots-${clipPathId}` },
                    react_1.default.createElement("rect", { x: left - dotSize / 2, y: top - dotSize / 2, width: width + dotSize, height: height + dotSize }))))) : null,
            !hasSinglePoint && this.renderCurve(needClip, clipPathId),
            this.renderErrorBar(needClip, clipPathId),
            (hasSinglePoint || dot) && this.renderDots(needClip, clipDot, clipPathId),
            (!isAnimationActive || isAnimationFinished) && LabelList_1.LabelList.renderCallByParent(this.props, points)));
    }
}
exports.Line = Line;
Line.displayName = 'Line';
Line.defaultProps = {
    xAxisId: 0,
    yAxisId: 0,
    connectNulls: false,
    activeDot: true,
    dot: true,
    legendType: 'line',
    stroke: '#3182bd',
    strokeWidth: 1,
    fill: '#fff',
    points: [],
    isAnimationActive: !Global_1.Global.isSsr,
    animateNewValues: true,
    animationBegin: 0,
    animationDuration: 1500,
    animationEasing: 'ease',
    hide: false,
    label: false,
};
Line.getComposedData = ({ props, xAxis, yAxis, xAxisTicks, yAxisTicks, dataKey, bandSize, displayedData, offset, }) => {
    const { layout } = props;
    const points = displayedData.map((entry, index) => {
        const value = (0, ChartUtils_1.getValueByDataKey)(entry, dataKey);
        if (layout === 'horizontal') {
            return {
                x: (0, ChartUtils_1.getCateCoordinateOfLine)({ axis: xAxis, ticks: xAxisTicks, bandSize, entry, index }),
                y: (0, isNil_1.default)(value) ? null : yAxis.scale(value),
                value,
                payload: entry,
            };
        }
        return {
            x: (0, isNil_1.default)(value) ? null : xAxis.scale(value),
            y: (0, ChartUtils_1.getCateCoordinateOfLine)({ axis: yAxis, ticks: yAxisTicks, bandSize, entry, index }),
            value,
            payload: entry,
        };
    });
    return Object.assign({ points, layout }, offset);
};
//# sourceMappingURL=Line.js.map