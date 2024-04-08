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
exports.isAxisLTR = exports.getTooltipItem = exports.parseDomainOfCategoryAxis = exports.getBandSizeOfAxis = exports.parseSpecifiedDomain = exports.MAX_VALUE_REG = exports.MIN_VALUE_REG = exports.getDomainOfStackGroups = exports.getStackedDataOfItem = exports.getBaseValueOfBar = exports.getCateCoordinateOfBar = exports.getCateCoordinateOfLine = exports.getTicksOfScale = exports.getStackGroupsByAxisId = exports.getStackedData = exports.offsetPositive = exports.offsetSign = exports.truncateByDomain = exports.findPositionOfBar = exports.checkDomainOfScale = exports.parseScale = exports.combineEventHandlers = exports.getTicksOfAxis = exports.getCoordinatesOfGrid = exports.isCategoricalAxis = exports.getDomainOfItemsWithSameAxis = exports.parseErrorBarsOfAxis = exports.getDomainOfErrorBars = exports.appendOffsetOfLegend = exports.getBarPosition = exports.getBarSizeList = exports.getMainColorOfGraphicItem = exports.calculateActiveTickIndex = exports.getDomainOfDataByKey = exports.getValueByDataKey = exports.getLegendProps = void 0;
const d3Scales = __importStar(require("victory-vendor/d3-scale"));
const d3_shape_1 = require("victory-vendor/d3-shape");
const max_1 = __importDefault(require("lodash/max"));
const min_1 = __importDefault(require("lodash/min"));
const isNil_1 = __importDefault(require("lodash/isNil"));
const isFunction_1 = __importDefault(require("lodash/isFunction"));
const isString_1 = __importDefault(require("lodash/isString"));
const get_1 = __importDefault(require("lodash/get"));
const flatMap_1 = __importDefault(require("lodash/flatMap"));
const isNaN_1 = __importDefault(require("lodash/isNaN"));
const upperFirst_1 = __importDefault(require("lodash/upperFirst"));
const isEqual_1 = __importDefault(require("lodash/isEqual"));
const sortBy_1 = __importDefault(require("lodash/sortBy"));
const recharts_scale_1 = require("recharts-scale");
const ErrorBar_1 = require("../cartesian/ErrorBar");
const DataUtils_1 = require("./DataUtils");
const ReactUtils_1 = require("./ReactUtils");
const getLegendProps_1 = require("./getLegendProps");
Object.defineProperty(exports, "getLegendProps", { enumerable: true, get: function () { return getLegendProps_1.getLegendProps; } });
const Legend_1 = require("../component/Legend");
function getValueByDataKey(obj, dataKey, defaultValue) {
    if ((0, isNil_1.default)(obj) || (0, isNil_1.default)(dataKey)) {
        return defaultValue;
    }
    if ((0, DataUtils_1.isNumOrStr)(dataKey)) {
        return (0, get_1.default)(obj, dataKey, defaultValue);
    }
    if ((0, isFunction_1.default)(dataKey)) {
        return dataKey(obj);
    }
    return defaultValue;
}
exports.getValueByDataKey = getValueByDataKey;
function getDomainOfDataByKey(data, key, type, filterNil) {
    const flattenData = (0, flatMap_1.default)(data, (entry) => getValueByDataKey(entry, key));
    if (type === 'number') {
        const domain = flattenData.filter(entry => (0, DataUtils_1.isNumber)(entry) || parseFloat(entry));
        return domain.length ? [(0, min_1.default)(domain), (0, max_1.default)(domain)] : [Infinity, -Infinity];
    }
    const validateData = filterNil ? flattenData.filter(entry => !(0, isNil_1.default)(entry)) : flattenData;
    return validateData.map(entry => ((0, DataUtils_1.isNumOrStr)(entry) || entry instanceof Date ? entry : ''));
}
exports.getDomainOfDataByKey = getDomainOfDataByKey;
const calculateActiveTickIndex = (coordinate, ticks = [], unsortedTicks, axis) => {
    var _a;
    let index = -1;
    const len = (_a = ticks === null || ticks === void 0 ? void 0 : ticks.length) !== null && _a !== void 0 ? _a : 0;
    if (len <= 1) {
        return 0;
    }
    if (axis && axis.axisType === 'angleAxis' && Math.abs(Math.abs(axis.range[1] - axis.range[0]) - 360) <= 1e-6) {
        const { range } = axis;
        for (let i = 0; i < len; i++) {
            const before = i > 0 ? unsortedTicks[i - 1].coordinate : unsortedTicks[len - 1].coordinate;
            const cur = unsortedTicks[i].coordinate;
            const after = i >= len - 1 ? unsortedTicks[0].coordinate : unsortedTicks[i + 1].coordinate;
            let sameDirectionCoord;
            if ((0, DataUtils_1.mathSign)(cur - before) !== (0, DataUtils_1.mathSign)(after - cur)) {
                const diffInterval = [];
                if ((0, DataUtils_1.mathSign)(after - cur) === (0, DataUtils_1.mathSign)(range[1] - range[0])) {
                    sameDirectionCoord = after;
                    const curInRange = cur + range[1] - range[0];
                    diffInterval[0] = Math.min(curInRange, (curInRange + before) / 2);
                    diffInterval[1] = Math.max(curInRange, (curInRange + before) / 2);
                }
                else {
                    sameDirectionCoord = before;
                    const afterInRange = after + range[1] - range[0];
                    diffInterval[0] = Math.min(cur, (afterInRange + cur) / 2);
                    diffInterval[1] = Math.max(cur, (afterInRange + cur) / 2);
                }
                const sameInterval = [
                    Math.min(cur, (sameDirectionCoord + cur) / 2),
                    Math.max(cur, (sameDirectionCoord + cur) / 2),
                ];
                if ((coordinate > sameInterval[0] && coordinate <= sameInterval[1]) ||
                    (coordinate >= diffInterval[0] && coordinate <= diffInterval[1])) {
                    ({ index } = unsortedTicks[i]);
                    break;
                }
            }
            else {
                const minValue = Math.min(before, after);
                const maxValue = Math.max(before, after);
                if (coordinate > (minValue + cur) / 2 && coordinate <= (maxValue + cur) / 2) {
                    ({ index } = unsortedTicks[i]);
                    break;
                }
            }
        }
    }
    else {
        for (let i = 0; i < len; i++) {
            if ((i === 0 && coordinate <= (ticks[i].coordinate + ticks[i + 1].coordinate) / 2) ||
                (i > 0 &&
                    i < len - 1 &&
                    coordinate > (ticks[i].coordinate + ticks[i - 1].coordinate) / 2 &&
                    coordinate <= (ticks[i].coordinate + ticks[i + 1].coordinate) / 2) ||
                (i === len - 1 && coordinate > (ticks[i].coordinate + ticks[i - 1].coordinate) / 2)) {
                ({ index } = ticks[i]);
                break;
            }
        }
    }
    return index;
};
exports.calculateActiveTickIndex = calculateActiveTickIndex;
const getMainColorOfGraphicItem = (item) => {
    const { type: { displayName }, } = item;
    const { stroke, fill } = item.props;
    let result;
    switch (displayName) {
        case 'Line':
            result = stroke;
            break;
        case 'Area':
        case 'Radar':
            result = stroke && stroke !== 'none' ? stroke : fill;
            break;
        default:
            result = fill;
            break;
    }
    return result;
};
exports.getMainColorOfGraphicItem = getMainColorOfGraphicItem;
const getBarSizeList = ({ barSize: globalSize, stackGroups = {}, }) => {
    if (!stackGroups) {
        return {};
    }
    const result = {};
    const numericAxisIds = Object.keys(stackGroups);
    for (let i = 0, len = numericAxisIds.length; i < len; i++) {
        const sgs = stackGroups[numericAxisIds[i]].stackGroups;
        const stackIds = Object.keys(sgs);
        for (let j = 0, sLen = stackIds.length; j < sLen; j++) {
            const { items, cateAxisId } = sgs[stackIds[j]];
            const barItems = items.filter(item => (0, ReactUtils_1.getDisplayName)(item.type).indexOf('Bar') >= 0);
            if (barItems && barItems.length) {
                const { barSize: selfSize } = barItems[0].props;
                const cateId = barItems[0].props[cateAxisId];
                if (!result[cateId]) {
                    result[cateId] = [];
                }
                result[cateId].push({
                    item: barItems[0],
                    stackList: barItems.slice(1),
                    barSize: (0, isNil_1.default)(selfSize) ? globalSize : selfSize,
                });
            }
        }
    }
    return result;
};
exports.getBarSizeList = getBarSizeList;
const getBarPosition = ({ barGap, barCategoryGap, bandSize, sizeList = [], maxBarSize, }) => {
    const len = sizeList.length;
    if (len < 1)
        return null;
    let realBarGap = (0, DataUtils_1.getPercentValue)(barGap, bandSize, 0, true);
    let result;
    const initialValue = [];
    if (sizeList[0].barSize === +sizeList[0].barSize) {
        let useFull = false;
        let fullBarSize = bandSize / len;
        let sum = sizeList.reduce((res, entry) => res + entry.barSize || 0, 0);
        sum += (len - 1) * realBarGap;
        if (sum >= bandSize) {
            sum -= (len - 1) * realBarGap;
            realBarGap = 0;
        }
        if (sum >= bandSize && fullBarSize > 0) {
            useFull = true;
            fullBarSize *= 0.9;
            sum = len * fullBarSize;
        }
        const offset = ((bandSize - sum) / 2) >> 0;
        let prev = { offset: offset - realBarGap, size: 0 };
        result = sizeList.reduce((res, entry) => {
            const newPosition = {
                item: entry.item,
                position: {
                    offset: prev.offset + prev.size + realBarGap,
                    size: useFull ? fullBarSize : entry.barSize,
                },
            };
            const newRes = [...res, newPosition];
            prev = newRes[newRes.length - 1].position;
            if (entry.stackList && entry.stackList.length) {
                entry.stackList.forEach(item => {
                    newRes.push({ item, position: prev });
                });
            }
            return newRes;
        }, initialValue);
    }
    else {
        const offset = (0, DataUtils_1.getPercentValue)(barCategoryGap, bandSize, 0, true);
        if (bandSize - 2 * offset - (len - 1) * realBarGap <= 0) {
            realBarGap = 0;
        }
        let originalSize = (bandSize - 2 * offset - (len - 1) * realBarGap) / len;
        if (originalSize > 1) {
            originalSize >>= 0;
        }
        const size = maxBarSize === +maxBarSize ? Math.min(originalSize, maxBarSize) : originalSize;
        result = sizeList.reduce((res, entry, i) => {
            const newRes = [
                ...res,
                {
                    item: entry.item,
                    position: {
                        offset: offset + (originalSize + realBarGap) * i + (originalSize - size) / 2,
                        size,
                    },
                },
            ];
            if (entry.stackList && entry.stackList.length) {
                entry.stackList.forEach(item => {
                    newRes.push({ item, position: newRes[newRes.length - 1].position });
                });
            }
            return newRes;
        }, initialValue);
    }
    return result;
};
exports.getBarPosition = getBarPosition;
const appendOffsetOfLegend = (offset, props, legendBox) => {
    const { children, width, margin } = props;
    const legendItem = (0, ReactUtils_1.findChildByType)(children, Legend_1.Legend);
    if (legendItem) {
        const legendWidth = width - (margin.left || 0) - (margin.right || 0);
        const legendProps = (0, getLegendProps_1.getLegendProps)({ legendItem, legendWidth });
        const { width: boxWidth, height: boxHeight } = legendBox || {};
        const { align, verticalAlign, layout } = legendProps;
        if ((layout === 'vertical' || (layout === 'horizontal' && verticalAlign === 'middle')) &&
            align !== 'center' &&
            (0, DataUtils_1.isNumber)(offset[align])) {
            return Object.assign(Object.assign({}, offset), { [align]: offset[align] + (boxWidth || 0) });
        }
        if ((layout === 'horizontal' || (layout === 'vertical' && align === 'center')) &&
            verticalAlign !== 'middle' &&
            (0, DataUtils_1.isNumber)(offset[verticalAlign])) {
            return Object.assign(Object.assign({}, offset), { [verticalAlign]: offset[verticalAlign] + (boxHeight || 0) });
        }
    }
    return offset;
};
exports.appendOffsetOfLegend = appendOffsetOfLegend;
const isErrorBarRelevantForAxis = (layout, axisType, direction) => {
    if ((0, isNil_1.default)(axisType)) {
        return true;
    }
    if (layout === 'horizontal') {
        return axisType === 'yAxis';
    }
    if (layout === 'vertical') {
        return axisType === 'xAxis';
    }
    if (direction === 'x') {
        return axisType === 'xAxis';
    }
    if (direction === 'y') {
        return axisType === 'yAxis';
    }
    return true;
};
const getDomainOfErrorBars = (data, item, dataKey, layout, axisType) => {
    const { children } = item.props;
    const errorBars = (0, ReactUtils_1.findAllByType)(children, ErrorBar_1.ErrorBar).filter(errorBarChild => isErrorBarRelevantForAxis(layout, axisType, errorBarChild.props.direction));
    if (errorBars && errorBars.length) {
        const keys = errorBars.map(errorBarChild => errorBarChild.props.dataKey);
        return data.reduce((result, entry) => {
            const entryValue = getValueByDataKey(entry, dataKey);
            if ((0, isNil_1.default)(entryValue))
                return result;
            const mainValue = Array.isArray(entryValue) ? [(0, min_1.default)(entryValue), (0, max_1.default)(entryValue)] : [entryValue, entryValue];
            const errorDomain = keys.reduce((prevErrorArr, k) => {
                const errorValue = getValueByDataKey(entry, k, 0);
                const lowerValue = mainValue[0] - Math.abs(Array.isArray(errorValue) ? errorValue[0] : errorValue);
                const upperValue = mainValue[1] + Math.abs(Array.isArray(errorValue) ? errorValue[1] : errorValue);
                return [Math.min(lowerValue, prevErrorArr[0]), Math.max(upperValue, prevErrorArr[1])];
            }, [Infinity, -Infinity]);
            return [Math.min(errorDomain[0], result[0]), Math.max(errorDomain[1], result[1])];
        }, [Infinity, -Infinity]);
    }
    return null;
};
exports.getDomainOfErrorBars = getDomainOfErrorBars;
const parseErrorBarsOfAxis = (data, items, dataKey, axisType, layout) => {
    const domains = items
        .map(item => (0, exports.getDomainOfErrorBars)(data, item, dataKey, layout, axisType))
        .filter(entry => !(0, isNil_1.default)(entry));
    if (domains && domains.length) {
        return domains.reduce((result, entry) => [Math.min(result[0], entry[0]), Math.max(result[1], entry[1])], [Infinity, -Infinity]);
    }
    return null;
};
exports.parseErrorBarsOfAxis = parseErrorBarsOfAxis;
const getDomainOfItemsWithSameAxis = (data, items, type, layout, filterNil) => {
    const domains = items.map(item => {
        const { dataKey } = item.props;
        if (type === 'number' && dataKey) {
            return (0, exports.getDomainOfErrorBars)(data, item, dataKey, layout) || getDomainOfDataByKey(data, dataKey, type, filterNil);
        }
        return getDomainOfDataByKey(data, dataKey, type, filterNil);
    });
    if (type === 'number') {
        return domains.reduce((result, entry) => [Math.min(result[0], entry[0]), Math.max(result[1], entry[1])], [Infinity, -Infinity]);
    }
    const tag = {};
    return domains.reduce((result, entry) => {
        for (let i = 0, len = entry.length; i < len; i++) {
            if (!tag[entry[i]]) {
                tag[entry[i]] = true;
                result.push(entry[i]);
            }
        }
        return result;
    }, []);
};
exports.getDomainOfItemsWithSameAxis = getDomainOfItemsWithSameAxis;
const isCategoricalAxis = (layout, axisType) => (layout === 'horizontal' && axisType === 'xAxis') ||
    (layout === 'vertical' && axisType === 'yAxis') ||
    (layout === 'centric' && axisType === 'angleAxis') ||
    (layout === 'radial' && axisType === 'radiusAxis');
exports.isCategoricalAxis = isCategoricalAxis;
const getCoordinatesOfGrid = (ticks, minValue, maxValue, syncWithTicks) => {
    if (syncWithTicks) {
        return ticks.map(entry => entry.coordinate);
    }
    let hasMin, hasMax;
    const values = ticks.map(entry => {
        if (entry.coordinate === minValue) {
            hasMin = true;
        }
        if (entry.coordinate === maxValue) {
            hasMax = true;
        }
        return entry.coordinate;
    });
    if (!hasMin) {
        values.push(minValue);
    }
    if (!hasMax) {
        values.push(maxValue);
    }
    return values;
};
exports.getCoordinatesOfGrid = getCoordinatesOfGrid;
const getTicksOfAxis = (axis, isGrid, isAll) => {
    if (!axis)
        return null;
    const { scale } = axis;
    const { duplicateDomain, type, range } = axis;
    const offsetForBand = axis.realScaleType === 'scaleBand' ? scale.bandwidth() / 2 : 2;
    let offset = (isGrid || isAll) && type === 'category' && scale.bandwidth ? scale.bandwidth() / offsetForBand : 0;
    offset = axis.axisType === 'angleAxis' && (range === null || range === void 0 ? void 0 : range.length) >= 2 ? (0, DataUtils_1.mathSign)(range[0] - range[1]) * 2 * offset : offset;
    if (isGrid && (axis.ticks || axis.niceTicks)) {
        const result = (axis.ticks || axis.niceTicks).map((entry) => {
            const scaleContent = duplicateDomain ? duplicateDomain.indexOf(entry) : entry;
            return {
                coordinate: scale(scaleContent) + offset,
                value: entry,
                offset,
            };
        });
        return result.filter((row) => !(0, isNaN_1.default)(row.coordinate));
    }
    if (axis.isCategorical && axis.categoricalDomain) {
        return axis.categoricalDomain.map((entry, index) => ({
            coordinate: scale(entry) + offset,
            value: entry,
            index,
            offset,
        }));
    }
    if (scale.ticks && !isAll) {
        return scale
            .ticks(axis.tickCount)
            .map((entry) => ({ coordinate: scale(entry) + offset, value: entry, offset }));
    }
    return scale.domain().map((entry, index) => ({
        coordinate: scale(entry) + offset,
        value: duplicateDomain ? duplicateDomain[entry] : entry,
        index,
        offset,
    }));
};
exports.getTicksOfAxis = getTicksOfAxis;
const handlerWeakMap = new WeakMap();
const combineEventHandlers = (defaultHandler, childHandler) => {
    if (typeof childHandler !== 'function') {
        return defaultHandler;
    }
    if (!handlerWeakMap.has(defaultHandler)) {
        handlerWeakMap.set(defaultHandler, new WeakMap());
    }
    const childWeakMap = handlerWeakMap.get(defaultHandler);
    if (childWeakMap.has(childHandler)) {
        return childWeakMap.get(childHandler);
    }
    const combineHandler = (...args) => {
        defaultHandler(...args);
        childHandler(...args);
    };
    childWeakMap.set(childHandler, combineHandler);
    return combineHandler;
};
exports.combineEventHandlers = combineEventHandlers;
const parseScale = (axis, chartType, hasBar) => {
    const { scale, type, layout, axisType } = axis;
    if (scale === 'auto') {
        if (layout === 'radial' && axisType === 'radiusAxis') {
            return { scale: d3Scales.scaleBand(), realScaleType: 'band' };
        }
        if (layout === 'radial' && axisType === 'angleAxis') {
            return { scale: d3Scales.scaleLinear(), realScaleType: 'linear' };
        }
        if (type === 'category' &&
            chartType &&
            (chartType.indexOf('LineChart') >= 0 ||
                chartType.indexOf('AreaChart') >= 0 ||
                (chartType.indexOf('ComposedChart') >= 0 && !hasBar))) {
            return { scale: d3Scales.scalePoint(), realScaleType: 'point' };
        }
        if (type === 'category') {
            return { scale: d3Scales.scaleBand(), realScaleType: 'band' };
        }
        return { scale: d3Scales.scaleLinear(), realScaleType: 'linear' };
    }
    if ((0, isString_1.default)(scale)) {
        const name = `scale${(0, upperFirst_1.default)(scale)}`;
        return {
            scale: (d3Scales[name] || d3Scales.scalePoint)(),
            realScaleType: d3Scales[name] ? name : 'point',
        };
    }
    return (0, isFunction_1.default)(scale) ? { scale } : { scale: d3Scales.scalePoint(), realScaleType: 'point' };
};
exports.parseScale = parseScale;
const EPS = 1e-4;
const checkDomainOfScale = (scale) => {
    const domain = scale.domain();
    if (!domain || domain.length <= 2) {
        return;
    }
    const len = domain.length;
    const range = scale.range();
    const minValue = Math.min(range[0], range[1]) - EPS;
    const maxValue = Math.max(range[0], range[1]) + EPS;
    const first = scale(domain[0]);
    const last = scale(domain[len - 1]);
    if (first < minValue || first > maxValue || last < minValue || last > maxValue) {
        scale.domain([domain[0], domain[len - 1]]);
    }
};
exports.checkDomainOfScale = checkDomainOfScale;
const findPositionOfBar = (barPosition, child) => {
    if (!barPosition) {
        return null;
    }
    for (let i = 0, len = barPosition.length; i < len; i++) {
        if (barPosition[i].item === child) {
            return barPosition[i].position;
        }
    }
    return null;
};
exports.findPositionOfBar = findPositionOfBar;
const truncateByDomain = (value, domain) => {
    if (!domain || domain.length !== 2 || !(0, DataUtils_1.isNumber)(domain[0]) || !(0, DataUtils_1.isNumber)(domain[1])) {
        return value;
    }
    const minValue = Math.min(domain[0], domain[1]);
    const maxValue = Math.max(domain[0], domain[1]);
    const result = [value[0], value[1]];
    if (!(0, DataUtils_1.isNumber)(value[0]) || value[0] < minValue) {
        result[0] = minValue;
    }
    if (!(0, DataUtils_1.isNumber)(value[1]) || value[1] > maxValue) {
        result[1] = maxValue;
    }
    if (result[0] > maxValue) {
        result[0] = maxValue;
    }
    if (result[1] < minValue) {
        result[1] = minValue;
    }
    return result;
};
exports.truncateByDomain = truncateByDomain;
const offsetSign = series => {
    const n = series.length;
    if (n <= 0) {
        return;
    }
    for (let j = 0, m = series[0].length; j < m; ++j) {
        let positive = 0;
        let negative = 0;
        for (let i = 0; i < n; ++i) {
            const value = (0, isNaN_1.default)(series[i][j][1]) ? series[i][j][0] : series[i][j][1];
            if (value >= 0) {
                series[i][j][0] = positive;
                series[i][j][1] = positive + value;
                positive = series[i][j][1];
            }
            else {
                series[i][j][0] = negative;
                series[i][j][1] = negative + value;
                negative = series[i][j][1];
            }
        }
    }
};
exports.offsetSign = offsetSign;
const offsetPositive = series => {
    const n = series.length;
    if (n <= 0) {
        return;
    }
    for (let j = 0, m = series[0].length; j < m; ++j) {
        let positive = 0;
        for (let i = 0; i < n; ++i) {
            const value = (0, isNaN_1.default)(series[i][j][1]) ? series[i][j][0] : series[i][j][1];
            if (value >= 0) {
                series[i][j][0] = positive;
                series[i][j][1] = positive + value;
                positive = series[i][j][1];
            }
            else {
                series[i][j][0] = 0;
                series[i][j][1] = 0;
            }
        }
    }
};
exports.offsetPositive = offsetPositive;
const STACK_OFFSET_MAP = {
    sign: exports.offsetSign,
    expand: d3_shape_1.stackOffsetExpand,
    none: d3_shape_1.stackOffsetNone,
    silhouette: d3_shape_1.stackOffsetSilhouette,
    wiggle: d3_shape_1.stackOffsetWiggle,
    positive: exports.offsetPositive,
};
const getStackedData = (data, stackItems, offsetType) => {
    const dataKeys = stackItems.map(item => item.props.dataKey);
    const offsetAccessor = STACK_OFFSET_MAP[offsetType];
    const stack = (0, d3_shape_1.stack)()
        .keys(dataKeys)
        .value((d, key) => +getValueByDataKey(d, key, 0))
        .order(d3_shape_1.stackOrderNone)
        .offset(offsetAccessor);
    return stack(data);
};
exports.getStackedData = getStackedData;
const getStackGroupsByAxisId = (data, _items, numericAxisId, cateAxisId, offsetType, reverseStackOrder) => {
    if (!data) {
        return null;
    }
    const items = reverseStackOrder ? _items.reverse() : _items;
    const parentStackGroupsInitialValue = {};
    const stackGroups = items.reduce((result, item) => {
        const { stackId, hide } = item.props;
        if (hide) {
            return result;
        }
        const axisId = item.props[numericAxisId];
        const parentGroup = result[axisId] || { hasStack: false, stackGroups: {} };
        if ((0, DataUtils_1.isNumOrStr)(stackId)) {
            const childGroup = parentGroup.stackGroups[stackId] || {
                numericAxisId,
                cateAxisId,
                items: [],
            };
            childGroup.items.push(item);
            parentGroup.hasStack = true;
            parentGroup.stackGroups[stackId] = childGroup;
        }
        else {
            parentGroup.stackGroups[(0, DataUtils_1.uniqueId)('_stackId_')] = {
                numericAxisId,
                cateAxisId,
                items: [item],
            };
        }
        return Object.assign(Object.assign({}, result), { [axisId]: parentGroup });
    }, parentStackGroupsInitialValue);
    const axisStackGroupsInitialValue = {};
    return Object.keys(stackGroups).reduce((result, axisId) => {
        const group = stackGroups[axisId];
        if (group.hasStack) {
            const stackGroupsInitialValue = {};
            group.stackGroups = Object.keys(group.stackGroups).reduce((res, stackId) => {
                const g = group.stackGroups[stackId];
                return Object.assign(Object.assign({}, res), { [stackId]: {
                        numericAxisId,
                        cateAxisId,
                        items: g.items,
                        stackedData: (0, exports.getStackedData)(data, g.items, offsetType),
                    } });
            }, stackGroupsInitialValue);
        }
        return Object.assign(Object.assign({}, result), { [axisId]: group });
    }, axisStackGroupsInitialValue);
};
exports.getStackGroupsByAxisId = getStackGroupsByAxisId;
const getTicksOfScale = (scale, opts) => {
    const { realScaleType, type, tickCount, originalDomain, allowDecimals } = opts;
    const scaleType = realScaleType || opts.scale;
    if (scaleType !== 'auto' && scaleType !== 'linear') {
        return null;
    }
    if (tickCount &&
        type === 'number' &&
        originalDomain &&
        (originalDomain[0] === 'auto' || originalDomain[1] === 'auto')) {
        const domain = scale.domain();
        if (!domain.length) {
            return null;
        }
        const tickValues = (0, recharts_scale_1.getNiceTickValues)(domain, tickCount, allowDecimals);
        scale.domain([(0, min_1.default)(tickValues), (0, max_1.default)(tickValues)]);
        return { niceTicks: tickValues };
    }
    if (tickCount && type === 'number') {
        const domain = scale.domain();
        const tickValues = (0, recharts_scale_1.getTickValuesFixedDomain)(domain, tickCount, allowDecimals);
        return { niceTicks: tickValues };
    }
    return null;
};
exports.getTicksOfScale = getTicksOfScale;
function getCateCoordinateOfLine({ axis, ticks, bandSize, entry, index, dataKey, }) {
    if (axis.type === 'category') {
        if (!axis.allowDuplicatedCategory && axis.dataKey && !(0, isNil_1.default)(entry[axis.dataKey])) {
            const matchedTick = (0, DataUtils_1.findEntryInArray)(ticks, 'value', entry[axis.dataKey]);
            if (matchedTick) {
                return matchedTick.coordinate + bandSize / 2;
            }
        }
        return ticks[index] ? ticks[index].coordinate + bandSize / 2 : null;
    }
    const value = getValueByDataKey(entry, !(0, isNil_1.default)(dataKey) ? dataKey : axis.dataKey);
    return !(0, isNil_1.default)(value) ? axis.scale(value) : null;
}
exports.getCateCoordinateOfLine = getCateCoordinateOfLine;
const getCateCoordinateOfBar = ({ axis, ticks, offset, bandSize, entry, index, }) => {
    if (axis.type === 'category') {
        return ticks[index] ? ticks[index].coordinate + offset : null;
    }
    const value = getValueByDataKey(entry, axis.dataKey, axis.domain[index]);
    return !(0, isNil_1.default)(value) ? axis.scale(value) - bandSize / 2 + offset : null;
};
exports.getCateCoordinateOfBar = getCateCoordinateOfBar;
const getBaseValueOfBar = ({ numericAxis, }) => {
    const domain = numericAxis.scale.domain();
    if (numericAxis.type === 'number') {
        const minValue = Math.min(domain[0], domain[1]);
        const maxValue = Math.max(domain[0], domain[1]);
        if (minValue <= 0 && maxValue >= 0) {
            return 0;
        }
        if (maxValue < 0) {
            return maxValue;
        }
        return minValue;
    }
    return domain[0];
};
exports.getBaseValueOfBar = getBaseValueOfBar;
const getStackedDataOfItem = (item, stackGroups) => {
    const { stackId } = item.props;
    if ((0, DataUtils_1.isNumOrStr)(stackId)) {
        const group = stackGroups[stackId];
        if (group) {
            const itemIndex = group.items.indexOf(item);
            return itemIndex >= 0 ? group.stackedData[itemIndex] : null;
        }
    }
    return null;
};
exports.getStackedDataOfItem = getStackedDataOfItem;
const getDomainOfSingle = (data) => data.reduce((result, entry) => [
    (0, min_1.default)(entry.concat([result[0]]).filter(DataUtils_1.isNumber)),
    (0, max_1.default)(entry.concat([result[1]]).filter(DataUtils_1.isNumber)),
], [Infinity, -Infinity]);
const getDomainOfStackGroups = (stackGroups, startIndex, endIndex) => Object.keys(stackGroups)
    .reduce((result, stackId) => {
    const group = stackGroups[stackId];
    const { stackedData } = group;
    const domain = stackedData.reduce((res, entry) => {
        const s = getDomainOfSingle(entry.slice(startIndex, endIndex + 1));
        return [Math.min(res[0], s[0]), Math.max(res[1], s[1])];
    }, [Infinity, -Infinity]);
    return [Math.min(domain[0], result[0]), Math.max(domain[1], result[1])];
}, [Infinity, -Infinity])
    .map(result => (result === Infinity || result === -Infinity ? 0 : result));
exports.getDomainOfStackGroups = getDomainOfStackGroups;
exports.MIN_VALUE_REG = /^dataMin[\s]*-[\s]*([0-9]+([.]{1}[0-9]+){0,1})$/;
exports.MAX_VALUE_REG = /^dataMax[\s]*\+[\s]*([0-9]+([.]{1}[0-9]+){0,1})$/;
const parseSpecifiedDomain = (specifiedDomain, dataDomain, allowDataOverflow) => {
    if ((0, isFunction_1.default)(specifiedDomain)) {
        return specifiedDomain(dataDomain, allowDataOverflow);
    }
    if (!Array.isArray(specifiedDomain)) {
        return dataDomain;
    }
    const domain = [];
    if ((0, DataUtils_1.isNumber)(specifiedDomain[0])) {
        domain[0] = allowDataOverflow ? specifiedDomain[0] : Math.min(specifiedDomain[0], dataDomain[0]);
    }
    else if (exports.MIN_VALUE_REG.test(specifiedDomain[0])) {
        const value = +exports.MIN_VALUE_REG.exec(specifiedDomain[0])[1];
        domain[0] = dataDomain[0] - value;
    }
    else if ((0, isFunction_1.default)(specifiedDomain[0])) {
        domain[0] = specifiedDomain[0](dataDomain[0]);
    }
    else {
        domain[0] = dataDomain[0];
    }
    if ((0, DataUtils_1.isNumber)(specifiedDomain[1])) {
        domain[1] = allowDataOverflow ? specifiedDomain[1] : Math.max(specifiedDomain[1], dataDomain[1]);
    }
    else if (exports.MAX_VALUE_REG.test(specifiedDomain[1])) {
        const value = +exports.MAX_VALUE_REG.exec(specifiedDomain[1])[1];
        domain[1] = dataDomain[1] + value;
    }
    else if ((0, isFunction_1.default)(specifiedDomain[1])) {
        domain[1] = specifiedDomain[1](dataDomain[1]);
    }
    else {
        domain[1] = dataDomain[1];
    }
    return domain;
};
exports.parseSpecifiedDomain = parseSpecifiedDomain;
const getBandSizeOfAxis = (axis, ticks, isBar) => {
    if (axis && axis.scale && axis.scale.bandwidth) {
        const bandWidth = axis.scale.bandwidth();
        if (!isBar || bandWidth > 0) {
            return bandWidth;
        }
    }
    if (axis && ticks && ticks.length >= 2) {
        const orderedTicks = (0, sortBy_1.default)(ticks, o => o.coordinate);
        let bandSize = Infinity;
        for (let i = 1, len = orderedTicks.length; i < len; i++) {
            const cur = orderedTicks[i];
            const prev = orderedTicks[i - 1];
            bandSize = Math.min((cur.coordinate || 0) - (prev.coordinate || 0), bandSize);
        }
        return bandSize === Infinity ? 0 : bandSize;
    }
    return isBar ? undefined : 0;
};
exports.getBandSizeOfAxis = getBandSizeOfAxis;
const parseDomainOfCategoryAxis = (specifiedDomain, calculatedDomain, axisChild) => {
    if (!specifiedDomain || !specifiedDomain.length) {
        return calculatedDomain;
    }
    if ((0, isEqual_1.default)(specifiedDomain, (0, get_1.default)(axisChild, 'type.defaultProps.domain'))) {
        return calculatedDomain;
    }
    return specifiedDomain;
};
exports.parseDomainOfCategoryAxis = parseDomainOfCategoryAxis;
const getTooltipItem = (graphicalItem, payload) => {
    const { dataKey, name, unit, formatter, tooltipType, chartType, hide } = graphicalItem.props;
    return Object.assign(Object.assign({}, (0, ReactUtils_1.filterProps)(graphicalItem, false)), { dataKey,
        unit,
        formatter, name: name || dataKey, color: (0, exports.getMainColorOfGraphicItem)(graphicalItem), value: getValueByDataKey(payload, dataKey), type: tooltipType, payload,
        chartType,
        hide });
};
exports.getTooltipItem = getTooltipItem;
const isAxisLTR = (axisMap) => {
    const axes = Object.values(axisMap !== null && axisMap !== void 0 ? axisMap : {});
    if (axes.length === 0) {
        return true;
    }
    return !axes.some(({ reversed }) => reversed);
};
exports.isAxisLTR = isAxisLTR;
//# sourceMappingURL=ChartUtils.js.map