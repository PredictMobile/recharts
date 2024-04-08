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
exports.generateCategoricalChart = exports.createDefaultState = exports.getAxisMapByAxes = void 0;
const react_1 = __importStar(require("react"));
const isNil_1 = __importDefault(require("lodash/isNil"));
const isFunction_1 = __importDefault(require("lodash/isFunction"));
const range_1 = __importDefault(require("lodash/range"));
const get_1 = __importDefault(require("lodash/get"));
const sortBy_1 = __importDefault(require("lodash/sortBy"));
const throttle_1 = __importDefault(require("lodash/throttle"));
const clsx_1 = __importDefault(require("clsx"));
const tiny_invariant_1 = __importDefault(require("tiny-invariant"));
const Surface_1 = require("../container/Surface");
const Layer_1 = require("../container/Layer");
const Tooltip_1 = require("../component/Tooltip");
const Legend_1 = require("../component/Legend");
const Dot_1 = require("../shape/Dot");
const Rectangle_1 = require("../shape/Rectangle");
const ReactUtils_1 = require("../util/ReactUtils");
const Brush_1 = require("../cartesian/Brush");
const DOMUtils_1 = require("../util/DOMUtils");
const DataUtils_1 = require("../util/DataUtils");
const ChartUtils_1 = require("../util/ChartUtils");
const DetectReferenceElementsDomain_1 = require("../util/DetectReferenceElementsDomain");
const PolarUtils_1 = require("../util/PolarUtils");
const ShallowEqual_1 = require("../util/ShallowEqual");
const Events_1 = require("../util/Events");
const types_1 = require("../util/types");
const AccessibilityManager_1 = require("./AccessibilityManager");
const isDomainSpecifiedByUser_1 = require("../util/isDomainSpecifiedByUser");
const ActiveShapeUtils_1 = require("../util/ActiveShapeUtils");
const Cursor_1 = require("../component/Cursor");
const chartLayoutContext_1 = require("../context/chartLayoutContext");
const accessibilityContext_1 = require("../context/accessibilityContext");
const legendBoundingBoxContext_1 = require("../context/legendBoundingBoxContext");
const chartDataContext_1 = require("../context/chartDataContext");
const brushUpdateContext_1 = require("../context/brushUpdateContext");
const ClipPath_1 = require("../container/ClipPath");
const ORIENT_MAP = {
    xAxis: ['bottom', 'top'],
    yAxis: ['left', 'right'],
};
const FULL_WIDTH_AND_HEIGHT = { width: '100%', height: '100%' };
const originCoordinate = { x: 0, y: 0 };
function renderAsIs(element) {
    return element;
}
const calculateTooltipPos = (rangeObj, layout) => {
    if (layout === 'horizontal') {
        return rangeObj.x;
    }
    if (layout === 'vertical') {
        return rangeObj.y;
    }
    if (layout === 'centric') {
        return rangeObj.angle;
    }
    return rangeObj.radius;
};
const getActiveCoordinate = (layout, tooltipTicks, activeIndex, rangeObj) => {
    const entry = tooltipTicks.find(tick => tick && tick.index === activeIndex);
    if (entry) {
        if (layout === 'horizontal') {
            return { x: entry.coordinate, y: rangeObj.y };
        }
        if (layout === 'vertical') {
            return { x: rangeObj.x, y: entry.coordinate };
        }
        if (layout === 'centric') {
            const angle = entry.coordinate;
            const { radius } = rangeObj;
            return Object.assign(Object.assign(Object.assign({}, rangeObj), (0, PolarUtils_1.polarToCartesian)(rangeObj.cx, rangeObj.cy, radius, angle)), { angle,
                radius });
        }
        const radius = entry.coordinate;
        const { angle } = rangeObj;
        return Object.assign(Object.assign(Object.assign({}, rangeObj), (0, PolarUtils_1.polarToCartesian)(rangeObj.cx, rangeObj.cy, radius, angle)), { angle,
            radius });
    }
    return originCoordinate;
};
const getDisplayedData = (data, { graphicalItems, dataStartIndex, dataEndIndex, }) => {
    const itemsData = (graphicalItems !== null && graphicalItems !== void 0 ? graphicalItems : []).reduce((result, child) => {
        const itemData = child.props.data;
        if (itemData && itemData.length) {
            return [...result, ...itemData];
        }
        return result;
    }, []);
    if (itemsData.length > 0) {
        return itemsData;
    }
    if (data && data.length && (0, DataUtils_1.isNumber)(dataStartIndex) && (0, DataUtils_1.isNumber)(dataEndIndex)) {
        return data.slice(dataStartIndex, dataEndIndex + 1);
    }
    return [];
};
function getDefaultDomainByAxisType(axisType) {
    return axisType === 'number' ? [0, 'auto'] : undefined;
}
const getTooltipContent = (state, chartData, activeIndex, activeLabel) => {
    const { graphicalItems, tooltipAxis } = state;
    const displayedData = getDisplayedData(chartData, state);
    if (activeIndex < 0 || !graphicalItems || !graphicalItems.length || activeIndex >= displayedData.length) {
        return null;
    }
    return graphicalItems.reduce((result, child) => {
        var _a;
        let data = (_a = child.props.data) !== null && _a !== void 0 ? _a : chartData;
        if (data && state.dataStartIndex + state.dataEndIndex !== 0) {
            data = data.slice(state.dataStartIndex, state.dataEndIndex + 1);
        }
        let payload;
        if (tooltipAxis.dataKey && !tooltipAxis.allowDuplicatedCategory) {
            const entries = data === undefined ? displayedData : data;
            payload = (0, DataUtils_1.findEntryInArray)(entries, tooltipAxis.dataKey, activeLabel);
        }
        else {
            payload = (data && data[activeIndex]) || displayedData[activeIndex];
        }
        if (!payload) {
            return result;
        }
        return [...result, (0, ChartUtils_1.getTooltipItem)(child, payload)];
    }, []);
};
const getTooltipData = (state, chartData, layout, rangeObj) => {
    const rangeData = rangeObj || { x: state.chartX, y: state.chartY };
    const pos = calculateTooltipPos(rangeData, layout);
    const { orderedTooltipTicks: ticks, tooltipAxis: axis, tooltipTicks } = state;
    const activeIndex = (0, ChartUtils_1.calculateActiveTickIndex)(pos, ticks, tooltipTicks, axis);
    if (activeIndex >= 0 && tooltipTicks) {
        const activeLabel = tooltipTicks[activeIndex] && tooltipTicks[activeIndex].value;
        const activePayload = getTooltipContent(state, chartData, activeIndex, activeLabel);
        const activeCoordinate = getActiveCoordinate(layout, ticks, activeIndex, rangeData);
        return {
            activeTooltipIndex: activeIndex,
            activeLabel,
            activePayload,
            activeCoordinate,
        };
    }
    return null;
};
const getAxisMapByAxes = (props, { axes, graphicalItems, axisType, axisIdKey, stackGroups, dataStartIndex, dataEndIndex, }) => {
    const { layout, children, stackOffset } = props;
    const isCategorical = (0, ChartUtils_1.isCategoricalAxis)(layout, axisType);
    return axes.reduce((result, child) => {
        var _a, _b;
        const { type, dataKey, allowDataOverflow, allowDuplicatedCategory, scale, ticks, includeHidden } = child.props;
        const axisId = child.props[axisIdKey];
        if (result[axisId]) {
            return result;
        }
        const displayedData = getDisplayedData(props.data, {
            graphicalItems: graphicalItems.filter(item => item.props[axisIdKey] === axisId),
            dataStartIndex,
            dataEndIndex,
        });
        const len = displayedData.length;
        let domain, duplicateDomain, categoricalDomain;
        if ((0, isDomainSpecifiedByUser_1.isDomainSpecifiedByUser)(child.props.domain, allowDataOverflow, type)) {
            domain = (0, ChartUtils_1.parseSpecifiedDomain)(child.props.domain, null, allowDataOverflow);
            if (isCategorical && (type === 'number' || scale !== 'auto')) {
                categoricalDomain = (0, ChartUtils_1.getDomainOfDataByKey)(displayedData, dataKey, 'category');
            }
        }
        const defaultDomain = getDefaultDomainByAxisType(type);
        if (!domain || domain.length === 0) {
            const childDomain = (_a = child.props.domain) !== null && _a !== void 0 ? _a : defaultDomain;
            if (dataKey) {
                domain = (0, ChartUtils_1.getDomainOfDataByKey)(displayedData, dataKey, type);
                if (type === 'category' && isCategorical) {
                    const duplicate = (0, DataUtils_1.hasDuplicate)(domain);
                    if (allowDuplicatedCategory && duplicate) {
                        duplicateDomain = domain;
                        domain = (0, range_1.default)(0, len);
                    }
                    else if (!allowDuplicatedCategory) {
                        domain = (0, ChartUtils_1.parseDomainOfCategoryAxis)(childDomain, domain, child).reduce((finalDomain, entry) => finalDomain.indexOf(entry) >= 0 ? finalDomain : [...finalDomain, entry], []);
                    }
                }
                else if (type === 'category') {
                    if (!allowDuplicatedCategory) {
                        domain = (0, ChartUtils_1.parseDomainOfCategoryAxis)(childDomain, domain, child).reduce((finalDomain, entry) => finalDomain.indexOf(entry) >= 0 || entry === '' || (0, isNil_1.default)(entry) ? finalDomain : [...finalDomain, entry], []);
                    }
                    else {
                        domain = domain.filter((entry) => entry !== '' && !(0, isNil_1.default)(entry));
                    }
                }
                else if (type === 'number') {
                    const errorBarsDomain = (0, ChartUtils_1.parseErrorBarsOfAxis)(displayedData, graphicalItems.filter(item => item.props[axisIdKey] === axisId && (includeHidden || !item.props.hide)), dataKey, axisType, layout);
                    if (errorBarsDomain) {
                        domain = errorBarsDomain;
                    }
                }
                if (isCategorical && (type === 'number' || scale !== 'auto')) {
                    categoricalDomain = (0, ChartUtils_1.getDomainOfDataByKey)(displayedData, dataKey, 'category');
                }
            }
            else if (isCategorical) {
                domain = (0, range_1.default)(0, len);
            }
            else if (stackGroups && stackGroups[axisId] && stackGroups[axisId].hasStack && type === 'number') {
                domain =
                    stackOffset === 'expand'
                        ? [0, 1]
                        : (0, ChartUtils_1.getDomainOfStackGroups)(stackGroups[axisId].stackGroups, dataStartIndex, dataEndIndex);
            }
            else {
                domain = (0, ChartUtils_1.getDomainOfItemsWithSameAxis)(displayedData, graphicalItems.filter(item => item.props[axisIdKey] === axisId && (includeHidden || !item.props.hide)), type, layout, true);
            }
            if (type === 'number') {
                domain = (0, DetectReferenceElementsDomain_1.detectReferenceElementsDomain)(children, domain, axisId, axisType, ticks);
                if (childDomain) {
                    domain = (0, ChartUtils_1.parseSpecifiedDomain)(childDomain, domain, allowDataOverflow);
                }
            }
            else if (type === 'category' && childDomain) {
                const axisDomain = childDomain;
                const isDomainValid = domain.every((entry) => axisDomain.indexOf(entry) >= 0);
                if (isDomainValid) {
                    domain = axisDomain;
                }
            }
        }
        return Object.assign(Object.assign({}, result), { [axisId]: Object.assign(Object.assign({}, child.props), { axisType,
                domain,
                categoricalDomain,
                duplicateDomain, originalDomain: (_b = child.props.domain) !== null && _b !== void 0 ? _b : defaultDomain, isCategorical,
                layout }) });
    }, {});
};
exports.getAxisMapByAxes = getAxisMapByAxes;
const getAxisMapByItems = (props, { graphicalItems, Axis, axisType, axisIdKey, stackGroups, dataStartIndex, dataEndIndex, }) => {
    const { layout, children } = props;
    const displayedData = getDisplayedData(props.data, {
        graphicalItems,
        dataStartIndex,
        dataEndIndex,
    });
    const len = displayedData.length;
    const isCategorical = (0, ChartUtils_1.isCategoricalAxis)(layout, axisType);
    let index = -1;
    return graphicalItems.reduce((result, child) => {
        const axisId = child.props[axisIdKey];
        const originalDomain = getDefaultDomainByAxisType('number');
        if (!result[axisId]) {
            index++;
            let domain;
            if (isCategorical) {
                domain = (0, range_1.default)(0, len);
            }
            else if (stackGroups && stackGroups[axisId] && stackGroups[axisId].hasStack) {
                domain = (0, ChartUtils_1.getDomainOfStackGroups)(stackGroups[axisId].stackGroups, dataStartIndex, dataEndIndex);
                domain = (0, DetectReferenceElementsDomain_1.detectReferenceElementsDomain)(children, domain, axisId, axisType);
            }
            else {
                domain = (0, ChartUtils_1.parseSpecifiedDomain)(originalDomain, (0, ChartUtils_1.getDomainOfItemsWithSameAxis)(displayedData, graphicalItems.filter((item) => item.props[axisIdKey] === axisId && !item.props.hide), 'number', layout), Axis.defaultProps.allowDataOverflow);
                domain = (0, DetectReferenceElementsDomain_1.detectReferenceElementsDomain)(children, domain, axisId, axisType);
            }
            return Object.assign(Object.assign({}, result), { [axisId]: Object.assign(Object.assign({ axisType }, Axis.defaultProps), { hide: true, orientation: (0, get_1.default)(ORIENT_MAP, `${axisType}.${index % 2}`, null), domain,
                    originalDomain,
                    isCategorical,
                    layout }) });
        }
        return result;
    }, {});
};
const getAxisMap = (props, { axisType = 'xAxis', AxisComp, graphicalItems, stackGroups, dataStartIndex, dataEndIndex, }) => {
    const { children } = props;
    const axisIdKey = `${axisType}Id`;
    const axes = (0, ReactUtils_1.findAllByType)(children, AxisComp);
    let axisMap = {};
    if (axes && axes.length) {
        axisMap = (0, exports.getAxisMapByAxes)(props, {
            axes,
            graphicalItems,
            axisType,
            axisIdKey,
            stackGroups,
            dataStartIndex,
            dataEndIndex,
        });
    }
    else if (graphicalItems && graphicalItems.length) {
        axisMap = getAxisMapByItems(props, {
            Axis: AxisComp,
            graphicalItems,
            axisType,
            axisIdKey,
            stackGroups,
            dataStartIndex,
            dataEndIndex,
        });
    }
    return axisMap;
};
const tooltipTicksGenerator = (axisMap) => {
    const axis = (0, DataUtils_1.getAnyElementOfObject)(axisMap);
    const tooltipTicks = (0, ChartUtils_1.getTicksOfAxis)(axis, false, true);
    return {
        tooltipTicks,
        orderedTooltipTicks: (0, sortBy_1.default)(tooltipTicks, o => o.coordinate),
        tooltipAxis: axis,
        tooltipAxisBandSize: (0, ChartUtils_1.getBandSizeOfAxis)(axis, tooltipTicks),
    };
};
const createDefaultState = (props) => {
    const { children, defaultShowTooltip } = props;
    const brushItem = (0, ReactUtils_1.findChildByType)(children, Brush_1.Brush);
    let startIndex = 0;
    let endIndex = 0;
    if (props.data && props.data.length !== 0) {
        endIndex = props.data.length - 1;
    }
    if (brushItem && brushItem.props) {
        if (brushItem.props.startIndex >= 0) {
            startIndex = brushItem.props.startIndex;
        }
        if (brushItem.props.endIndex >= 0) {
            endIndex = brushItem.props.endIndex;
        }
    }
    return {
        chartX: 0,
        chartY: 0,
        dataStartIndex: startIndex,
        dataEndIndex: endIndex,
        activeTooltipIndex: -1,
        isTooltipActive: Boolean(defaultShowTooltip),
    };
};
exports.createDefaultState = createDefaultState;
const hasGraphicalBarItem = (graphicalItems) => {
    if (!graphicalItems || !graphicalItems.length) {
        return false;
    }
    return graphicalItems.some(item => {
        const name = (0, ReactUtils_1.getDisplayName)(item && item.type);
        return name && name.indexOf('Bar') >= 0;
    });
};
const getAxisNameByLayout = (layout) => {
    if (layout === 'horizontal') {
        return { numericAxisName: 'yAxis', cateAxisName: 'xAxis' };
    }
    if (layout === 'vertical') {
        return { numericAxisName: 'xAxis', cateAxisName: 'yAxis' };
    }
    if (layout === 'centric') {
        return { numericAxisName: 'radiusAxis', cateAxisName: 'angleAxis' };
    }
    return { numericAxisName: 'angleAxis', cateAxisName: 'radiusAxis' };
};
const calculateOffset = ({ props, xAxisMap = {}, yAxisMap = {}, }, prevLegendBBox) => {
    const { width, height, children } = props;
    const margin = props.margin || {};
    const brushItem = (0, ReactUtils_1.findChildByType)(children, Brush_1.Brush);
    const legendItem = (0, ReactUtils_1.findChildByType)(children, Legend_1.Legend);
    const offsetH = Object.keys(yAxisMap).reduce((result, id) => {
        const entry = yAxisMap[id];
        const { orientation } = entry;
        if (!entry.mirror && !entry.hide) {
            return Object.assign(Object.assign({}, result), { [orientation]: result[orientation] + entry.width });
        }
        return result;
    }, { left: margin.left || 0, right: margin.right || 0 });
    const offsetV = Object.keys(xAxisMap).reduce((result, id) => {
        const entry = xAxisMap[id];
        const { orientation } = entry;
        if (!entry.mirror && !entry.hide) {
            return Object.assign(Object.assign({}, result), { [orientation]: (0, get_1.default)(result, `${orientation}`) + entry.height });
        }
        return result;
    }, { top: margin.top || 0, bottom: margin.bottom || 0 });
    let offset = Object.assign(Object.assign({}, offsetV), offsetH);
    const brushBottom = offset.bottom;
    if (brushItem) {
        offset.bottom += brushItem.props.height || Brush_1.Brush.defaultProps.height;
    }
    if (legendItem && prevLegendBBox) {
        offset = (0, ChartUtils_1.appendOffsetOfLegend)(offset, props, prevLegendBBox);
    }
    const offsetWidth = width - offset.left - offset.right;
    const offsetHeight = height - offset.top - offset.bottom;
    return Object.assign(Object.assign({ brushBottom }, offset), { width: Math.max(offsetWidth, 0), height: Math.max(offsetHeight, 0) });
};
const generateCategoricalChart = ({ chartName, GraphicalChild, defaultTooltipEventType = 'axis', validateTooltipEventTypes = ['axis'], axisComponents, formatAxisMap, defaultProps, }) => {
    var _a;
    const getFormatItems = (props, currentState) => {
        const { graphicalItems, stackGroups, offset, updateId, dataStartIndex, dataEndIndex } = currentState;
        const { barSize, layout, barGap, barCategoryGap, maxBarSize: globalMaxBarSize } = props;
        const { numericAxisName, cateAxisName } = getAxisNameByLayout(layout);
        const hasBar = hasGraphicalBarItem(graphicalItems);
        const sizeList = hasBar && (0, ChartUtils_1.getBarSizeList)({ barSize, stackGroups });
        const formattedItems = [];
        graphicalItems.forEach((item, index) => {
            var _b, _c;
            const displayedData = getDisplayedData(props.data, { graphicalItems: [item], dataStartIndex, dataEndIndex });
            const { dataKey, maxBarSize: childMaxBarSize } = item.props;
            const numericAxisId = item.props[`${numericAxisName}Id`];
            const cateAxisId = item.props[`${cateAxisName}Id`];
            const axisObjInitialValue = {};
            const axisObj = axisComponents.reduce((result, entry) => {
                var _b, _c;
                const axisMap = currentState[`${entry.axisType}Map`];
                const id = item.props[`${entry.axisType}Id`];
                (0, tiny_invariant_1.default)((axisMap && axisMap[id]) || entry.axisType === 'zAxis', `Specifying a(n) ${entry.axisType}Id requires a corresponding ${entry.axisType}Id on the targeted graphical component ${(_c = (_b = item === null || item === void 0 ? void 0 : item.type) === null || _b === void 0 ? void 0 : _b.displayName) !== null && _c !== void 0 ? _c : ''}`);
                const axis = axisMap[id];
                return Object.assign(Object.assign({}, result), { [entry.axisType]: axis, [`${entry.axisType}Ticks`]: (0, ChartUtils_1.getTicksOfAxis)(axis) });
            }, axisObjInitialValue);
            const cateAxis = axisObj[cateAxisName];
            const cateTicks = axisObj[`${cateAxisName}Ticks`];
            const stackedData = stackGroups &&
                stackGroups[numericAxisId] &&
                stackGroups[numericAxisId].hasStack &&
                (0, ChartUtils_1.getStackedDataOfItem)(item, stackGroups[numericAxisId].stackGroups);
            const itemIsBar = (0, ReactUtils_1.getDisplayName)(item.type).indexOf('Bar') >= 0;
            const bandSize = (0, ChartUtils_1.getBandSizeOfAxis)(cateAxis, cateTicks);
            let barPosition = [];
            if (itemIsBar) {
                const maxBarSize = (0, isNil_1.default)(childMaxBarSize) ? globalMaxBarSize : childMaxBarSize;
                const barBandSize = (_c = (_b = (0, ChartUtils_1.getBandSizeOfAxis)(cateAxis, cateTicks, true)) !== null && _b !== void 0 ? _b : maxBarSize) !== null && _c !== void 0 ? _c : 0;
                barPosition = (0, ChartUtils_1.getBarPosition)({
                    barGap,
                    barCategoryGap,
                    bandSize: barBandSize !== bandSize ? barBandSize : bandSize,
                    sizeList: sizeList[cateAxisId],
                    maxBarSize,
                });
                if (barBandSize !== bandSize) {
                    barPosition = barPosition.map(pos => (Object.assign(Object.assign({}, pos), { position: Object.assign(Object.assign({}, pos.position), { offset: pos.position.offset - barBandSize / 2 }) })));
                }
            }
            const composedFn = item && item.type && item.type.getComposedData;
            if (composedFn) {
                formattedItems.push({
                    props: Object.assign(Object.assign({}, composedFn(Object.assign(Object.assign({}, axisObj), { displayedData,
                        props,
                        dataKey,
                        item,
                        bandSize,
                        barPosition,
                        offset,
                        stackedData,
                        layout,
                        dataStartIndex,
                        dataEndIndex }))), { key: item.key || `item-${index}`, [numericAxisName]: axisObj[numericAxisName], [cateAxisName]: axisObj[cateAxisName], animationId: updateId }),
                    childIndex: (0, ReactUtils_1.parseChildIndex)(item, props.children),
                    item,
                });
            }
        });
        return formattedItems;
    };
    const updateStateOfAxisMapsOffsetAndStackGroups = ({ props, dataStartIndex, dataEndIndex, updateId }, prevState) => {
        if (!(0, ReactUtils_1.validateWidthHeight)({ props })) {
            return null;
        }
        const { children, layout, stackOffset, data, reverseStackOrder } = props;
        const { numericAxisName, cateAxisName } = getAxisNameByLayout(layout);
        const graphicalItems = (0, ReactUtils_1.findAllByType)(children, GraphicalChild);
        const stackGroups = (0, ChartUtils_1.getStackGroupsByAxisId)(data, graphicalItems, `${numericAxisName}Id`, `${cateAxisName}Id`, stackOffset, reverseStackOrder);
        const axisObj = axisComponents.reduce((result, entry) => {
            const name = `${entry.axisType}Map`;
            return Object.assign(Object.assign({}, result), { [name]: getAxisMap(props, Object.assign(Object.assign({}, entry), { graphicalItems, stackGroups: entry.axisType === numericAxisName && stackGroups, dataStartIndex,
                    dataEndIndex })) });
        }, {});
        const offset = calculateOffset(Object.assign(Object.assign({}, axisObj), { props }), prevState === null || prevState === void 0 ? void 0 : prevState.legendBBox);
        Object.keys(axisObj).forEach(key => {
            axisObj[key] = formatAxisMap(props, axisObj[key], offset, key.replace('Map', ''), chartName);
        });
        const cateAxisMap = axisObj[`${cateAxisName}Map`];
        const ticksObj = tooltipTicksGenerator(cateAxisMap);
        const formattedGraphicalItems = getFormatItems(props, Object.assign(Object.assign({}, axisObj), { dataStartIndex,
            dataEndIndex,
            updateId,
            graphicalItems,
            stackGroups,
            offset }));
        return Object.assign(Object.assign({ formattedGraphicalItems,
            graphicalItems,
            offset,
            stackGroups }, ticksObj), axisObj);
    };
    return _a = class CategoricalChartWrapper extends react_1.Component {
            constructor(props) {
                var _b, _c;
                super(props);
                this.eventEmitterSymbol = Symbol('rechartsEventEmitter');
                this.accessibilityManager = new AccessibilityManager_1.AccessibilityManager();
                this.handleLegendBBoxUpdate = (box) => {
                    if (box) {
                        const { dataStartIndex, dataEndIndex, updateId } = this.state;
                        this.setState(Object.assign({ legendBBox: box }, updateStateOfAxisMapsOffsetAndStackGroups({
                            props: this.props,
                            dataStartIndex,
                            dataEndIndex,
                            updateId,
                        }, Object.assign(Object.assign({}, this.state), { legendBBox: box }))));
                    }
                };
                this.handleReceiveSyncEvent = (cId, data, emitter) => {
                    if (this.props.syncId === cId) {
                        if (emitter === this.eventEmitterSymbol && typeof this.props.syncMethod !== 'function') {
                            return;
                        }
                        this.applySyncEvent(data);
                    }
                };
                this.handleBrushChange = ({ startIndex, endIndex }) => {
                    if (startIndex !== this.state.dataStartIndex || endIndex !== this.state.dataEndIndex) {
                        const { updateId } = this.state;
                        this.setState(() => (Object.assign({ dataStartIndex: startIndex, dataEndIndex: endIndex }, updateStateOfAxisMapsOffsetAndStackGroups({
                            props: this.props,
                            dataStartIndex: startIndex,
                            dataEndIndex: endIndex,
                            updateId,
                        }, this.state))));
                        this.triggerSyncEvent({
                            dataStartIndex: startIndex,
                            dataEndIndex: endIndex,
                        });
                    }
                };
                this.handleMouseEnter = (e) => {
                    const mouse = this.getMouseInfo(e);
                    if (mouse) {
                        const nextState = Object.assign(Object.assign({}, mouse), { isTooltipActive: true });
                        this.setState(nextState);
                        this.triggerSyncEvent(nextState);
                        const { onMouseEnter } = this.props;
                        if ((0, isFunction_1.default)(onMouseEnter)) {
                            onMouseEnter(nextState, e);
                        }
                    }
                };
                this.triggeredAfterMouseMove = (e) => {
                    const mouse = this.getMouseInfo(e);
                    const nextState = mouse ? Object.assign(Object.assign({}, mouse), { isTooltipActive: true }) : { isTooltipActive: false };
                    this.setState(nextState);
                    this.triggerSyncEvent(nextState);
                    const { onMouseMove } = this.props;
                    if ((0, isFunction_1.default)(onMouseMove)) {
                        onMouseMove(nextState, e);
                    }
                };
                this.handleItemMouseEnter = (el) => {
                    this.setState(() => ({
                        isTooltipActive: true,
                        activeItem: el,
                        activePayload: el.tooltipPayload,
                        activeCoordinate: el.tooltipPosition || { x: el.cx, y: el.cy },
                    }));
                };
                this.handleItemMouseLeave = () => {
                    this.setState(() => ({
                        isTooltipActive: false,
                    }));
                };
                this.handleMouseMove = (e) => {
                    e.persist();
                    this.throttleTriggeredAfterMouseMove(e);
                };
                this.handleMouseLeave = (e) => {
                    this.throttleTriggeredAfterMouseMove.cancel();
                    const nextState = { isTooltipActive: false };
                    this.setState(nextState);
                    this.triggerSyncEvent(nextState);
                    const { onMouseLeave } = this.props;
                    if ((0, isFunction_1.default)(onMouseLeave)) {
                        onMouseLeave(nextState, e);
                    }
                };
                this.handleOuterEvent = (e) => {
                    const eventName = (0, ReactUtils_1.getReactEventByType)(e);
                    const event = (0, get_1.default)(this.props, `${eventName}`);
                    if (eventName && (0, isFunction_1.default)(event)) {
                        let mouse;
                        if (/.*touch.*/i.test(eventName)) {
                            mouse = this.getMouseInfo(e.changedTouches[0]);
                        }
                        else {
                            mouse = this.getMouseInfo(e);
                        }
                        event(mouse !== null && mouse !== void 0 ? mouse : {}, e);
                    }
                };
                this.handleClick = (e) => {
                    const mouse = this.getMouseInfo(e);
                    if (mouse) {
                        const nextState = Object.assign(Object.assign({}, mouse), { isTooltipActive: true });
                        this.setState(nextState);
                        this.triggerSyncEvent(nextState);
                        const { onClick } = this.props;
                        if ((0, isFunction_1.default)(onClick)) {
                            onClick(nextState, e);
                        }
                    }
                };
                this.handleMouseDown = (e) => {
                    const { onMouseDown } = this.props;
                    if ((0, isFunction_1.default)(onMouseDown)) {
                        const nextState = this.getMouseInfo(e);
                        onMouseDown(nextState, e);
                    }
                };
                this.handleMouseUp = (e) => {
                    const { onMouseUp } = this.props;
                    if ((0, isFunction_1.default)(onMouseUp)) {
                        const nextState = this.getMouseInfo(e);
                        onMouseUp(nextState, e);
                    }
                };
                this.handleTouchMove = (e) => {
                    if (e.changedTouches != null && e.changedTouches.length > 0) {
                        this.throttleTriggeredAfterMouseMove(e.changedTouches[0]);
                    }
                };
                this.handleTouchStart = (e) => {
                    if (e.changedTouches != null && e.changedTouches.length > 0) {
                        this.handleMouseDown(e.changedTouches[0]);
                    }
                };
                this.handleTouchEnd = (e) => {
                    if (e.changedTouches != null && e.changedTouches.length > 0) {
                        this.handleMouseUp(e.changedTouches[0]);
                    }
                };
                this.triggerSyncEvent = (data) => {
                    if (this.props.syncId !== undefined) {
                        Events_1.eventCenter.emit(Events_1.SYNC_EVENT, this.props.syncId, data, this.eventEmitterSymbol);
                    }
                };
                this.applySyncEvent = (data) => {
                    const { layout, syncMethod } = this.props;
                    const { updateId } = this.state;
                    const { dataStartIndex, dataEndIndex } = data;
                    if (data.dataStartIndex !== undefined || data.dataEndIndex !== undefined) {
                        this.setState(Object.assign({ dataStartIndex,
                            dataEndIndex }, updateStateOfAxisMapsOffsetAndStackGroups({
                            props: this.props,
                            dataStartIndex,
                            dataEndIndex,
                            updateId,
                        }, this.state)));
                    }
                    else if (data.activeTooltipIndex !== undefined) {
                        const { chartX, chartY } = data;
                        let { activeTooltipIndex } = data;
                        const { offset, tooltipTicks } = this.state;
                        if (!offset) {
                            return;
                        }
                        if (typeof syncMethod === 'function') {
                            activeTooltipIndex = syncMethod(tooltipTicks, data);
                        }
                        else if (syncMethod === 'value') {
                            activeTooltipIndex = -1;
                            for (let i = 0; i < tooltipTicks.length; i++) {
                                if (tooltipTicks[i].value === data.activeLabel) {
                                    activeTooltipIndex = i;
                                    break;
                                }
                            }
                        }
                        const viewBox = Object.assign(Object.assign({}, offset), { x: offset.left, y: offset.top });
                        const validateChartX = Math.min(chartX, viewBox.x + viewBox.width);
                        const validateChartY = Math.min(chartY, viewBox.y + viewBox.height);
                        const activeLabel = tooltipTicks[activeTooltipIndex] && tooltipTicks[activeTooltipIndex].value;
                        const activePayload = getTooltipContent(this.state, this.props.data, activeTooltipIndex);
                        const activeCoordinate = tooltipTicks[activeTooltipIndex]
                            ? {
                                x: layout === 'horizontal' ? tooltipTicks[activeTooltipIndex].coordinate : validateChartX,
                                y: layout === 'horizontal' ? validateChartY : tooltipTicks[activeTooltipIndex].coordinate,
                            }
                            : originCoordinate;
                        this.setState(Object.assign(Object.assign({}, data), { activeLabel,
                            activeCoordinate,
                            activePayload,
                            activeTooltipIndex }));
                    }
                    else {
                        this.setState(data);
                    }
                };
                this.renderCursor = (element) => {
                    const { tooltipAxisBandSize } = this.state;
                    const tooltipEventType = this.getTooltipEventType();
                    const { layout } = this.props;
                    const key = element.key || '_recharts-cursor';
                    return (react_1.default.createElement(Cursor_1.Cursor, { key: key, chartName: chartName, element: element, layout: layout, tooltipAxisBandSize: tooltipAxisBandSize, tooltipEventType: tooltipEventType }));
                };
                this.renderTooltip = () => {
                    const { children } = this.props;
                    const tooltipItem = (0, ReactUtils_1.findChildByType)(children, Tooltip_1.Tooltip);
                    return tooltipItem;
                };
                this.renderActivePoints = ({ item, activePoint, basePoint, childIndex, isRange, }) => {
                    const result = [];
                    const { key } = item.props;
                    const { activeDot, dataKey } = item.item.props;
                    const dotProps = Object.assign(Object.assign({ index: childIndex, dataKey, cx: activePoint.x, cy: activePoint.y, r: 4, fill: (0, ChartUtils_1.getMainColorOfGraphicItem)(item.item), strokeWidth: 2, stroke: '#fff', payload: activePoint.payload, value: activePoint.value, key: `${key}-activePoint-${childIndex}` }, (0, ReactUtils_1.filterProps)(activeDot, false)), (0, types_1.adaptEventHandlers)(activeDot));
                    result.push(_a.renderActiveDot(activeDot, dotProps));
                    if (basePoint) {
                        result.push(_a.renderActiveDot(activeDot, Object.assign(Object.assign({}, dotProps), { cx: basePoint.x, cy: basePoint.y, key: `${key}-basePoint-${childIndex}` })));
                    }
                    else if (isRange) {
                        result.push(null);
                    }
                    return result;
                };
                this.renderGraphicChild = (element, displayName, index) => {
                    var _b;
                    const item = this.filterFormatItem(element, displayName, index);
                    if (!item) {
                        return null;
                    }
                    const tooltipEventType = this.getTooltipEventType();
                    const { isTooltipActive, tooltipAxis, activeTooltipIndex, activeLabel } = this.state;
                    const { children } = this.props;
                    const tooltipItem = (0, ReactUtils_1.findChildByType)(children, Tooltip_1.Tooltip);
                    const { points, isRange, baseLine } = item.props;
                    const { activeDot, hide, activeBar, activeShape } = item.item.props;
                    const hasActive = Boolean(!hide && isTooltipActive && tooltipItem && (activeDot || activeBar || activeShape));
                    let itemEvents = {};
                    if (tooltipEventType !== 'axis' && tooltipItem && tooltipItem.props.trigger === 'click') {
                        itemEvents = {
                            onClick: (0, ChartUtils_1.combineEventHandlers)(this.handleItemMouseEnter, element.props.onClick),
                        };
                    }
                    else if (tooltipEventType !== 'axis') {
                        itemEvents = {
                            onMouseLeave: (0, ChartUtils_1.combineEventHandlers)(this.handleItemMouseLeave, element.props.onMouseLeave),
                            onMouseEnter: (0, ChartUtils_1.combineEventHandlers)(this.handleItemMouseEnter, element.props.onMouseEnter),
                        };
                    }
                    const graphicalItem = (0, react_1.cloneElement)(element, Object.assign(Object.assign({}, item.props), itemEvents));
                    function findWithPayload(entry) {
                        return typeof tooltipAxis.dataKey === 'function' ? tooltipAxis.dataKey(entry.payload) : null;
                    }
                    if (hasActive) {
                        if (activeTooltipIndex >= 0) {
                            let activePoint, basePoint;
                            if (tooltipAxis.dataKey && !tooltipAxis.allowDuplicatedCategory) {
                                const specifiedKey = typeof tooltipAxis.dataKey === 'function'
                                    ? findWithPayload
                                    : 'payload.'.concat(tooltipAxis.dataKey.toString());
                                activePoint = (0, DataUtils_1.findEntryInArray)(points, specifiedKey, activeLabel);
                                basePoint = isRange && baseLine && (0, DataUtils_1.findEntryInArray)(baseLine, specifiedKey, activeLabel);
                            }
                            else {
                                activePoint = points === null || points === void 0 ? void 0 : points[activeTooltipIndex];
                                basePoint = isRange && baseLine && baseLine[activeTooltipIndex];
                            }
                            if (activeShape || activeBar) {
                                const activeIndex = element.props.activeIndex !== undefined ? element.props.activeIndex : activeTooltipIndex;
                                return [(0, react_1.cloneElement)(element, Object.assign(Object.assign(Object.assign({}, item.props), itemEvents), { activeIndex })), null, null];
                            }
                            if (!(0, isNil_1.default)(activePoint)) {
                                return [
                                    graphicalItem,
                                    ...this.renderActivePoints({
                                        item,
                                        activePoint,
                                        basePoint,
                                        childIndex: activeTooltipIndex,
                                        isRange,
                                    }),
                                ];
                            }
                        }
                        else {
                            const { graphicalItem: { item: xyItem = element, childIndex }, } = (_b = this.getItemByXY(this.state.activeCoordinate)) !== null && _b !== void 0 ? _b : { graphicalItem };
                            const elementProps = Object.assign(Object.assign(Object.assign({}, item.props), itemEvents), { activeIndex: childIndex });
                            return [(0, react_1.cloneElement)(xyItem, elementProps), null, null];
                        }
                    }
                    if (isRange) {
                        return [graphicalItem, null, null];
                    }
                    return [graphicalItem, null];
                };
                this.renderCustomized = (element, displayName, index) => (0, react_1.cloneElement)(element, Object.assign(Object.assign({ key: `recharts-customized-${index}` }, this.props), this.state));
                this.renderMap = {
                    CartesianGrid: { handler: renderAsIs, once: true },
                    ReferenceArea: { handler: renderAsIs },
                    ReferenceLine: { handler: renderAsIs },
                    ReferenceDot: { handler: renderAsIs },
                    XAxis: { handler: renderAsIs },
                    YAxis: { handler: renderAsIs },
                    Brush: { handler: renderAsIs },
                    Bar: { handler: this.renderGraphicChild },
                    Line: { handler: this.renderGraphicChild },
                    Area: { handler: this.renderGraphicChild },
                    Radar: { handler: this.renderGraphicChild },
                    RadialBar: { handler: this.renderGraphicChild },
                    Scatter: { handler: this.renderGraphicChild },
                    Pie: { handler: this.renderGraphicChild },
                    Funnel: { handler: this.renderGraphicChild },
                    Tooltip: { handler: this.renderCursor, once: true },
                    PolarGrid: { handler: renderAsIs, once: true },
                    PolarAngleAxis: { handler: renderAsIs },
                    PolarRadiusAxis: { handler: renderAsIs },
                    Customized: { handler: this.renderCustomized },
                    Legend: { handler: renderAsIs },
                };
                this.clipPathId = `${(_b = props.id) !== null && _b !== void 0 ? _b : (0, DataUtils_1.uniqueId)('recharts')}-clip`;
                this.throttleTriggeredAfterMouseMove = (0, throttle_1.default)(this.triggeredAfterMouseMove, (_c = props.throttleDelay) !== null && _c !== void 0 ? _c : 1000 / 60);
                this.state = {};
            }
            componentDidMount() {
                var _b, _c;
                this.addListener();
                this.accessibilityManager.setDetails({
                    container: this.container,
                    offset: {
                        left: (_b = this.props.margin.left) !== null && _b !== void 0 ? _b : 0,
                        top: (_c = this.props.margin.top) !== null && _c !== void 0 ? _c : 0,
                    },
                    coordinateList: this.state.tooltipTicks,
                    mouseHandlerCallback: this.triggeredAfterMouseMove,
                    layout: this.props.layout,
                    ltr: (0, ChartUtils_1.isAxisLTR)(this.state.xAxisMap),
                });
                this.displayDefaultTooltip();
            }
            displayDefaultTooltip() {
                const { children, data, height, layout } = this.props;
                const tooltipElem = (0, ReactUtils_1.findChildByType)(children, Tooltip_1.Tooltip);
                if (!tooltipElem) {
                    return;
                }
                const { defaultIndex } = tooltipElem.props;
                if (typeof defaultIndex !== 'number' || defaultIndex < 0 || defaultIndex > this.state.tooltipTicks.length) {
                    return;
                }
                const activeLabel = this.state.tooltipTicks[defaultIndex] && this.state.tooltipTicks[defaultIndex].value;
                let activePayload = getTooltipContent(this.state, data, defaultIndex, activeLabel);
                const independentAxisCoord = this.state.tooltipTicks[defaultIndex].coordinate;
                const dependentAxisCoord = (this.state.offset.top + height) / 2;
                const isHorizontal = layout === 'horizontal';
                let activeCoordinate = isHorizontal
                    ? {
                        x: independentAxisCoord,
                        y: dependentAxisCoord,
                    }
                    : {
                        y: independentAxisCoord,
                        x: dependentAxisCoord,
                    };
                const scatterPlotElement = this.state.formattedGraphicalItems.find(({ item }) => item.type.name === 'Scatter');
                if (scatterPlotElement) {
                    activeCoordinate = Object.assign(Object.assign({}, activeCoordinate), scatterPlotElement.props.points[defaultIndex].tooltipPosition);
                    activePayload = scatterPlotElement.props.points[defaultIndex].tooltipPayload;
                }
                const nextState = {
                    activeTooltipIndex: defaultIndex,
                    isTooltipActive: true,
                    activeLabel,
                    activePayload,
                    activeCoordinate,
                };
                this.setState(nextState);
                this.renderCursor(tooltipElem);
                this.accessibilityManager.setIndex(defaultIndex);
            }
            getSnapshotBeforeUpdate(prevProps, prevState) {
                var _b, _c;
                if (!this.props.accessibilityLayer) {
                    return null;
                }
                if (this.state.tooltipTicks !== prevState.tooltipTicks) {
                    this.accessibilityManager.setDetails({
                        coordinateList: this.state.tooltipTicks,
                    });
                }
                if (this.state.xAxisMap !== prevState.xAxisMap) {
                    this.accessibilityManager.setDetails({
                        ltr: (0, ChartUtils_1.isAxisLTR)(this.state.xAxisMap),
                    });
                }
                if (this.props.layout !== prevProps.layout) {
                    this.accessibilityManager.setDetails({
                        layout: this.props.layout,
                    });
                }
                if (this.props.margin !== prevProps.margin) {
                    this.accessibilityManager.setDetails({
                        offset: {
                            left: (_b = this.props.margin.left) !== null && _b !== void 0 ? _b : 0,
                            top: (_c = this.props.margin.top) !== null && _c !== void 0 ? _c : 0,
                        },
                    });
                }
                return null;
            }
            componentDidUpdate(prevProps) {
                if (!(0, ReactUtils_1.isChildrenEqual)([(0, ReactUtils_1.findChildByType)(prevProps.children, Tooltip_1.Tooltip)], [(0, ReactUtils_1.findChildByType)(this.props.children, Tooltip_1.Tooltip)])) {
                    this.displayDefaultTooltip();
                }
            }
            componentWillUnmount() {
                this.removeListener();
                this.throttleTriggeredAfterMouseMove.cancel();
            }
            getTooltipEventType() {
                const tooltipItem = (0, ReactUtils_1.findChildByType)(this.props.children, Tooltip_1.Tooltip);
                if (tooltipItem && typeof tooltipItem.props.shared === 'boolean') {
                    const eventType = tooltipItem.props.shared ? 'axis' : 'item';
                    return validateTooltipEventTypes.indexOf(eventType) >= 0 ? eventType : defaultTooltipEventType;
                }
                return defaultTooltipEventType;
            }
            getMouseInfo(event) {
                if (!this.container) {
                    return null;
                }
                const element = this.container;
                const boundingRect = element.getBoundingClientRect();
                const containerOffset = (0, DOMUtils_1.getOffset)(boundingRect);
                const e = {
                    chartX: Math.round(event.pageX - containerOffset.left),
                    chartY: Math.round(event.pageY - containerOffset.top),
                };
                const scale = boundingRect.width / element.offsetWidth || 1;
                const rangeObj = this.inRange(e.chartX, e.chartY, scale);
                if (!rangeObj) {
                    return null;
                }
                const { xAxisMap, yAxisMap } = this.state;
                const tooltipEventType = this.getTooltipEventType();
                if (tooltipEventType !== 'axis' && xAxisMap && yAxisMap) {
                    const xScale = (0, DataUtils_1.getAnyElementOfObject)(xAxisMap).scale;
                    const yScale = (0, DataUtils_1.getAnyElementOfObject)(yAxisMap).scale;
                    const xValue = xScale && xScale.invert ? xScale.invert(e.chartX) : null;
                    const yValue = yScale && yScale.invert ? yScale.invert(e.chartY) : null;
                    return Object.assign(Object.assign({}, e), { xValue, yValue });
                }
                const toolTipData = getTooltipData(this.state, this.props.data, this.props.layout, rangeObj);
                if (toolTipData) {
                    return Object.assign(Object.assign({}, e), toolTipData);
                }
                return null;
            }
            inRange(x, y, scale = 1) {
                const { layout } = this.props;
                const [scaledX, scaledY] = [x / scale, y / scale];
                if (layout === 'horizontal' || layout === 'vertical') {
                    const { offset } = this.state;
                    const isInRange = scaledX >= offset.left &&
                        scaledX <= offset.left + offset.width &&
                        scaledY >= offset.top &&
                        scaledY <= offset.top + offset.height;
                    return isInRange ? { x: scaledX, y: scaledY } : null;
                }
                const { angleAxisMap, radiusAxisMap } = this.state;
                if (angleAxisMap && radiusAxisMap) {
                    const angleAxis = (0, DataUtils_1.getAnyElementOfObject)(angleAxisMap);
                    return (0, PolarUtils_1.inRangeOfSector)({ x: scaledX, y: scaledY }, angleAxis);
                }
                return null;
            }
            parseEventsOfWrapper() {
                const { children } = this.props;
                const tooltipEventType = this.getTooltipEventType();
                const tooltipItem = (0, ReactUtils_1.findChildByType)(children, Tooltip_1.Tooltip);
                let tooltipEvents = {};
                if (tooltipItem && tooltipEventType === 'axis') {
                    if (tooltipItem.props.trigger === 'click') {
                        tooltipEvents = {
                            onClick: this.handleClick,
                        };
                    }
                    else {
                        tooltipEvents = {
                            onMouseEnter: this.handleMouseEnter,
                            onMouseMove: this.handleMouseMove,
                            onMouseLeave: this.handleMouseLeave,
                            onTouchMove: this.handleTouchMove,
                            onTouchStart: this.handleTouchStart,
                            onTouchEnd: this.handleTouchEnd,
                        };
                    }
                }
                const outerEvents = (0, types_1.adaptEventHandlers)(this.props, this.handleOuterEvent);
                return Object.assign(Object.assign({}, outerEvents), tooltipEvents);
            }
            addListener() {
                Events_1.eventCenter.on(Events_1.SYNC_EVENT, this.handleReceiveSyncEvent);
            }
            removeListener() {
                Events_1.eventCenter.removeListener(Events_1.SYNC_EVENT, this.handleReceiveSyncEvent);
            }
            filterFormatItem(item, displayName, childIndex) {
                const { formattedGraphicalItems } = this.state;
                for (let i = 0, len = formattedGraphicalItems.length; i < len; i++) {
                    const entry = formattedGraphicalItems[i];
                    if (entry.item === item ||
                        entry.props.key === item.key ||
                        (displayName === (0, ReactUtils_1.getDisplayName)(entry.item.type) && childIndex === entry.childIndex)) {
                        return entry;
                    }
                }
                return null;
            }
            getItemByXY(chartXY) {
                const { formattedGraphicalItems, activeItem } = this.state;
                if (formattedGraphicalItems && formattedGraphicalItems.length) {
                    for (let i = 0, len = formattedGraphicalItems.length; i < len; i++) {
                        const graphicalItem = formattedGraphicalItems[i];
                        const { props, item } = graphicalItem;
                        const itemDisplayName = (0, ReactUtils_1.getDisplayName)(item.type);
                        if (itemDisplayName === 'Bar') {
                            const activeBarItem = (props.data || []).find((entry) => {
                                return (0, Rectangle_1.isInRectangle)(chartXY, entry);
                            });
                            if (activeBarItem) {
                                return { graphicalItem, payload: activeBarItem };
                            }
                        }
                        else if (itemDisplayName === 'RadialBar') {
                            const activeBarItem = (props.data || []).find((entry) => {
                                return (0, PolarUtils_1.inRangeOfSector)(chartXY, entry);
                            });
                            if (activeBarItem) {
                                return { graphicalItem, payload: activeBarItem };
                            }
                        }
                        else if ((0, ActiveShapeUtils_1.isFunnel)(graphicalItem, activeItem) ||
                            (0, ActiveShapeUtils_1.isPie)(graphicalItem, activeItem) ||
                            (0, ActiveShapeUtils_1.isScatter)(graphicalItem, activeItem)) {
                            const activeIndex = (0, ActiveShapeUtils_1.getActiveShapeIndexForTooltip)({
                                graphicalItem,
                                activeTooltipItem: activeItem,
                                itemData: item.props.data,
                            });
                            const childIndex = item.props.activeIndex === undefined ? activeIndex : item.props.activeIndex;
                            return {
                                graphicalItem: Object.assign(Object.assign({}, graphicalItem), { childIndex }),
                                payload: (0, ActiveShapeUtils_1.isScatter)(graphicalItem, activeItem)
                                    ? item.props.data[activeIndex]
                                    : graphicalItem.props.data[activeIndex],
                            };
                        }
                    }
                }
                return null;
            }
            render() {
                var _b, _c;
                if (!(0, ReactUtils_1.validateWidthHeight)(this)) {
                    return null;
                }
                const _d = this.props, { children, className, width, height, style, compact, title, desc } = _d, others = __rest(_d, ["children", "className", "width", "height", "style", "compact", "title", "desc"]);
                const attrs = (0, ReactUtils_1.filterProps)(others, false);
                if (compact) {
                    return (react_1.default.createElement(chartLayoutContext_1.ChartLayoutContextProvider, { state: this.state, width: this.props.width, height: this.props.height, clipPathId: this.clipPathId, margin: this.props.margin },
                        react_1.default.createElement(Surface_1.Surface, Object.assign({}, attrs, { width: width, height: height, title: title, desc: desc }),
                            react_1.default.createElement(ClipPath_1.ClipPath, { clipPathId: this.clipPathId, offset: this.state.offset }),
                            (0, ReactUtils_1.renderByOrder)(children, this.renderMap))));
                }
                if (this.props.accessibilityLayer) {
                    attrs.tabIndex = (_b = this.props.tabIndex) !== null && _b !== void 0 ? _b : 0;
                    attrs.role = (_c = this.props.role) !== null && _c !== void 0 ? _c : 'application';
                    attrs.onKeyDown = (e) => {
                        this.accessibilityManager.keyboardEvent(e);
                    };
                    attrs.onFocus = () => {
                        this.accessibilityManager.focus();
                    };
                }
                const events = this.parseEventsOfWrapper();
                return (react_1.default.createElement(chartDataContext_1.ChartDataContextProvider, { value: this.props.data },
                    react_1.default.createElement(legendBoundingBoxContext_1.LegendBoundingBoxContext.Provider, { value: this.handleLegendBBoxUpdate },
                        react_1.default.createElement(brushUpdateContext_1.BrushUpdateDispatchContext.Provider, { value: this.handleBrushChange },
                            react_1.default.createElement(accessibilityContext_1.AccessibilityContextProvider, { value: this.props.accessibilityLayer },
                                react_1.default.createElement(chartLayoutContext_1.ChartLayoutContextProvider, { state: this.state, width: this.props.width, height: this.props.height, clipPathId: this.clipPathId, margin: this.props.margin },
                                    react_1.default.createElement("div", Object.assign({ className: (0, clsx_1.default)('recharts-wrapper', className), style: Object.assign({ position: 'relative', cursor: 'default', width, height }, style) }, events, { ref: (node) => {
                                            this.container = node;
                                        } }),
                                        react_1.default.createElement(Surface_1.Surface, Object.assign({}, attrs, { width: width, height: height, title: title, desc: desc, style: FULL_WIDTH_AND_HEIGHT }),
                                            react_1.default.createElement(ClipPath_1.ClipPath, { clipPathId: this.clipPathId, offset: this.state.offset }),
                                            (0, ReactUtils_1.renderByOrder)(children, this.renderMap)),
                                        this.renderTooltip())))))));
            }
        },
        _a.displayName = chartName,
        _a.defaultProps = Object.assign({ layout: 'horizontal', stackOffset: 'none', barCategoryGap: '10%', barGap: 4, margin: { top: 5, right: 5, bottom: 5, left: 5 }, reverseStackOrder: false, syncMethod: 'index' }, defaultProps),
        _a.getDerivedStateFromProps = (nextProps, prevState) => {
            var _b, _c, _d, _e;
            const { dataKey, data, children, width, height, layout, stackOffset, margin } = nextProps;
            const { dataStartIndex, dataEndIndex } = prevState;
            if (prevState.updateId === undefined) {
                const defaultState = (0, exports.createDefaultState)(nextProps);
                return Object.assign(Object.assign(Object.assign(Object.assign({}, defaultState), { updateId: 0 }), updateStateOfAxisMapsOffsetAndStackGroups(Object.assign(Object.assign({ props: nextProps }, defaultState), { updateId: 0 }), prevState)), { prevDataKey: dataKey, prevData: data, prevWidth: width, prevHeight: height, prevLayout: layout, prevStackOffset: stackOffset, prevMargin: margin, prevChildren: children });
            }
            if (dataKey !== prevState.prevDataKey ||
                data !== prevState.prevData ||
                width !== prevState.prevWidth ||
                height !== prevState.prevHeight ||
                layout !== prevState.prevLayout ||
                stackOffset !== prevState.prevStackOffset ||
                !(0, ShallowEqual_1.shallowEqual)(margin, prevState.prevMargin)) {
                const defaultState = (0, exports.createDefaultState)(nextProps);
                const keepFromPrevState = {
                    chartX: prevState.chartX,
                    chartY: prevState.chartY,
                    isTooltipActive: prevState.isTooltipActive,
                };
                const updatesToState = Object.assign(Object.assign({}, getTooltipData(prevState, data, layout)), { updateId: prevState.updateId + 1 });
                const newState = Object.assign(Object.assign(Object.assign({}, defaultState), keepFromPrevState), updatesToState);
                return Object.assign(Object.assign(Object.assign({}, newState), updateStateOfAxisMapsOffsetAndStackGroups(Object.assign({ props: nextProps }, newState), prevState)), { prevDataKey: dataKey, prevData: data, prevWidth: width, prevHeight: height, prevLayout: layout, prevStackOffset: stackOffset, prevMargin: margin, prevChildren: children });
            }
            if (!(0, ReactUtils_1.isChildrenEqual)(children, prevState.prevChildren)) {
                const brush = (0, ReactUtils_1.findChildByType)(children, Brush_1.Brush);
                const startIndex = brush ? (_c = (_b = brush.props) === null || _b === void 0 ? void 0 : _b.startIndex) !== null && _c !== void 0 ? _c : dataStartIndex : dataStartIndex;
                const endIndex = brush ? (_e = (_d = brush.props) === null || _d === void 0 ? void 0 : _d.endIndex) !== null && _e !== void 0 ? _e : dataEndIndex : dataEndIndex;
                const hasDifferentStartOrEndIndex = startIndex !== dataStartIndex || endIndex !== dataEndIndex;
                const hasGlobalData = !(0, isNil_1.default)(data);
                const newUpdateId = hasGlobalData && !hasDifferentStartOrEndIndex ? prevState.updateId : prevState.updateId + 1;
                return Object.assign(Object.assign({ updateId: newUpdateId }, updateStateOfAxisMapsOffsetAndStackGroups(Object.assign(Object.assign({ props: nextProps }, prevState), { updateId: newUpdateId, dataStartIndex: startIndex, dataEndIndex: endIndex }), prevState)), { prevChildren: children, dataStartIndex: startIndex, dataEndIndex: endIndex });
            }
            return null;
        },
        _a.renderActiveDot = (option, props) => {
            let dot;
            if ((0, react_1.isValidElement)(option)) {
                dot = (0, react_1.cloneElement)(option, props);
            }
            else if ((0, isFunction_1.default)(option)) {
                dot = option(props);
            }
            else {
                dot = react_1.default.createElement(Dot_1.Dot, Object.assign({}, props));
            }
            return (react_1.default.createElement(Layer_1.Layer, { className: "recharts-active-dot", key: props.key }, dot));
        },
        _a;
};
exports.generateCategoricalChart = generateCategoricalChart;
//# sourceMappingURL=generateCategoricalChart.js.map