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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bar = void 0;
const react_1 = __importStar(require("react"));
const clsx_1 = __importDefault(require("clsx"));
const react_smooth_1 = __importDefault(require("react-smooth"));
const isEqual_1 = __importDefault(require("lodash/isEqual"));
const isNil_1 = __importDefault(require("lodash/isNil"));
const Layer_1 = require("../container/Layer");
const ErrorBar_1 = require("./ErrorBar");
const Cell_1 = require("../component/Cell");
const LabelList_1 = require("../component/LabelList");
const DataUtils_1 = require("../util/DataUtils");
const ReactUtils_1 = require("../util/ReactUtils");
const Global_1 = require("../util/Global");
const ChartUtils_1 = require("../util/ChartUtils");
const types_1 = require("../util/types");
const BarUtils_1 = require("../util/BarUtils");
const legendPayloadContext_1 = require("../context/legendPayloadContext");
const computeLegendPayloadFromBarData = (props) => {
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
function SetBarLegend(props) {
    (0, legendPayloadContext_1.useLegendPayloadDispatch)(computeLegendPayloadFromBarData, props);
    return null;
}
class Bar extends react_1.PureComponent {
    constructor() {
        super(...arguments);
        this.state = { isAnimationFinished: false };
        this.id = (0, DataUtils_1.uniqueId)('recharts-bar-');
        this.handleAnimationEnd = () => {
            const { onAnimationEnd } = this.props;
            this.setState({ isAnimationFinished: true });
            if (onAnimationEnd) {
                onAnimationEnd();
            }
        };
        this.handleAnimationStart = () => {
            const { onAnimationStart } = this.props;
            this.setState({ isAnimationFinished: false });
            if (onAnimationStart) {
                onAnimationStart();
            }
        };
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.animationId !== prevState.prevAnimationId) {
            return {
                prevAnimationId: nextProps.animationId,
                curData: nextProps.data,
                prevData: prevState.curData,
            };
        }
        if (nextProps.data !== prevState.curData) {
            return {
                curData: nextProps.data,
            };
        }
        return null;
    }
    renderRectanglesStatically(data) {
        const { shape, dataKey, activeIndex, activeBar } = this.props;
        const baseProps = (0, ReactUtils_1.filterProps)(this.props, false);
        return (data &&
            data.map((entry, i) => {
                const isActive = i === activeIndex;
                const option = isActive ? activeBar : shape;
                const props = Object.assign(Object.assign(Object.assign({}, baseProps), entry), { isActive,
                    option, index: i, dataKey, onAnimationStart: this.handleAnimationStart, onAnimationEnd: this.handleAnimationEnd });
                return (react_1.default.createElement(Layer_1.Layer, Object.assign({ className: "recharts-bar-rectangle" }, (0, types_1.adaptEventsOfChild)(this.props, entry, i), { key: `rectangle-${entry === null || entry === void 0 ? void 0 : entry.x}-${entry === null || entry === void 0 ? void 0 : entry.y}-${entry === null || entry === void 0 ? void 0 : entry.value}` }),
                    react_1.default.createElement(BarUtils_1.BarRectangle, Object.assign({}, props))));
            }));
    }
    renderRectanglesWithAnimation() {
        const { data, layout, isAnimationActive, animationBegin, animationDuration, animationEasing, animationId } = this.props;
        const { prevData } = this.state;
        return (react_1.default.createElement(react_smooth_1.default, { begin: animationBegin, duration: animationDuration, isActive: isAnimationActive, easing: animationEasing, from: { t: 0 }, to: { t: 1 }, key: `bar-${animationId}`, onAnimationEnd: this.handleAnimationEnd, onAnimationStart: this.handleAnimationStart }, ({ t }) => {
            const stepData = data.map((entry, index) => {
                const prev = prevData && prevData[index];
                if (prev) {
                    const interpolatorX = (0, DataUtils_1.interpolateNumber)(prev.x, entry.x);
                    const interpolatorY = (0, DataUtils_1.interpolateNumber)(prev.y, entry.y);
                    const interpolatorWidth = (0, DataUtils_1.interpolateNumber)(prev.width, entry.width);
                    const interpolatorHeight = (0, DataUtils_1.interpolateNumber)(prev.height, entry.height);
                    return Object.assign(Object.assign({}, entry), { x: interpolatorX(t), y: interpolatorY(t), width: interpolatorWidth(t), height: interpolatorHeight(t) });
                }
                if (layout === 'horizontal') {
                    const interpolatorHeight = (0, DataUtils_1.interpolateNumber)(0, entry.height);
                    const h = interpolatorHeight(t);
                    return Object.assign(Object.assign({}, entry), { y: entry.y + entry.height - h, height: h });
                }
                const interpolator = (0, DataUtils_1.interpolateNumber)(0, entry.width);
                const w = interpolator(t);
                return Object.assign(Object.assign({}, entry), { width: w });
            });
            return react_1.default.createElement(Layer_1.Layer, null, this.renderRectanglesStatically(stepData));
        }));
    }
    renderRectangles() {
        const { data, isAnimationActive } = this.props;
        const { prevData } = this.state;
        if (isAnimationActive && data && data.length && (!prevData || !(0, isEqual_1.default)(prevData, data))) {
            return this.renderRectanglesWithAnimation();
        }
        return this.renderRectanglesStatically(data);
    }
    renderBackground() {
        const { data, dataKey, activeIndex } = this.props;
        const backgroundProps = (0, ReactUtils_1.filterProps)(this.props.background, false);
        return data.map((entry, i) => {
            const { value, background } = entry, rest = __rest(entry, ["value", "background"]);
            if (!background) {
                return null;
            }
            const props = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, rest), { fill: '#eee' }), background), backgroundProps), (0, types_1.adaptEventsOfChild)(this.props, entry, i)), { onAnimationStart: this.handleAnimationStart, onAnimationEnd: this.handleAnimationEnd, dataKey, index: i, key: `background-bar-${i}`, className: 'recharts-bar-background-rectangle' });
            return react_1.default.createElement(BarUtils_1.BarRectangle, Object.assign({ option: this.props.background, isActive: i === activeIndex }, props));
        });
    }
    renderErrorBar(needClip, clipPathId) {
        if (this.props.isAnimationActive && !this.state.isAnimationFinished) {
            return null;
        }
        const { data, xAxis, yAxis, layout, children } = this.props;
        const errorBarItems = (0, ReactUtils_1.findAllByType)(children, ErrorBar_1.ErrorBar);
        if (!errorBarItems) {
            return null;
        }
        const offset = layout === 'vertical' ? data[0].height / 2 : data[0].width / 2;
        const dataPointFormatter = (dataPoint, dataKey) => {
            const value = Array.isArray(dataPoint.value) ? dataPoint.value[1] : dataPoint.value;
            return {
                x: dataPoint.x,
                y: dataPoint.y,
                value,
                errorVal: (0, ChartUtils_1.getValueByDataKey)(dataPoint, dataKey),
            };
        };
        const errorBarProps = {
            clipPath: needClip ? `url(#clipPath-${clipPathId})` : null,
        };
        return (react_1.default.createElement(Layer_1.Layer, Object.assign({}, errorBarProps), errorBarItems.map((item) => react_1.default.cloneElement(item, {
            key: `error-bar-${clipPathId}-${item.props.dataKey}`,
            data,
            xAxis,
            yAxis,
            layout,
            offset,
            dataPointFormatter,
        }))));
    }
    render() {
        const { hide, data, className, xAxis, yAxis, left, top, width, height, isAnimationActive, background, id } = this.props;
        if (hide || !data || !data.length) {
            return react_1.default.createElement(SetBarLegend, Object.assign({}, this.props));
        }
        const { isAnimationFinished } = this.state;
        const layerClass = (0, clsx_1.default)('recharts-bar', className);
        const needClipX = xAxis && xAxis.allowDataOverflow;
        const needClipY = yAxis && yAxis.allowDataOverflow;
        const needClip = needClipX || needClipY;
        const clipPathId = (0, isNil_1.default)(id) ? this.id : id;
        return (react_1.default.createElement(Layer_1.Layer, { className: layerClass },
            react_1.default.createElement(SetBarLegend, Object.assign({}, this.props)),
            needClipX || needClipY ? (react_1.default.createElement("defs", null,
                react_1.default.createElement("clipPath", { id: `clipPath-${clipPathId}` },
                    react_1.default.createElement("rect", { x: needClipX ? left : left - width / 2, y: needClipY ? top : top - height / 2, width: needClipX ? width : width * 2, height: needClipY ? height : height * 2 })))) : null,
            react_1.default.createElement(Layer_1.Layer, { className: "recharts-bar-rectangles", clipPath: needClip ? `url(#clipPath-${clipPathId})` : null },
                background ? this.renderBackground() : null,
                this.renderRectangles()),
            this.renderErrorBar(needClip, clipPathId),
            (!isAnimationActive || isAnimationFinished) && LabelList_1.LabelList.renderCallByParent(this.props, data)));
    }
}
exports.Bar = Bar;
_a = Bar;
Bar.displayName = 'Bar';
Bar.defaultProps = {
    xAxisId: 0,
    yAxisId: 0,
    legendType: 'rect',
    minPointSize: 0,
    hide: false,
    data: [],
    layout: 'vertical',
    activeBar: false,
    isAnimationActive: !Global_1.Global.isSsr,
    animationBegin: 0,
    animationDuration: 400,
    animationEasing: 'ease',
};
Bar.getComposedData = ({ props, item, barPosition, bandSize, xAxis, yAxis, xAxisTicks, yAxisTicks, stackedData, dataStartIndex, displayedData, offset, }) => {
    const pos = (0, ChartUtils_1.findPositionOfBar)(barPosition, item);
    if (!pos) {
        return null;
    }
    const { layout } = props;
    const { dataKey, children, minPointSize: minPointSizeProp } = item.props;
    const numericAxis = layout === 'horizontal' ? yAxis : xAxis;
    const stackedDomain = stackedData ? numericAxis.scale.domain() : null;
    const baseValue = (0, ChartUtils_1.getBaseValueOfBar)({ numericAxis });
    const cells = (0, ReactUtils_1.findAllByType)(children, Cell_1.Cell);
    const rects = displayedData.map((entry, index) => {
        var _b;
        let value, x, y, width, height, background;
        if (stackedData) {
            value = (0, ChartUtils_1.truncateByDomain)(stackedData[dataStartIndex + index], stackedDomain);
        }
        else {
            value = (0, ChartUtils_1.getValueByDataKey)(entry, dataKey);
            if (!Array.isArray(value)) {
                value = [baseValue, value];
            }
        }
        const minPointSize = (0, BarUtils_1.minPointSizeCallback)(minPointSizeProp, _a.defaultProps.minPointSize)(value[1], index);
        if (layout === 'horizontal') {
            const [baseValueScale, currentValueScale] = [yAxis.scale(value[0]), yAxis.scale(value[1])];
            x = (0, ChartUtils_1.getCateCoordinateOfBar)({
                axis: xAxis,
                ticks: xAxisTicks,
                bandSize,
                offset: pos.offset,
                entry,
                index,
            });
            y = (_b = currentValueScale !== null && currentValueScale !== void 0 ? currentValueScale : baseValueScale) !== null && _b !== void 0 ? _b : undefined;
            width = pos.size;
            const computedHeight = baseValueScale - currentValueScale;
            height = Number.isNaN(computedHeight) ? 0 : computedHeight;
            background = { x, y: yAxis.y, width, height: yAxis.height };
            if (Math.abs(minPointSize) > 0 && Math.abs(height) < Math.abs(minPointSize)) {
                const delta = (0, DataUtils_1.mathSign)(height || minPointSize) * (Math.abs(minPointSize) - Math.abs(height));
                y -= delta;
                height += delta;
            }
        }
        else {
            const [baseValueScale, currentValueScale] = [xAxis.scale(value[0]), xAxis.scale(value[1])];
            x = baseValueScale;
            y = (0, ChartUtils_1.getCateCoordinateOfBar)({
                axis: yAxis,
                ticks: yAxisTicks,
                bandSize,
                offset: pos.offset,
                entry,
                index,
            });
            width = currentValueScale - baseValueScale;
            height = pos.size;
            background = { x: xAxis.x, y, width: xAxis.width, height };
            if (Math.abs(minPointSize) > 0 && Math.abs(width) < Math.abs(minPointSize)) {
                const delta = (0, DataUtils_1.mathSign)(width || minPointSize) * (Math.abs(minPointSize) - Math.abs(width));
                width += delta;
            }
        }
        return Object.assign(Object.assign(Object.assign(Object.assign({}, entry), { x,
            y,
            width,
            height, value: stackedData ? value : value[1], payload: entry, background }), (cells && cells[index] && cells[index].props)), { tooltipPayload: [(0, ChartUtils_1.getTooltipItem)(item, entry)], tooltipPosition: { x: x + width / 2, y: y + height / 2 } });
    });
    return Object.assign({ data: rects, layout }, offset);
};
//# sourceMappingURL=Bar.js.map