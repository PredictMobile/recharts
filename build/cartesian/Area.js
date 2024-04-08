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
exports.Area = void 0;
const react_1 = __importStar(require("react"));
const clsx_1 = __importDefault(require("clsx"));
const react_smooth_1 = __importDefault(require("react-smooth"));
const isFunction_1 = __importDefault(require("lodash/isFunction"));
const max_1 = __importDefault(require("lodash/max"));
const isNil_1 = __importDefault(require("lodash/isNil"));
const isNaN_1 = __importDefault(require("lodash/isNaN"));
const isEqual_1 = __importDefault(require("lodash/isEqual"));
const Curve_1 = require("../shape/Curve");
const Dot_1 = require("../shape/Dot");
const Layer_1 = require("../container/Layer");
const LabelList_1 = require("../component/LabelList");
const Global_1 = require("../util/Global");
const DataUtils_1 = require("../util/DataUtils");
const ChartUtils_1 = require("../util/ChartUtils");
const ReactUtils_1 = require("../util/ReactUtils");
const legendPayloadContext_1 = require("../context/legendPayloadContext");
function getLegendItemColor(stroke, fill) {
    return stroke && stroke !== 'none' ? stroke : fill;
}
const computeLegendPayloadFromAreaData = (props) => {
    const { dataKey, name, stroke, fill, legendType, hide } = props;
    return [
        {
            inactive: hide,
            dataKey,
            type: legendType,
            color: getLegendItemColor(stroke, fill),
            value: name || dataKey,
            payload: props,
        },
    ];
};
function SetAreaLegend(props) {
    (0, legendPayloadContext_1.useLegendPayloadDispatch)(computeLegendPayloadFromAreaData, props);
    return null;
}
class Area extends react_1.PureComponent {
    constructor() {
        super(...arguments);
        this.state = {
            isAnimationFinished: true,
        };
        this.id = (0, DataUtils_1.uniqueId)('recharts-area-');
        this.handleAnimationEnd = () => {
            const { onAnimationEnd } = this.props;
            this.setState({ isAnimationFinished: true });
            if ((0, isFunction_1.default)(onAnimationEnd)) {
                onAnimationEnd();
            }
        };
        this.handleAnimationStart = () => {
            const { onAnimationStart } = this.props;
            this.setState({ isAnimationFinished: false });
            if ((0, isFunction_1.default)(onAnimationStart)) {
                onAnimationStart();
            }
        };
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.animationId !== prevState.prevAnimationId) {
            return {
                prevAnimationId: nextProps.animationId,
                curPoints: nextProps.points,
                curBaseLine: nextProps.baseLine,
                prevPoints: prevState.curPoints,
                prevBaseLine: prevState.curBaseLine,
            };
        }
        if (nextProps.points !== prevState.curPoints || nextProps.baseLine !== prevState.curBaseLine) {
            return {
                curPoints: nextProps.points,
                curBaseLine: nextProps.baseLine,
            };
        }
        return null;
    }
    renderDots(needClip, clipDot, clipPathId) {
        const { isAnimationActive } = this.props;
        const { isAnimationFinished } = this.state;
        if (isAnimationActive && !isAnimationFinished) {
            return null;
        }
        const { dot, points, dataKey } = this.props;
        const areaProps = (0, ReactUtils_1.filterProps)(this.props, false);
        const customDotProps = (0, ReactUtils_1.filterProps)(dot, true);
        const dots = points.map((entry, i) => {
            const dotProps = Object.assign(Object.assign(Object.assign({ key: `dot-${i}`, r: 3 }, areaProps), customDotProps), { dataKey, cx: entry.x, cy: entry.y, index: i, value: entry.value, payload: entry.payload });
            return Area.renderDotItem(dot, dotProps);
        });
        const dotsProps = {
            clipPath: needClip ? `url(#clipPath-${clipDot ? '' : 'dots-'}${clipPathId})` : null,
        };
        return (react_1.default.createElement(Layer_1.Layer, Object.assign({ className: "recharts-area-dots" }, dotsProps), dots));
    }
    renderHorizontalRect(alpha) {
        const { baseLine, points, strokeWidth } = this.props;
        const startX = points[0].x;
        const endX = points[points.length - 1].x;
        const width = alpha * Math.abs(startX - endX);
        let maxY = (0, max_1.default)(points.map(entry => entry.y || 0));
        if ((0, DataUtils_1.isNumber)(baseLine) && typeof baseLine === 'number') {
            maxY = Math.max(baseLine, maxY);
        }
        else if (baseLine && Array.isArray(baseLine) && baseLine.length) {
            maxY = Math.max((0, max_1.default)(baseLine.map(entry => entry.y || 0)), maxY);
        }
        if ((0, DataUtils_1.isNumber)(maxY)) {
            return (react_1.default.createElement("rect", { x: startX < endX ? startX : startX - width, y: 0, width: width, height: Math.floor(maxY + (strokeWidth ? parseInt(`${strokeWidth}`, 10) : 1)) }));
        }
        return null;
    }
    renderVerticalRect(alpha) {
        const { baseLine, points, strokeWidth } = this.props;
        const startY = points[0].y;
        const endY = points[points.length - 1].y;
        const height = alpha * Math.abs(startY - endY);
        let maxX = (0, max_1.default)(points.map(entry => entry.x || 0));
        if ((0, DataUtils_1.isNumber)(baseLine) && typeof baseLine === 'number') {
            maxX = Math.max(baseLine, maxX);
        }
        else if (baseLine && Array.isArray(baseLine) && baseLine.length) {
            maxX = Math.max((0, max_1.default)(baseLine.map(entry => entry.x || 0)), maxX);
        }
        if ((0, DataUtils_1.isNumber)(maxX)) {
            return (react_1.default.createElement("rect", { x: 0, y: startY < endY ? startY : startY - height, width: maxX + (strokeWidth ? parseInt(`${strokeWidth}`, 10) : 1), height: Math.floor(height) }));
        }
        return null;
    }
    renderClipRect(alpha) {
        const { layout } = this.props;
        if (layout === 'vertical') {
            return this.renderVerticalRect(alpha);
        }
        return this.renderHorizontalRect(alpha);
    }
    renderAreaStatically(points, baseLine, needClip, clipPathId) {
        const _a = this.props, { layout, type, stroke, connectNulls, isRange, ref } = _a, others = __rest(_a, ["layout", "type", "stroke", "connectNulls", "isRange", "ref"]);
        return (react_1.default.createElement(Layer_1.Layer, { clipPath: needClip ? `url(#clipPath-${clipPathId})` : null },
            react_1.default.createElement(Curve_1.Curve, Object.assign({}, (0, ReactUtils_1.filterProps)(others, true), { points: points, connectNulls: connectNulls, type: type, baseLine: baseLine, layout: layout, stroke: "none", className: "recharts-area-area" })),
            stroke !== 'none' && (react_1.default.createElement(Curve_1.Curve, Object.assign({}, (0, ReactUtils_1.filterProps)(this.props, false), { className: "recharts-area-curve", layout: layout, type: type, connectNulls: connectNulls, fill: "none", points: points }))),
            stroke !== 'none' && isRange && (react_1.default.createElement(Curve_1.Curve, Object.assign({}, (0, ReactUtils_1.filterProps)(this.props, false), { className: "recharts-area-curve", layout: layout, type: type, connectNulls: connectNulls, fill: "none", points: baseLine })))));
    }
    renderAreaWithAnimation(needClip, clipPathId) {
        const { points, baseLine, isAnimationActive, animationBegin, animationDuration, animationEasing, animationId } = this.props;
        const { prevPoints, prevBaseLine } = this.state;
        return (react_1.default.createElement(react_smooth_1.default, { begin: animationBegin, duration: animationDuration, isActive: isAnimationActive, easing: animationEasing, from: { t: 0 }, to: { t: 1 }, key: `area-${animationId}`, onAnimationEnd: this.handleAnimationEnd, onAnimationStart: this.handleAnimationStart }, ({ t }) => {
            if (prevPoints) {
                const prevPointsDiffFactor = prevPoints.length / points.length;
                const stepPoints = points.map((entry, index) => {
                    const prevPointIndex = Math.floor(index * prevPointsDiffFactor);
                    if (prevPoints[prevPointIndex]) {
                        const prev = prevPoints[prevPointIndex];
                        const interpolatorX = (0, DataUtils_1.interpolateNumber)(prev.x, entry.x);
                        const interpolatorY = (0, DataUtils_1.interpolateNumber)(prev.y, entry.y);
                        return Object.assign(Object.assign({}, entry), { x: interpolatorX(t), y: interpolatorY(t) });
                    }
                    return entry;
                });
                let stepBaseLine;
                if ((0, DataUtils_1.isNumber)(baseLine) && typeof baseLine === 'number') {
                    const interpolator = (0, DataUtils_1.interpolateNumber)(prevBaseLine, baseLine);
                    stepBaseLine = interpolator(t);
                }
                else if ((0, isNil_1.default)(baseLine) || (0, isNaN_1.default)(baseLine)) {
                    const interpolator = (0, DataUtils_1.interpolateNumber)(prevBaseLine, 0);
                    stepBaseLine = interpolator(t);
                }
                else {
                    stepBaseLine = baseLine.map((entry, index) => {
                        const prevPointIndex = Math.floor(index * prevPointsDiffFactor);
                        if (prevBaseLine[prevPointIndex]) {
                            const prev = prevBaseLine[prevPointIndex];
                            const interpolatorX = (0, DataUtils_1.interpolateNumber)(prev.x, entry.x);
                            const interpolatorY = (0, DataUtils_1.interpolateNumber)(prev.y, entry.y);
                            return Object.assign(Object.assign({}, entry), { x: interpolatorX(t), y: interpolatorY(t) });
                        }
                        return entry;
                    });
                }
                return this.renderAreaStatically(stepPoints, stepBaseLine, needClip, clipPathId);
            }
            return (react_1.default.createElement(Layer_1.Layer, null,
                react_1.default.createElement("defs", null,
                    react_1.default.createElement("clipPath", { id: `animationClipPath-${clipPathId}` }, this.renderClipRect(t))),
                react_1.default.createElement(Layer_1.Layer, { clipPath: `url(#animationClipPath-${clipPathId})` }, this.renderAreaStatically(points, baseLine, needClip, clipPathId))));
        }));
    }
    renderArea(needClip, clipPathId) {
        const { points, baseLine, isAnimationActive } = this.props;
        const { prevPoints, prevBaseLine, totalLength } = this.state;
        if (isAnimationActive &&
            points &&
            points.length &&
            ((!prevPoints && totalLength > 0) || !(0, isEqual_1.default)(prevPoints, points) || !(0, isEqual_1.default)(prevBaseLine, baseLine))) {
            return this.renderAreaWithAnimation(needClip, clipPathId);
        }
        return this.renderAreaStatically(points, baseLine, needClip, clipPathId);
    }
    render() {
        var _a;
        const { hide, dot, points, className, top, left, xAxis, yAxis, width, height, isAnimationActive, id } = this.props;
        if (hide || !points || !points.length) {
            return react_1.default.createElement(SetAreaLegend, Object.assign({}, this.props));
        }
        const { isAnimationFinished } = this.state;
        const hasSinglePoint = points.length === 1;
        const layerClass = (0, clsx_1.default)('recharts-area', className);
        const needClipX = xAxis && xAxis.allowDataOverflow;
        const needClipY = yAxis && yAxis.allowDataOverflow;
        const needClip = needClipX || needClipY;
        const clipPathId = (0, isNil_1.default)(id) ? this.id : id;
        const { r = 3, strokeWidth = 2 } = (_a = (0, ReactUtils_1.filterProps)(dot, false)) !== null && _a !== void 0 ? _a : { r: 3, strokeWidth: 2 };
        const { clipDot = true } = (0, ReactUtils_1.isDotProps)(dot) ? dot : {};
        const dotSize = r * 2 + strokeWidth;
        return (react_1.default.createElement(Layer_1.Layer, { className: layerClass },
            react_1.default.createElement(SetAreaLegend, Object.assign({}, this.props)),
            needClipX || needClipY ? (react_1.default.createElement("defs", null,
                react_1.default.createElement("clipPath", { id: `clipPath-${clipPathId}` },
                    react_1.default.createElement("rect", { x: needClipX ? left : left - width / 2, y: needClipY ? top : top - height / 2, width: needClipX ? width : width * 2, height: needClipY ? height : height * 2 })),
                !clipDot && (react_1.default.createElement("clipPath", { id: `clipPath-dots-${clipPathId}` },
                    react_1.default.createElement("rect", { x: left - dotSize / 2, y: top - dotSize / 2, width: width + dotSize, height: height + dotSize }))))) : null,
            !hasSinglePoint ? this.renderArea(needClip, clipPathId) : null,
            (dot || hasSinglePoint) && this.renderDots(needClip, clipDot, clipPathId),
            (!isAnimationActive || isAnimationFinished) && LabelList_1.LabelList.renderCallByParent(this.props, points)));
    }
}
exports.Area = Area;
Area.displayName = 'Area';
Area.defaultProps = {
    stroke: '#3182bd',
    fill: '#3182bd',
    fillOpacity: 0.6,
    xAxisId: 0,
    yAxisId: 0,
    legendType: 'line',
    connectNulls: false,
    points: [],
    dot: false,
    activeDot: true,
    hide: false,
    isAnimationActive: !Global_1.Global.isSsr,
    animationBegin: 0,
    animationDuration: 1500,
    animationEasing: 'ease',
};
Area.getBaseValue = (props, item, xAxis, yAxis) => {
    const { layout, baseValue: chartBaseValue } = props;
    const { baseValue: itemBaseValue } = item.props;
    const baseValue = itemBaseValue !== null && itemBaseValue !== void 0 ? itemBaseValue : chartBaseValue;
    if ((0, DataUtils_1.isNumber)(baseValue) && typeof baseValue === 'number') {
        return baseValue;
    }
    const numericAxis = layout === 'horizontal' ? yAxis : xAxis;
    const domain = numericAxis.scale.domain();
    if (numericAxis.type === 'number') {
        const domainMax = Math.max(domain[0], domain[1]);
        const domainMin = Math.min(domain[0], domain[1]);
        if (baseValue === 'dataMin') {
            return domainMin;
        }
        if (baseValue === 'dataMax') {
            return domainMax;
        }
        return domainMax < 0 ? domainMax : Math.max(Math.min(domain[0], domain[1]), 0);
    }
    if (baseValue === 'dataMin') {
        return domain[0];
    }
    if (baseValue === 'dataMax') {
        return domain[1];
    }
    return domain[0];
};
Area.getComposedData = ({ props, item, xAxis, yAxis, xAxisTicks, yAxisTicks, bandSize, dataKey, stackedData, dataStartIndex, displayedData, offset, }) => {
    const { layout } = props;
    const hasStack = stackedData && stackedData.length;
    const baseValue = Area.getBaseValue(props, item, xAxis, yAxis);
    const isHorizontalLayout = layout === 'horizontal';
    let isRange = false;
    const points = displayedData.map((entry, index) => {
        let value;
        if (hasStack) {
            value = stackedData[dataStartIndex + index];
        }
        else {
            value = (0, ChartUtils_1.getValueByDataKey)(entry, dataKey);
            if (!Array.isArray(value)) {
                value = [baseValue, value];
            }
            else {
                isRange = true;
            }
        }
        const isBreakPoint = value[1] == null || (hasStack && (0, ChartUtils_1.getValueByDataKey)(entry, dataKey) == null);
        if (isHorizontalLayout) {
            return {
                x: (0, ChartUtils_1.getCateCoordinateOfLine)({ axis: xAxis, ticks: xAxisTicks, bandSize, entry, index }),
                y: isBreakPoint ? null : yAxis.scale(value[1]),
                value,
                payload: entry,
            };
        }
        return {
            x: isBreakPoint ? null : xAxis.scale(value[1]),
            y: (0, ChartUtils_1.getCateCoordinateOfLine)({ axis: yAxis, ticks: yAxisTicks, bandSize, entry, index }),
            value,
            payload: entry,
        };
    });
    let baseLine;
    if (hasStack || isRange) {
        baseLine = points.map((entry) => {
            const x = Array.isArray(entry.value) ? entry.value[0] : null;
            if (isHorizontalLayout) {
                return {
                    x: entry.x,
                    y: x != null && entry.y != null ? yAxis.scale(x) : null,
                };
            }
            return {
                x: x != null ? xAxis.scale(x) : null,
                y: entry.y,
            };
        });
    }
    else {
        baseLine = isHorizontalLayout ? yAxis.scale(baseValue) : xAxis.scale(baseValue);
    }
    return Object.assign({ points, baseLine, layout, isRange }, offset);
};
Area.renderDotItem = (option, props) => {
    let dotItem;
    if (react_1.default.isValidElement(option)) {
        dotItem = react_1.default.cloneElement(option, props);
    }
    else if ((0, isFunction_1.default)(option)) {
        dotItem = option(props);
    }
    else {
        const className = (0, clsx_1.default)('recharts-area-dot', typeof option !== 'boolean' ? option.className : '');
        dotItem = react_1.default.createElement(Dot_1.Dot, Object.assign({}, props, { className: className }));
    }
    return dotItem;
};
//# sourceMappingURL=Area.js.map