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
exports.RadialBar = void 0;
const react_1 = __importStar(require("react"));
const clsx_1 = __importDefault(require("clsx"));
const react_smooth_1 = __importDefault(require("react-smooth"));
const isEqual_1 = __importDefault(require("lodash/isEqual"));
const isFunction_1 = __importDefault(require("lodash/isFunction"));
const RadialBarUtils_1 = require("../util/RadialBarUtils");
const Layer_1 = require("../container/Layer");
const ReactUtils_1 = require("../util/ReactUtils");
const Global_1 = require("../util/Global");
const LabelList_1 = require("../component/LabelList");
const Cell_1 = require("../component/Cell");
const DataUtils_1 = require("../util/DataUtils");
const ChartUtils_1 = require("../util/ChartUtils");
const types_1 = require("../util/types");
const PolarUtils_1 = require("../util/PolarUtils");
const legendPayloadContext_1 = require("../context/legendPayloadContext");
const computeLegendPayloadFromRadarData = ({ data, legendType }) => {
    return data.map((entry) => ({
        type: legendType,
        value: entry.name,
        color: entry.fill,
        payload: entry,
    }));
};
function SetRadialBarPayloadLegend(props) {
    (0, legendPayloadContext_1.useLegendPayloadDispatch)(computeLegendPayloadFromRadarData, props);
    return null;
}
class RadialBar extends react_1.PureComponent {
    constructor() {
        super(...arguments);
        this.state = {
            isAnimationFinished: false,
        };
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
    getDeltaAngle() {
        const { startAngle, endAngle } = this.props;
        const sign = (0, DataUtils_1.mathSign)(endAngle - startAngle);
        const deltaAngle = Math.min(Math.abs(endAngle - startAngle), 360);
        return sign * deltaAngle;
    }
    renderSectorsStatically(sectors) {
        const _a = this.props, { shape, activeShape, activeIndex, cornerRadius } = _a, others = __rest(_a, ["shape", "activeShape", "activeIndex", "cornerRadius"]);
        const baseProps = (0, ReactUtils_1.filterProps)(others, false);
        return sectors.map((entry, i) => {
            const isActive = i === activeIndex;
            const props = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, baseProps), { cornerRadius: (0, RadialBarUtils_1.parseCornerRadius)(cornerRadius) }), entry), (0, types_1.adaptEventsOfChild)(this.props, entry, i)), { key: `sector-${i}`, className: `recharts-radial-bar-sector ${entry.className}`, forceCornerRadius: others.forceCornerRadius, cornerIsExternal: others.cornerIsExternal, isActive, option: isActive ? activeShape : shape });
            return react_1.default.createElement(RadialBarUtils_1.RadialBarSector, Object.assign({}, props));
        });
    }
    renderSectorsWithAnimation() {
        const { data, isAnimationActive, animationBegin, animationDuration, animationEasing, animationId } = this.props;
        const { prevData } = this.state;
        return (react_1.default.createElement(react_smooth_1.default, { begin: animationBegin, duration: animationDuration, isActive: isAnimationActive, easing: animationEasing, from: { t: 0 }, to: { t: 1 }, key: `radialBar-${animationId}`, onAnimationStart: this.handleAnimationStart, onAnimationEnd: this.handleAnimationEnd }, ({ t }) => {
            const stepData = data.map((entry, index) => {
                const prev = prevData && prevData[index];
                if (prev) {
                    const interpolatorStartAngle = (0, DataUtils_1.interpolateNumber)(prev.startAngle, entry.startAngle);
                    const interpolatorEndAngle = (0, DataUtils_1.interpolateNumber)(prev.endAngle, entry.endAngle);
                    return Object.assign(Object.assign({}, entry), { startAngle: interpolatorStartAngle(t), endAngle: interpolatorEndAngle(t) });
                }
                const { endAngle, startAngle } = entry;
                const interpolator = (0, DataUtils_1.interpolateNumber)(startAngle, endAngle);
                return Object.assign(Object.assign({}, entry), { endAngle: interpolator(t) });
            });
            return react_1.default.createElement(Layer_1.Layer, null, this.renderSectorsStatically(stepData));
        }));
    }
    renderSectors() {
        const { data, isAnimationActive } = this.props;
        const { prevData } = this.state;
        if (isAnimationActive && data && data.length && (!prevData || !(0, isEqual_1.default)(prevData, data))) {
            return this.renderSectorsWithAnimation();
        }
        return this.renderSectorsStatically(data);
    }
    renderBackground(sectors) {
        const { cornerRadius } = this.props;
        const backgroundProps = (0, ReactUtils_1.filterProps)(this.props.background, false);
        return sectors.map((entry, i) => {
            const { value, background } = entry, rest = __rest(entry, ["value", "background"]);
            if (!background) {
                return null;
            }
            const props = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ cornerRadius: (0, RadialBarUtils_1.parseCornerRadius)(cornerRadius) }, rest), { fill: '#eee' }), background), backgroundProps), (0, types_1.adaptEventsOfChild)(this.props, entry, i)), { index: i, key: `sector-${i}`, className: (0, clsx_1.default)('recharts-radial-bar-background-sector', backgroundProps === null || backgroundProps === void 0 ? void 0 : backgroundProps.className), option: background, isActive: false });
            return react_1.default.createElement(RadialBarUtils_1.RadialBarSector, Object.assign({}, props));
        });
    }
    render() {
        const { hide, data, className, background, isAnimationActive } = this.props;
        if (hide || !data || !data.length) {
            return null;
        }
        const { isAnimationFinished } = this.state;
        const layerClass = (0, clsx_1.default)('recharts-area', className);
        return (react_1.default.createElement(Layer_1.Layer, { className: layerClass },
            react_1.default.createElement(SetRadialBarPayloadLegend, { data: this.props.data, legendType: this.props.legendType }),
            background && react_1.default.createElement(Layer_1.Layer, { className: "recharts-radial-bar-background" }, this.renderBackground(data)),
            react_1.default.createElement(Layer_1.Layer, { className: "recharts-radial-bar-sectors" }, this.renderSectors()),
            (!isAnimationActive || isAnimationFinished) && LabelList_1.LabelList.renderCallByParent(Object.assign({}, this.props), data)));
    }
}
exports.RadialBar = RadialBar;
RadialBar.displayName = 'RadialBar';
RadialBar.defaultProps = {
    angleAxisId: 0,
    radiusAxisId: 0,
    minPointSize: 0,
    hide: false,
    legendType: 'rect',
    data: [],
    isAnimationActive: !Global_1.Global.isSsr,
    animationBegin: 0,
    animationDuration: 1500,
    animationEasing: 'ease',
    forceCornerRadius: false,
    cornerIsExternal: false,
};
RadialBar.getComposedData = ({ item, props, radiusAxis, radiusAxisTicks, angleAxis, angleAxisTicks, displayedData, dataKey, stackedData, barPosition, bandSize, dataStartIndex, }) => {
    const pos = (0, ChartUtils_1.findPositionOfBar)(barPosition, item);
    if (!pos) {
        return null;
    }
    const { cx, cy } = angleAxis;
    const { layout } = props;
    const { children, minPointSize } = item.props;
    const numericAxis = layout === 'radial' ? angleAxis : radiusAxis;
    const stackedDomain = stackedData ? numericAxis.scale.domain() : null;
    const baseValue = (0, ChartUtils_1.getBaseValueOfBar)({ numericAxis });
    const cells = (0, ReactUtils_1.findAllByType)(children, Cell_1.Cell);
    const sectors = displayedData.map((entry, index) => {
        let value, innerRadius, outerRadius, startAngle, endAngle, backgroundSector;
        if (stackedData) {
            value = (0, ChartUtils_1.truncateByDomain)(stackedData[dataStartIndex + index], stackedDomain);
        }
        else {
            value = (0, ChartUtils_1.getValueByDataKey)(entry, dataKey);
            if (!Array.isArray(value)) {
                value = [baseValue, value];
            }
        }
        if (layout === 'radial') {
            innerRadius = (0, ChartUtils_1.getCateCoordinateOfBar)({
                axis: radiusAxis,
                ticks: radiusAxisTicks,
                bandSize,
                offset: pos.offset,
                entry,
                index,
            });
            endAngle = angleAxis.scale(value[1]);
            startAngle = angleAxis.scale(value[0]);
            outerRadius = innerRadius + pos.size;
            const deltaAngle = endAngle - startAngle;
            if (Math.abs(minPointSize) > 0 && Math.abs(deltaAngle) < Math.abs(minPointSize)) {
                const delta = (0, DataUtils_1.mathSign)(deltaAngle || minPointSize) * (Math.abs(minPointSize) - Math.abs(deltaAngle));
                endAngle += delta;
            }
            backgroundSector = {
                background: {
                    cx,
                    cy,
                    innerRadius,
                    outerRadius,
                    startAngle: props.startAngle,
                    endAngle: props.endAngle,
                },
            };
        }
        else {
            innerRadius = radiusAxis.scale(value[0]);
            outerRadius = radiusAxis.scale(value[1]);
            startAngle = (0, ChartUtils_1.getCateCoordinateOfBar)({
                axis: angleAxis,
                ticks: angleAxisTicks,
                bandSize,
                offset: pos.offset,
                entry,
                index,
            });
            endAngle = startAngle + pos.size;
            const deltaRadius = outerRadius - innerRadius;
            if (Math.abs(minPointSize) > 0 && Math.abs(deltaRadius) < Math.abs(minPointSize)) {
                const delta = (0, DataUtils_1.mathSign)(deltaRadius || minPointSize) * (Math.abs(minPointSize) - Math.abs(deltaRadius));
                outerRadius += delta;
            }
        }
        return Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, entry), backgroundSector), { payload: entry, value: stackedData ? value : value[1], cx,
            cy,
            innerRadius,
            outerRadius,
            startAngle,
            endAngle }), (cells && cells[index] && cells[index].props)), { tooltipPayload: [(0, ChartUtils_1.getTooltipItem)(item, entry)], tooltipPosition: (0, PolarUtils_1.polarToCartesian)(cx, cy, (innerRadius + outerRadius) / 2, (startAngle + endAngle) / 2) });
    });
    return { data: sectors, layout };
};
//# sourceMappingURL=RadialBar.js.map