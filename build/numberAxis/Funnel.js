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
exports.Funnel = void 0;
const react_1 = __importStar(require("react"));
const react_smooth_1 = __importDefault(require("react-smooth"));
const isFunction_1 = __importDefault(require("lodash/isFunction"));
const isNumber_1 = __importDefault(require("lodash/isNumber"));
const isString_1 = __importDefault(require("lodash/isString"));
const omit_1 = __importDefault(require("lodash/omit"));
const isEqual_1 = __importDefault(require("lodash/isEqual"));
const clsx_1 = __importDefault(require("clsx"));
const Layer_1 = require("../container/Layer");
const LabelList_1 = require("../component/LabelList");
const Cell_1 = require("../component/Cell");
const ReactUtils_1 = require("../util/ReactUtils");
const Global_1 = require("../util/Global");
const DataUtils_1 = require("../util/DataUtils");
const ChartUtils_1 = require("../util/ChartUtils");
const types_1 = require("../util/types");
const FunnelUtils_1 = require("../util/FunnelUtils");
class Funnel extends react_1.PureComponent {
    constructor() {
        super(...arguments);
        this.state = { isAnimationFinished: false };
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
                curTrapezoids: nextProps.trapezoids,
                prevTrapezoids: prevState.curTrapezoids,
            };
        }
        if (nextProps.trapezoids !== prevState.curTrapezoids) {
            return {
                curTrapezoids: nextProps.trapezoids,
            };
        }
        return null;
    }
    isActiveIndex(i) {
        const { activeIndex } = this.props;
        if (Array.isArray(activeIndex)) {
            return activeIndex.indexOf(i) !== -1;
        }
        return i === activeIndex;
    }
    renderTrapezoidsStatically(trapezoids) {
        const { shape, activeShape } = this.props;
        return trapezoids.map((entry, i) => {
            const trapezoidOptions = this.isActiveIndex(i) ? activeShape : shape;
            const trapezoidProps = Object.assign(Object.assign({}, entry), { isActive: this.isActiveIndex(i), stroke: entry.stroke });
            return (react_1.default.createElement(Layer_1.Layer, Object.assign({ className: "recharts-funnel-trapezoid" }, (0, types_1.adaptEventsOfChild)(this.props, entry, i), { key: `trapezoid-${entry === null || entry === void 0 ? void 0 : entry.x}-${entry === null || entry === void 0 ? void 0 : entry.y}-${entry === null || entry === void 0 ? void 0 : entry.name}-${entry === null || entry === void 0 ? void 0 : entry.value}`, role: "img" }),
                react_1.default.createElement(FunnelUtils_1.FunnelTrapezoid, Object.assign({ option: trapezoidOptions }, trapezoidProps))));
        });
    }
    renderTrapezoidsWithAnimation() {
        const { trapezoids, isAnimationActive, animationBegin, animationDuration, animationEasing, animationId } = this.props;
        const { prevTrapezoids } = this.state;
        return (react_1.default.createElement(react_smooth_1.default, { begin: animationBegin, duration: animationDuration, isActive: isAnimationActive, easing: animationEasing, from: { t: 0 }, to: { t: 1 }, key: `funnel-${animationId}`, onAnimationStart: this.handleAnimationStart, onAnimationEnd: this.handleAnimationEnd }, ({ t }) => {
            const stepData = trapezoids.map((entry, index) => {
                const prev = prevTrapezoids && prevTrapezoids[index];
                if (prev) {
                    const interpolatorX = (0, DataUtils_1.interpolateNumber)(prev.x, entry.x);
                    const interpolatorY = (0, DataUtils_1.interpolateNumber)(prev.y, entry.y);
                    const interpolatorUpperWidth = (0, DataUtils_1.interpolateNumber)(prev.upperWidth, entry.upperWidth);
                    const interpolatorLowerWidth = (0, DataUtils_1.interpolateNumber)(prev.lowerWidth, entry.lowerWidth);
                    const interpolatorHeight = (0, DataUtils_1.interpolateNumber)(prev.height, entry.height);
                    return Object.assign(Object.assign({}, entry), { x: interpolatorX(t), y: interpolatorY(t), upperWidth: interpolatorUpperWidth(t), lowerWidth: interpolatorLowerWidth(t), height: interpolatorHeight(t) });
                }
                const interpolatorX = (0, DataUtils_1.interpolateNumber)(entry.x + entry.upperWidth / 2, entry.x);
                const interpolatorY = (0, DataUtils_1.interpolateNumber)(entry.y + entry.height / 2, entry.y);
                const interpolatorUpperWidth = (0, DataUtils_1.interpolateNumber)(0, entry.upperWidth);
                const interpolatorLowerWidth = (0, DataUtils_1.interpolateNumber)(0, entry.lowerWidth);
                const interpolatorHeight = (0, DataUtils_1.interpolateNumber)(0, entry.height);
                return Object.assign(Object.assign({}, entry), { x: interpolatorX(t), y: interpolatorY(t), upperWidth: interpolatorUpperWidth(t), lowerWidth: interpolatorLowerWidth(t), height: interpolatorHeight(t) });
            });
            return react_1.default.createElement(Layer_1.Layer, null, this.renderTrapezoidsStatically(stepData));
        }));
    }
    renderTrapezoids() {
        const { trapezoids, isAnimationActive } = this.props;
        const { prevTrapezoids } = this.state;
        if (isAnimationActive &&
            trapezoids &&
            trapezoids.length &&
            (!prevTrapezoids || !(0, isEqual_1.default)(prevTrapezoids, trapezoids))) {
            return this.renderTrapezoidsWithAnimation();
        }
        return this.renderTrapezoidsStatically(trapezoids);
    }
    render() {
        const { hide, trapezoids, className, isAnimationActive } = this.props;
        const { isAnimationFinished } = this.state;
        if (hide || !trapezoids || !trapezoids.length) {
            return null;
        }
        const layerClass = (0, clsx_1.default)('recharts-trapezoids', className);
        return (react_1.default.createElement(Layer_1.Layer, { className: layerClass },
            this.renderTrapezoids(),
            (!isAnimationActive || isAnimationFinished) && LabelList_1.LabelList.renderCallByParent(this.props, trapezoids)));
    }
}
exports.Funnel = Funnel;
Funnel.displayName = 'Funnel';
Funnel.defaultProps = {
    stroke: '#fff',
    fill: '#808080',
    legendType: 'rect',
    labelLine: true,
    hide: false,
    isAnimationActive: !Global_1.Global.isSsr,
    animationBegin: 400,
    animationDuration: 1500,
    animationEasing: 'ease',
    nameKey: 'name',
    lastShapeType: 'triangle',
};
Funnel.getRealFunnelData = (item) => {
    const { data, children } = item.props;
    const presentationProps = (0, ReactUtils_1.filterProps)(item.props, false);
    const cells = (0, ReactUtils_1.findAllByType)(children, Cell_1.Cell);
    if (data && data.length) {
        return data.map((entry, index) => (Object.assign(Object.assign(Object.assign({ payload: entry }, presentationProps), entry), (cells && cells[index] && cells[index].props))));
    }
    if (cells && cells.length) {
        return cells.map((cell) => (Object.assign(Object.assign({}, presentationProps), cell.props)));
    }
    return [];
};
Funnel.getRealWidthHeight = (item, offset) => {
    const customWidth = item.props.width;
    const { width, height, left, right, top, bottom } = offset;
    const realHeight = height;
    let realWidth = width;
    if ((0, isNumber_1.default)(customWidth)) {
        realWidth = customWidth;
    }
    else if ((0, isString_1.default)(customWidth)) {
        realWidth = (realWidth * parseFloat(customWidth)) / 100;
    }
    return {
        realWidth: realWidth - left - right - 50,
        realHeight: realHeight - bottom - top,
        offsetX: (width - realWidth) / 2,
        offsetY: (height - realHeight) / 2,
    };
};
Funnel.getComposedData = ({ item, offset }) => {
    const funnelData = Funnel.getRealFunnelData(item);
    const { dataKey, nameKey, tooltipType, lastShapeType, reversed } = item.props;
    const { left, top } = offset;
    const { realHeight, realWidth, offsetX, offsetY } = Funnel.getRealWidthHeight(item, offset);
    const maxValue = Math.max.apply(null, funnelData.map((entry) => (0, ChartUtils_1.getValueByDataKey)(entry, dataKey, 0)));
    const len = funnelData.length;
    const rowHeight = realHeight / len;
    const parentViewBox = { x: offset.left, y: offset.top, width: offset.width, height: offset.height };
    let trapezoids = funnelData.map((entry, i) => {
        const rawVal = (0, ChartUtils_1.getValueByDataKey)(entry, dataKey, 0);
        const name = (0, ChartUtils_1.getValueByDataKey)(entry, nameKey, i);
        let val = rawVal;
        let nextVal;
        if (i !== len - 1) {
            nextVal = (0, ChartUtils_1.getValueByDataKey)(funnelData[i + 1], dataKey, 0);
            if (nextVal instanceof Array) {
                [nextVal] = nextVal;
            }
        }
        else if (rawVal instanceof Array && rawVal.length === 2) {
            [val, nextVal] = rawVal;
        }
        else if (lastShapeType === 'rectangle') {
            nextVal = val;
        }
        else {
            nextVal = 0;
        }
        const x = ((maxValue - val) * realWidth) / (2 * maxValue) + top + 25 + offsetX;
        const y = rowHeight * i + left + offsetY;
        const upperWidth = (val / maxValue) * realWidth;
        const lowerWidth = (nextVal / maxValue) * realWidth;
        const tooltipPayload = [{ name, value: val, payload: entry, dataKey, type: tooltipType }];
        const tooltipPosition = {
            x: x + upperWidth / 2,
            y: y + rowHeight / 2,
        };
        return Object.assign(Object.assign({ x,
            y, width: Math.max(upperWidth, lowerWidth), upperWidth,
            lowerWidth, height: rowHeight, name,
            val,
            tooltipPayload,
            tooltipPosition }, (0, omit_1.default)(entry, 'width')), { payload: entry, parentViewBox, labelViewBox: {
                x: x + (upperWidth - lowerWidth) / 4,
                y,
                width: Math.abs(upperWidth - lowerWidth) / 2 + Math.min(upperWidth, lowerWidth),
                height: rowHeight,
            } });
    });
    if (reversed) {
        trapezoids = trapezoids.map((entry, index) => {
            const newY = entry.y - index * rowHeight + (len - 1 - index) * rowHeight;
            return Object.assign(Object.assign({}, entry), { upperWidth: entry.lowerWidth, lowerWidth: entry.upperWidth, x: entry.x - (entry.lowerWidth - entry.upperWidth) / 2, y: entry.y - index * rowHeight + (len - 1 - index) * rowHeight, tooltipPosition: Object.assign(Object.assign({}, entry.tooltipPosition), { y: newY + rowHeight / 2 }), labelViewBox: Object.assign(Object.assign({}, entry.labelViewBox), { y: newY }) });
        });
    }
    return {
        trapezoids,
        data: funnelData,
    };
};
//# sourceMappingURL=Funnel.js.map