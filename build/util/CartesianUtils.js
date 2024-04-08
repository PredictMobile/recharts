"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAngledRectangleWidth = exports.normalizeAngle = exports.createLabeledScales = exports.ScaleHelper = exports.rectWithCoords = exports.rectWithPoints = exports.formatAxisMap = void 0;
const mapValues_1 = __importDefault(require("lodash/mapValues"));
const every_1 = __importDefault(require("lodash/every"));
const ChartUtils_1 = require("./ChartUtils");
const ReactUtils_1 = require("./ReactUtils");
const DataUtils_1 = require("./DataUtils");
const Bar_1 = require("../cartesian/Bar");
const formatAxisMap = (props, axisMap, offset, axisType, chartName) => {
    const { width, height, layout, children } = props;
    const ids = Object.keys(axisMap);
    const steps = {
        left: offset.left,
        leftMirror: offset.left,
        right: width - offset.right,
        rightMirror: width - offset.right,
        top: offset.top,
        topMirror: offset.top,
        bottom: height - offset.bottom,
        bottomMirror: height - offset.bottom,
    };
    const hasBar = !!(0, ReactUtils_1.findChildByType)(children, Bar_1.Bar);
    return ids.reduce((result, id) => {
        const axis = axisMap[id];
        const { orientation, domain, padding = {}, mirror, reversed } = axis;
        const offsetKey = `${orientation}${mirror ? 'Mirror' : ''}`;
        let calculatedPadding, range, x, y, needSpace;
        if (axis.type === 'number' && (axis.padding === 'gap' || axis.padding === 'no-gap')) {
            const diff = domain[1] - domain[0];
            let smallestDistanceBetweenValues = Infinity;
            const sortedValues = axis.categoricalDomain.sort();
            sortedValues.forEach((value, index) => {
                if (index > 0) {
                    smallestDistanceBetweenValues = Math.min((value || 0) - (sortedValues[index - 1] || 0), smallestDistanceBetweenValues);
                }
            });
            if (Number.isFinite(smallestDistanceBetweenValues)) {
                const smallestDistanceInPercent = smallestDistanceBetweenValues / diff;
                const rangeWidth = axis.layout === 'vertical' ? offset.height : offset.width;
                if (axis.padding === 'gap') {
                    calculatedPadding = (smallestDistanceInPercent * rangeWidth) / 2;
                }
                if (axis.padding === 'no-gap') {
                    const gap = (0, DataUtils_1.getPercentValue)(props.barCategoryGap, smallestDistanceInPercent * rangeWidth);
                    const halfBand = (smallestDistanceInPercent * rangeWidth) / 2;
                    calculatedPadding = halfBand - gap - ((halfBand - gap) / rangeWidth) * gap;
                }
            }
        }
        if (axisType === 'xAxis') {
            range = [
                offset.left + (padding.left || 0) + (calculatedPadding || 0),
                offset.left + offset.width - (padding.right || 0) - (calculatedPadding || 0),
            ];
        }
        else if (axisType === 'yAxis') {
            range =
                layout === 'horizontal'
                    ? [offset.top + offset.height - (padding.bottom || 0), offset.top + (padding.top || 0)]
                    : [
                        offset.top + (padding.top || 0) + (calculatedPadding || 0),
                        offset.top + offset.height - (padding.bottom || 0) - (calculatedPadding || 0),
                    ];
        }
        else {
            ({ range } = axis);
        }
        if (reversed) {
            range = [range[1], range[0]];
        }
        const { scale, realScaleType } = (0, ChartUtils_1.parseScale)(axis, chartName, hasBar);
        scale.domain(domain).range(range);
        (0, ChartUtils_1.checkDomainOfScale)(scale);
        const ticks = (0, ChartUtils_1.getTicksOfScale)(scale, Object.assign(Object.assign({}, axis), { realScaleType }));
        if (axisType === 'xAxis') {
            needSpace = (orientation === 'top' && !mirror) || (orientation === 'bottom' && mirror);
            x = offset.left;
            y = steps[offsetKey] - needSpace * axis.height;
        }
        else if (axisType === 'yAxis') {
            needSpace = (orientation === 'left' && !mirror) || (orientation === 'right' && mirror);
            x = steps[offsetKey] - needSpace * axis.width;
            y = offset.top;
        }
        const finalAxis = Object.assign(Object.assign(Object.assign({}, axis), ticks), { realScaleType,
            x,
            y,
            scale, width: axisType === 'xAxis' ? offset.width : axis.width, height: axisType === 'yAxis' ? offset.height : axis.height });
        finalAxis.bandSize = (0, ChartUtils_1.getBandSizeOfAxis)(finalAxis, ticks);
        if (!axis.hide && axisType === 'xAxis') {
            steps[offsetKey] += (needSpace ? -1 : 1) * finalAxis.height;
        }
        else if (!axis.hide) {
            steps[offsetKey] += (needSpace ? -1 : 1) * finalAxis.width;
        }
        return Object.assign(Object.assign({}, result), { [id]: finalAxis });
    }, {});
};
exports.formatAxisMap = formatAxisMap;
const rectWithPoints = ({ x: x1, y: y1 }, { x: x2, y: y2 }) => ({
    x: Math.min(x1, x2),
    y: Math.min(y1, y2),
    width: Math.abs(x2 - x1),
    height: Math.abs(y2 - y1),
});
exports.rectWithPoints = rectWithPoints;
const rectWithCoords = ({ x1, y1, x2, y2 }) => (0, exports.rectWithPoints)({ x: x1, y: y1 }, { x: x2, y: y2 });
exports.rectWithCoords = rectWithCoords;
class ScaleHelper {
    static create(obj) {
        return new ScaleHelper(obj);
    }
    constructor(scale) {
        this.scale = scale;
    }
    get domain() {
        return this.scale.domain;
    }
    get range() {
        return this.scale.range;
    }
    get rangeMin() {
        return this.range()[0];
    }
    get rangeMax() {
        return this.range()[1];
    }
    get bandwidth() {
        return this.scale.bandwidth;
    }
    apply(value, { bandAware, position } = {}) {
        if (value === undefined) {
            return undefined;
        }
        if (position) {
            switch (position) {
                case 'start': {
                    return this.scale(value);
                }
                case 'middle': {
                    const offset = this.bandwidth ? this.bandwidth() / 2 : 0;
                    return this.scale(value) + offset;
                }
                case 'end': {
                    const offset = this.bandwidth ? this.bandwidth() : 0;
                    return this.scale(value) + offset;
                }
                default: {
                    return this.scale(value);
                }
            }
        }
        if (bandAware) {
            const offset = this.bandwidth ? this.bandwidth() / 2 : 0;
            return this.scale(value) + offset;
        }
        return this.scale(value);
    }
    isInRange(value) {
        const range = this.range();
        const first = range[0];
        const last = range[range.length - 1];
        return first <= last ? value >= first && value <= last : value >= last && value <= first;
    }
}
exports.ScaleHelper = ScaleHelper;
ScaleHelper.EPS = 1e-4;
const createLabeledScales = (options) => {
    const scales = Object.keys(options).reduce((res, key) => (Object.assign(Object.assign({}, res), { [key]: ScaleHelper.create(options[key]) })), {});
    return Object.assign(Object.assign({}, scales), { apply(coord, { bandAware, position } = {}) {
            return (0, mapValues_1.default)(coord, (value, label) => scales[label].apply(value, { bandAware, position }));
        },
        isInRange(coord) {
            return (0, every_1.default)(coord, (value, label) => scales[label].isInRange(value));
        } });
};
exports.createLabeledScales = createLabeledScales;
function normalizeAngle(angle) {
    return ((angle % 180) + 180) % 180;
}
exports.normalizeAngle = normalizeAngle;
const getAngledRectangleWidth = ({ width, height }, angle = 0) => {
    const normalizedAngle = normalizeAngle(angle);
    const angleRadians = (normalizedAngle * Math.PI) / 180;
    const angleThreshold = Math.atan(height / width);
    const angledWidth = angleRadians > angleThreshold && angleRadians < Math.PI - angleThreshold
        ? height / Math.sin(angleRadians)
        : width / Math.cos(angleRadians);
    return Math.abs(angledWidth);
};
exports.getAngledRectangleWidth = getAngledRectangleWidth;
//# sourceMappingURL=CartesianUtils.js.map