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
exports.Pie = void 0;
const react_1 = __importStar(require("react"));
const react_smooth_1 = __importDefault(require("react-smooth"));
const get_1 = __importDefault(require("lodash/get"));
const isEqual_1 = __importDefault(require("lodash/isEqual"));
const isFunction_1 = __importDefault(require("lodash/isFunction"));
const clsx_1 = __importDefault(require("clsx"));
const Layer_1 = require("../container/Layer");
const Curve_1 = require("../shape/Curve");
const Text_1 = require("../component/Text");
const Label_1 = require("../component/Label");
const LabelList_1 = require("../component/LabelList");
const Cell_1 = require("../component/Cell");
const ReactUtils_1 = require("../util/ReactUtils");
const Global_1 = require("../util/Global");
const PolarUtils_1 = require("../util/PolarUtils");
const DataUtils_1 = require("../util/DataUtils");
const ChartUtils_1 = require("../util/ChartUtils");
const types_1 = require("../util/types");
const ActiveShapeUtils_1 = require("../util/ActiveShapeUtils");
const legendPayloadContext_1 = require("../context/legendPayloadContext");
const computeLegendPayloadFromPieData = ({ sectors, legendType }) => {
    if (sectors == null) {
        return [];
    }
    return sectors.map((entry) => ({
        type: legendType,
        value: entry.name,
        color: entry.fill,
        payload: entry,
    }));
};
function SetPiePayloadLegend(props) {
    (0, legendPayloadContext_1.useLegendPayloadDispatch)(computeLegendPayloadFromPieData, props);
    return null;
}
class Pie extends react_1.PureComponent {
    constructor(props) {
        super(props);
        this.pieRef = null;
        this.sectorRefs = [];
        this.id = (0, DataUtils_1.uniqueId)('recharts-pie-');
        this.handleAnimationEnd = () => {
            const { onAnimationEnd } = this.props;
            this.setState({
                isAnimationFinished: true,
            });
            if ((0, isFunction_1.default)(onAnimationEnd)) {
                onAnimationEnd();
            }
        };
        this.handleAnimationStart = () => {
            const { onAnimationStart } = this.props;
            this.setState({
                isAnimationFinished: false,
            });
            if ((0, isFunction_1.default)(onAnimationStart)) {
                onAnimationStart();
            }
        };
        this.state = {
            isAnimationFinished: !props.isAnimationActive,
            prevIsAnimationActive: props.isAnimationActive,
            prevAnimationId: props.animationId,
            sectorToFocus: 0,
        };
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.prevIsAnimationActive !== nextProps.isAnimationActive) {
            return {
                prevIsAnimationActive: nextProps.isAnimationActive,
                prevAnimationId: nextProps.animationId,
                curSectors: nextProps.sectors,
                prevSectors: [],
                isAnimationFinished: true,
            };
        }
        if (nextProps.isAnimationActive && nextProps.animationId !== prevState.prevAnimationId) {
            return {
                prevAnimationId: nextProps.animationId,
                curSectors: nextProps.sectors,
                prevSectors: prevState.curSectors,
                isAnimationFinished: true,
            };
        }
        if (nextProps.sectors !== prevState.curSectors) {
            return {
                curSectors: nextProps.sectors,
                isAnimationFinished: true,
            };
        }
        return null;
    }
    static getTextAnchor(x, cx) {
        if (x > cx) {
            return 'start';
        }
        if (x < cx) {
            return 'end';
        }
        return 'middle';
    }
    isActiveIndex(i) {
        const { activeIndex } = this.props;
        if (Array.isArray(activeIndex)) {
            return activeIndex.indexOf(i) !== -1;
        }
        return i === activeIndex;
    }
    hasActiveIndex() {
        const { activeIndex } = this.props;
        return Array.isArray(activeIndex) ? activeIndex.length !== 0 : activeIndex || activeIndex === 0;
    }
    static renderLabelLineItem(option, props) {
        if (react_1.default.isValidElement(option)) {
            return react_1.default.cloneElement(option, props);
        }
        if ((0, isFunction_1.default)(option)) {
            return option(props);
        }
        const className = (0, clsx_1.default)('recharts-pie-label-line', typeof option !== 'boolean' ? option.className : '');
        return react_1.default.createElement(Curve_1.Curve, Object.assign({}, props, { type: "linear", className: className }));
    }
    static renderLabelItem(option, props, value) {
        if (react_1.default.isValidElement(option)) {
            return react_1.default.cloneElement(option, props);
        }
        let label = value;
        if ((0, isFunction_1.default)(option)) {
            label = option(props);
            if (react_1.default.isValidElement(label)) {
                return label;
            }
        }
        const className = (0, clsx_1.default)('recharts-pie-label-text', typeof option !== 'boolean' && !(0, isFunction_1.default)(option) ? option.className : '');
        return (react_1.default.createElement(Text_1.Text, Object.assign({}, props, { alignmentBaseline: "middle", className: className }), label));
    }
    renderLabels(sectors) {
        const { isAnimationActive } = this.props;
        if (isAnimationActive && !this.state.isAnimationFinished) {
            return null;
        }
        const { label, labelLine, dataKey } = this.props;
        const pieProps = (0, ReactUtils_1.filterProps)(this.props, false);
        const customLabelProps = (0, ReactUtils_1.filterProps)(label, false);
        const customLabelLineProps = (0, ReactUtils_1.filterProps)(labelLine, false);
        const offsetRadius = (label && label.offsetRadius) || 20;
        const labels = sectors.map((entry, i) => {
            const midAngle = (entry.startAngle + entry.endAngle) / 2;
            const endPoint = (0, PolarUtils_1.polarToCartesian)(entry.cx, entry.cy, entry.outerRadius + offsetRadius, midAngle);
            const labelProps = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, pieProps), entry), { stroke: 'none' }), customLabelProps), { index: i, textAnchor: Pie.getTextAnchor(endPoint.x, entry.cx) }), endPoint);
            const lineProps = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, pieProps), entry), { fill: 'none', stroke: entry.fill }), customLabelLineProps), { index: i, points: [(0, PolarUtils_1.polarToCartesian)(entry.cx, entry.cy, entry.outerRadius, midAngle), endPoint], key: 'line' });
            return (react_1.default.createElement(Layer_1.Layer, { key: `label-${entry.startAngle}-${entry.endAngle}-${entry.midAngle}-${i}` },
                labelLine && Pie.renderLabelLineItem(labelLine, lineProps),
                Pie.renderLabelItem(label, labelProps, (0, ChartUtils_1.getValueByDataKey)(entry, dataKey))));
        });
        return react_1.default.createElement(Layer_1.Layer, { className: "recharts-pie-labels" }, labels);
    }
    renderSectorsStatically(sectors) {
        const { activeShape, blendStroke, inactiveShape: inactiveShapeProp } = this.props;
        return sectors.map((entry, i) => {
            if ((entry === null || entry === void 0 ? void 0 : entry.startAngle) === 0 && (entry === null || entry === void 0 ? void 0 : entry.endAngle) === 0 && sectors.length !== 1)
                return null;
            const isActive = this.isActiveIndex(i);
            const inactiveShape = inactiveShapeProp && this.hasActiveIndex() ? inactiveShapeProp : null;
            const sectorOptions = isActive ? activeShape : inactiveShape;
            const sectorProps = Object.assign(Object.assign({}, entry), { stroke: blendStroke ? entry.fill : entry.stroke, tabIndex: -1 });
            return (react_1.default.createElement(Layer_1.Layer, Object.assign({ ref: (ref) => {
                    if (ref && !this.sectorRefs.includes(ref)) {
                        this.sectorRefs.push(ref);
                    }
                }, tabIndex: -1, className: "recharts-pie-sector" }, (0, types_1.adaptEventsOfChild)(this.props, entry, i), { key: `sector-${entry === null || entry === void 0 ? void 0 : entry.startAngle}-${entry === null || entry === void 0 ? void 0 : entry.endAngle}-${entry.midAngle}-${i}` }),
                react_1.default.createElement(ActiveShapeUtils_1.Shape, Object.assign({ option: sectorOptions, isActive: isActive, shapeType: "sector" }, sectorProps))));
        });
    }
    renderSectorsWithAnimation() {
        const { sectors, isAnimationActive, animationBegin, animationDuration, animationEasing, animationId } = this.props;
        const { prevSectors, prevIsAnimationActive } = this.state;
        return (react_1.default.createElement(react_smooth_1.default, { begin: animationBegin, duration: animationDuration, isActive: isAnimationActive, easing: animationEasing, from: { t: 0 }, to: { t: 1 }, key: `pie-${animationId}-${prevIsAnimationActive}`, onAnimationStart: this.handleAnimationStart, onAnimationEnd: this.handleAnimationEnd }, ({ t }) => {
            const stepData = [];
            const first = sectors && sectors[0];
            let curAngle = first.startAngle;
            sectors.forEach((entry, index) => {
                const prev = prevSectors && prevSectors[index];
                const paddingAngle = index > 0 ? (0, get_1.default)(entry, 'paddingAngle', 0) : 0;
                if (prev) {
                    const angleIp = (0, DataUtils_1.interpolateNumber)(prev.endAngle - prev.startAngle, entry.endAngle - entry.startAngle);
                    const latest = Object.assign(Object.assign({}, entry), { startAngle: curAngle + paddingAngle, endAngle: curAngle + angleIp(t) + paddingAngle });
                    stepData.push(latest);
                    curAngle = latest.endAngle;
                }
                else {
                    const { endAngle, startAngle } = entry;
                    const interpolatorAngle = (0, DataUtils_1.interpolateNumber)(0, endAngle - startAngle);
                    const deltaAngle = interpolatorAngle(t);
                    const latest = Object.assign(Object.assign({}, entry), { startAngle: curAngle + paddingAngle, endAngle: curAngle + deltaAngle + paddingAngle });
                    stepData.push(latest);
                    curAngle = latest.endAngle;
                }
            });
            return react_1.default.createElement(Layer_1.Layer, null, this.renderSectorsStatically(stepData));
        }));
    }
    attachKeyboardHandlers(pieRef) {
        pieRef.onkeydown = (e) => {
            if (!e.altKey) {
                switch (e.key) {
                    case 'ArrowLeft': {
                        const next = ++this.state.sectorToFocus % this.sectorRefs.length;
                        this.sectorRefs[next].focus();
                        this.setState({ sectorToFocus: next });
                        break;
                    }
                    case 'ArrowRight': {
                        const next = --this.state.sectorToFocus < 0
                            ? this.sectorRefs.length - 1
                            : this.state.sectorToFocus % this.sectorRefs.length;
                        this.sectorRefs[next].focus();
                        this.setState({ sectorToFocus: next });
                        break;
                    }
                    case 'Escape': {
                        this.sectorRefs[this.state.sectorToFocus].blur();
                        this.setState({ sectorToFocus: 0 });
                        break;
                    }
                    default: {
                    }
                }
            }
        };
    }
    renderSectors() {
        const { sectors, isAnimationActive } = this.props;
        const { prevSectors } = this.state;
        if (isAnimationActive && sectors && sectors.length && (!prevSectors || !(0, isEqual_1.default)(prevSectors, sectors))) {
            return this.renderSectorsWithAnimation();
        }
        return this.renderSectorsStatically(sectors);
    }
    componentDidMount() {
        if (this.pieRef) {
            this.attachKeyboardHandlers(this.pieRef);
        }
    }
    render() {
        const { hide, sectors, className, label, cx, cy, innerRadius, outerRadius, isAnimationActive } = this.props;
        const { isAnimationFinished } = this.state;
        if (hide ||
            !sectors ||
            !sectors.length ||
            !(0, DataUtils_1.isNumber)(cx) ||
            !(0, DataUtils_1.isNumber)(cy) ||
            !(0, DataUtils_1.isNumber)(innerRadius) ||
            !(0, DataUtils_1.isNumber)(outerRadius)) {
            return react_1.default.createElement(SetPiePayloadLegend, { sectors: this.props.sectors || this.props.data, legendType: this.props.legendType });
        }
        const layerClass = (0, clsx_1.default)('recharts-pie', className);
        return (react_1.default.createElement(Layer_1.Layer, { tabIndex: this.props.rootTabIndex, className: layerClass, ref: (ref) => {
                this.pieRef = ref;
            } },
            this.renderSectors(),
            label && this.renderLabels(sectors),
            Label_1.Label.renderCallByParent(this.props, null, false),
            (!isAnimationActive || isAnimationFinished) && LabelList_1.LabelList.renderCallByParent(this.props, sectors, false),
            react_1.default.createElement(SetPiePayloadLegend, { sectors: this.props.sectors, legendType: this.props.legendType })));
    }
}
exports.Pie = Pie;
Pie.displayName = 'Pie';
Pie.defaultProps = {
    stroke: '#fff',
    fill: '#808080',
    legendType: 'rect',
    cx: '50%',
    cy: '50%',
    startAngle: 0,
    endAngle: 360,
    innerRadius: 0,
    outerRadius: '80%',
    paddingAngle: 0,
    labelLine: true,
    hide: false,
    minAngle: 0,
    isAnimationActive: !Global_1.Global.isSsr,
    animationBegin: 400,
    animationDuration: 1500,
    animationEasing: 'ease',
    nameKey: 'name',
    blendStroke: false,
    rootTabIndex: 0,
};
Pie.parseDeltaAngle = (startAngle, endAngle) => {
    const sign = (0, DataUtils_1.mathSign)(endAngle - startAngle);
    const deltaAngle = Math.min(Math.abs(endAngle - startAngle), 360);
    return sign * deltaAngle;
};
Pie.getRealPieData = (item) => {
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
Pie.parseCoordinateOfPie = (item, offset) => {
    const { top, left, width, height } = offset;
    const maxPieRadius = (0, PolarUtils_1.getMaxRadius)(width, height);
    const cx = left + (0, DataUtils_1.getPercentValue)(item.props.cx, width, width / 2);
    const cy = top + (0, DataUtils_1.getPercentValue)(item.props.cy, height, height / 2);
    const innerRadius = (0, DataUtils_1.getPercentValue)(item.props.innerRadius, maxPieRadius, 0);
    const outerRadius = (0, DataUtils_1.getPercentValue)(item.props.outerRadius, maxPieRadius, maxPieRadius * 0.8);
    const maxRadius = item.props.maxRadius || Math.sqrt(width * width + height * height) / 2;
    return { cx, cy, innerRadius, outerRadius, maxRadius };
};
Pie.getComposedData = ({ item, offset }) => {
    const pieData = Pie.getRealPieData(item);
    if (!pieData || !pieData.length) {
        return null;
    }
    const { cornerRadius, startAngle, endAngle, paddingAngle, dataKey, nameKey, tooltipType } = item.props;
    const minAngle = Math.abs(item.props.minAngle);
    const coordinate = Pie.parseCoordinateOfPie(item, offset);
    const deltaAngle = Pie.parseDeltaAngle(startAngle, endAngle);
    const absDeltaAngle = Math.abs(deltaAngle);
    const notZeroItemCount = pieData.filter(entry => (0, ChartUtils_1.getValueByDataKey)(entry, dataKey, 0) !== 0).length;
    const totalPadingAngle = (absDeltaAngle >= 360 ? notZeroItemCount : notZeroItemCount - 1) * paddingAngle;
    const realTotalAngle = absDeltaAngle - notZeroItemCount * minAngle - totalPadingAngle;
    const sum = pieData.reduce((result, entry) => {
        const val = (0, ChartUtils_1.getValueByDataKey)(entry, dataKey, 0);
        return result + ((0, DataUtils_1.isNumber)(val) ? val : 0);
    }, 0);
    let sectors;
    if (sum > 0) {
        let prev;
        sectors = pieData.map((entry, i) => {
            const val = (0, ChartUtils_1.getValueByDataKey)(entry, dataKey, 0);
            const name = (0, ChartUtils_1.getValueByDataKey)(entry, nameKey, i);
            const percent = ((0, DataUtils_1.isNumber)(val) ? val : 0) / sum;
            let tempStartAngle;
            if (i) {
                tempStartAngle = prev.endAngle + (0, DataUtils_1.mathSign)(deltaAngle) * paddingAngle * (val !== 0 ? 1 : 0);
            }
            else {
                tempStartAngle = startAngle;
            }
            const tempEndAngle = tempStartAngle + (0, DataUtils_1.mathSign)(deltaAngle) * ((val !== 0 ? minAngle : 0) + percent * realTotalAngle);
            const midAngle = (tempStartAngle + tempEndAngle) / 2;
            const middleRadius = (coordinate.innerRadius + coordinate.outerRadius) / 2;
            const tooltipPayload = [
                {
                    name,
                    value: val,
                    payload: entry,
                    dataKey,
                    type: tooltipType,
                },
            ];
            const tooltipPosition = (0, PolarUtils_1.polarToCartesian)(coordinate.cx, coordinate.cy, middleRadius, midAngle);
            prev = Object.assign(Object.assign(Object.assign({ percent,
                cornerRadius,
                name,
                tooltipPayload,
                midAngle,
                middleRadius,
                tooltipPosition }, entry), coordinate), { value: (0, ChartUtils_1.getValueByDataKey)(entry, dataKey), startAngle: tempStartAngle, endAngle: tempEndAngle, payload: entry, paddingAngle: (0, DataUtils_1.mathSign)(deltaAngle) * paddingAngle });
            return prev;
        });
    }
    return Object.assign(Object.assign({}, coordinate), { sectors, data: pieData });
};
//# sourceMappingURL=Pie.js.map