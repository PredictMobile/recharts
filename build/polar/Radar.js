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
exports.Radar = void 0;
const react_1 = __importStar(require("react"));
const react_smooth_1 = __importDefault(require("react-smooth"));
const isNil_1 = __importDefault(require("lodash/isNil"));
const last_1 = __importDefault(require("lodash/last"));
const first_1 = __importDefault(require("lodash/first"));
const isEqual_1 = __importDefault(require("lodash/isEqual"));
const isFunction_1 = __importDefault(require("lodash/isFunction"));
const clsx_1 = __importDefault(require("clsx"));
const DataUtils_1 = require("../util/DataUtils");
const Global_1 = require("../util/Global");
const PolarUtils_1 = require("../util/PolarUtils");
const ChartUtils_1 = require("../util/ChartUtils");
const Polygon_1 = require("../shape/Polygon");
const Dot_1 = require("../shape/Dot");
const Layer_1 = require("../container/Layer");
const LabelList_1 = require("../component/LabelList");
const ReactUtils_1 = require("../util/ReactUtils");
const legendPayloadContext_1 = require("../context/legendPayloadContext");
function getLegendItemColor(stroke, fill) {
    return stroke && stroke !== 'none' ? stroke : fill;
}
const computeLegendPayloadFromRadarSectors = (props) => {
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
function SetRadarPayloadLegend(props) {
    (0, legendPayloadContext_1.useLegendPayloadDispatch)(computeLegendPayloadFromRadarSectors, props);
    return null;
}
class Radar extends react_1.PureComponent {
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
        this.handleMouseEnter = (e) => {
            const { onMouseEnter } = this.props;
            if (onMouseEnter) {
                onMouseEnter(this.props, e);
            }
        };
        this.handleMouseLeave = (e) => {
            const { onMouseLeave } = this.props;
            if (onMouseLeave) {
                onMouseLeave(this.props, e);
            }
        };
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
    static renderDotItem(option, props) {
        let dotItem;
        if (react_1.default.isValidElement(option)) {
            dotItem = react_1.default.cloneElement(option, props);
        }
        else if ((0, isFunction_1.default)(option)) {
            dotItem = option(props);
        }
        else {
            dotItem = (react_1.default.createElement(Dot_1.Dot, Object.assign({}, props, { className: (0, clsx_1.default)('recharts-radar-dot', typeof option !== 'boolean' ? option.className : '') })));
        }
        return dotItem;
    }
    renderDots(points) {
        const { dot, dataKey } = this.props;
        const baseProps = (0, ReactUtils_1.filterProps)(this.props, false);
        const customDotProps = (0, ReactUtils_1.filterProps)(dot, true);
        const dots = points.map((entry, i) => {
            const dotProps = Object.assign(Object.assign(Object.assign({ key: `dot-${i}`, r: 3 }, baseProps), customDotProps), { dataKey, cx: entry.x, cy: entry.y, index: i, payload: entry });
            return Radar.renderDotItem(dot, dotProps);
        });
        return react_1.default.createElement(Layer_1.Layer, { className: "recharts-radar-dots" }, dots);
    }
    renderPolygonStatically(points) {
        const { shape, dot, isRange, baseLinePoints, connectNulls } = this.props;
        let radar;
        if (react_1.default.isValidElement(shape)) {
            radar = react_1.default.cloneElement(shape, Object.assign(Object.assign({}, this.props), { points }));
        }
        else if ((0, isFunction_1.default)(shape)) {
            radar = shape(Object.assign(Object.assign({}, this.props), { points }));
        }
        else {
            radar = (react_1.default.createElement(Polygon_1.Polygon, Object.assign({}, (0, ReactUtils_1.filterProps)(this.props, true), { onMouseEnter: this.handleMouseEnter, onMouseLeave: this.handleMouseLeave, points: points, baseLinePoints: isRange ? baseLinePoints : null, connectNulls: connectNulls })));
        }
        return (react_1.default.createElement(Layer_1.Layer, { className: "recharts-radar-polygon" },
            radar,
            dot ? this.renderDots(points) : null));
    }
    renderPolygonWithAnimation() {
        const { points, isAnimationActive, animationBegin, animationDuration, animationEasing, animationId } = this.props;
        const { prevPoints } = this.state;
        return (react_1.default.createElement(react_smooth_1.default, { begin: animationBegin, duration: animationDuration, isActive: isAnimationActive, easing: animationEasing, from: { t: 0 }, to: { t: 1 }, key: `radar-${animationId}`, onAnimationEnd: this.handleAnimationEnd, onAnimationStart: this.handleAnimationStart }, ({ t }) => {
            const prevPointsDiffFactor = prevPoints && prevPoints.length / points.length;
            const stepData = points.map((entry, index) => {
                const prev = prevPoints && prevPoints[Math.floor(index * prevPointsDiffFactor)];
                if (prev) {
                    const interpolatorX = (0, DataUtils_1.interpolateNumber)(prev.x, entry.x);
                    const interpolatorY = (0, DataUtils_1.interpolateNumber)(prev.y, entry.y);
                    return Object.assign(Object.assign({}, entry), { x: interpolatorX(t), y: interpolatorY(t) });
                }
                const interpolatorX = (0, DataUtils_1.interpolateNumber)(entry.cx, entry.x);
                const interpolatorY = (0, DataUtils_1.interpolateNumber)(entry.cy, entry.y);
                return Object.assign(Object.assign({}, entry), { x: interpolatorX(t), y: interpolatorY(t) });
            });
            return this.renderPolygonStatically(stepData);
        }));
    }
    renderPolygon() {
        const { points, isAnimationActive, isRange } = this.props;
        const { prevPoints } = this.state;
        if (isAnimationActive && points && points.length && !isRange && (!prevPoints || !(0, isEqual_1.default)(prevPoints, points))) {
            return this.renderPolygonWithAnimation();
        }
        return this.renderPolygonStatically(points);
    }
    render() {
        const { hide, className, points, isAnimationActive } = this.props;
        if (hide || !points || !points.length) {
            return react_1.default.createElement(SetRadarPayloadLegend, Object.assign({}, this.props));
        }
        const { isAnimationFinished } = this.state;
        const layerClass = (0, clsx_1.default)('recharts-radar', className);
        return (react_1.default.createElement(Layer_1.Layer, { className: layerClass },
            react_1.default.createElement(SetRadarPayloadLegend, Object.assign({}, this.props)),
            this.renderPolygon(),
            (!isAnimationActive || isAnimationFinished) && LabelList_1.LabelList.renderCallByParent(this.props, points)));
    }
}
exports.Radar = Radar;
Radar.displayName = 'Radar';
Radar.defaultProps = {
    angleAxisId: 0,
    radiusAxisId: 0,
    hide: false,
    activeDot: true,
    dot: false,
    legendType: 'rect',
    isAnimationActive: !Global_1.Global.isSsr,
    animationBegin: 0,
    animationDuration: 1500,
    animationEasing: 'ease',
};
Radar.getComposedData = ({ radiusAxis, angleAxis, displayedData, dataKey, bandSize, }) => {
    const { cx, cy } = angleAxis;
    let isRange = false;
    const points = [];
    const angleBandSize = angleAxis.type !== 'number' ? bandSize !== null && bandSize !== void 0 ? bandSize : 0 : 0;
    displayedData.forEach((entry, i) => {
        const name = (0, ChartUtils_1.getValueByDataKey)(entry, angleAxis.dataKey, i);
        const value = (0, ChartUtils_1.getValueByDataKey)(entry, dataKey);
        const angle = angleAxis.scale(name) + angleBandSize;
        const pointValue = Array.isArray(value) ? (0, last_1.default)(value) : value;
        const radius = (0, isNil_1.default)(pointValue) ? undefined : radiusAxis.scale(pointValue);
        if (Array.isArray(value) && value.length >= 2) {
            isRange = true;
        }
        points.push(Object.assign(Object.assign({}, (0, PolarUtils_1.polarToCartesian)(cx, cy, radius, angle)), { name,
            value,
            cx,
            cy,
            radius,
            angle, payload: entry }));
    });
    const baseLinePoints = [];
    if (isRange) {
        points.forEach(point => {
            if (Array.isArray(point.value)) {
                const baseValue = (0, first_1.default)(point.value);
                const radius = (0, isNil_1.default)(baseValue) ? undefined : radiusAxis.scale(baseValue);
                baseLinePoints.push(Object.assign(Object.assign(Object.assign({}, point), { radius }), (0, PolarUtils_1.polarToCartesian)(cx, cy, radius, point.angle)));
            }
            else {
                baseLinePoints.push(point);
            }
        });
    }
    return { points, isRange, baseLinePoints };
};
//# sourceMappingURL=Radar.js.map