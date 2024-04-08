"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTickClassName = exports.inRangeOfSector = exports.formatAngleOfSector = exports.getAngleOfPoint = exports.distanceBetweenPoints = exports.formatAxisMap = exports.getMaxRadius = exports.polarToCartesian = exports.radianToDegree = exports.degreeToRadian = exports.RADIAN = void 0;
const isNil_1 = __importDefault(require("lodash/isNil"));
const react_1 = require("react");
const isFunction_1 = __importDefault(require("lodash/isFunction"));
const DataUtils_1 = require("./DataUtils");
const ChartUtils_1 = require("./ChartUtils");
exports.RADIAN = Math.PI / 180;
const degreeToRadian = (angle) => (angle * Math.PI) / 180;
exports.degreeToRadian = degreeToRadian;
const radianToDegree = (angleInRadian) => (angleInRadian * 180) / Math.PI;
exports.radianToDegree = radianToDegree;
const polarToCartesian = (cx, cy, radius, angle) => ({
    x: cx + Math.cos(-exports.RADIAN * angle) * radius,
    y: cy + Math.sin(-exports.RADIAN * angle) * radius,
});
exports.polarToCartesian = polarToCartesian;
const getMaxRadius = (width, height, offset = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
}) => Math.min(Math.abs(width - (offset.left || 0) - (offset.right || 0)), Math.abs(height - (offset.top || 0) - (offset.bottom || 0))) / 2;
exports.getMaxRadius = getMaxRadius;
const formatAxisMap = (props, axisMap, offset, axisType, chartName) => {
    const { width, height } = props;
    let { startAngle, endAngle } = props;
    const cx = (0, DataUtils_1.getPercentValue)(props.cx, width, width / 2);
    const cy = (0, DataUtils_1.getPercentValue)(props.cy, height, height / 2);
    const maxRadius = (0, exports.getMaxRadius)(width, height, offset);
    const innerRadius = (0, DataUtils_1.getPercentValue)(props.innerRadius, maxRadius, 0);
    const outerRadius = (0, DataUtils_1.getPercentValue)(props.outerRadius, maxRadius, maxRadius * 0.8);
    const ids = Object.keys(axisMap);
    return ids.reduce((result, id) => {
        const axis = axisMap[id];
        const { domain, reversed } = axis;
        let range;
        if ((0, isNil_1.default)(axis.range)) {
            if (axisType === 'angleAxis') {
                range = [startAngle, endAngle];
            }
            else if (axisType === 'radiusAxis') {
                range = [innerRadius, outerRadius];
            }
            if (reversed) {
                range = [range[1], range[0]];
            }
        }
        else {
            ({ range } = axis);
            [startAngle, endAngle] = range;
        }
        const { realScaleType, scale } = (0, ChartUtils_1.parseScale)(axis, chartName);
        scale.domain(domain).range(range);
        (0, ChartUtils_1.checkDomainOfScale)(scale);
        const ticks = (0, ChartUtils_1.getTicksOfScale)(scale, Object.assign(Object.assign({}, axis), { realScaleType }));
        const finalAxis = Object.assign(Object.assign(Object.assign({}, axis), ticks), { range, radius: outerRadius, realScaleType,
            scale,
            cx,
            cy,
            innerRadius,
            outerRadius,
            startAngle,
            endAngle });
        return Object.assign(Object.assign({}, result), { [id]: finalAxis });
    }, {});
};
exports.formatAxisMap = formatAxisMap;
const distanceBetweenPoints = (point, anotherPoint) => {
    const { x: x1, y: y1 } = point;
    const { x: x2, y: y2 } = anotherPoint;
    return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
};
exports.distanceBetweenPoints = distanceBetweenPoints;
const getAngleOfPoint = ({ x, y }, { cx, cy }) => {
    const radius = (0, exports.distanceBetweenPoints)({ x, y }, { x: cx, y: cy });
    if (radius <= 0) {
        return { radius };
    }
    const cos = (x - cx) / radius;
    let angleInRadian = Math.acos(cos);
    if (y > cy) {
        angleInRadian = 2 * Math.PI - angleInRadian;
    }
    return { radius, angle: (0, exports.radianToDegree)(angleInRadian), angleInRadian };
};
exports.getAngleOfPoint = getAngleOfPoint;
const formatAngleOfSector = ({ startAngle, endAngle }) => {
    const startCnt = Math.floor(startAngle / 360);
    const endCnt = Math.floor(endAngle / 360);
    const min = Math.min(startCnt, endCnt);
    return {
        startAngle: startAngle - min * 360,
        endAngle: endAngle - min * 360,
    };
};
exports.formatAngleOfSector = formatAngleOfSector;
const reverseFormatAngleOfSetor = (angle, { startAngle, endAngle }) => {
    const startCnt = Math.floor(startAngle / 360);
    const endCnt = Math.floor(endAngle / 360);
    const min = Math.min(startCnt, endCnt);
    return angle + min * 360;
};
const inRangeOfSector = ({ x, y }, sector) => {
    const { radius, angle } = (0, exports.getAngleOfPoint)({ x, y }, sector);
    const { innerRadius, outerRadius } = sector;
    if (radius < innerRadius || radius > outerRadius) {
        return false;
    }
    if (radius === 0) {
        return true;
    }
    const { startAngle, endAngle } = (0, exports.formatAngleOfSector)(sector);
    let formatAngle = angle;
    let inRange;
    if (startAngle <= endAngle) {
        while (formatAngle > endAngle) {
            formatAngle -= 360;
        }
        while (formatAngle < startAngle) {
            formatAngle += 360;
        }
        inRange = formatAngle >= startAngle && formatAngle <= endAngle;
    }
    else {
        while (formatAngle > startAngle) {
            formatAngle -= 360;
        }
        while (formatAngle < endAngle) {
            formatAngle += 360;
        }
        inRange = formatAngle >= endAngle && formatAngle <= startAngle;
    }
    if (inRange) {
        return Object.assign(Object.assign({}, sector), { radius, angle: reverseFormatAngleOfSetor(formatAngle, sector) });
    }
    return null;
};
exports.inRangeOfSector = inRangeOfSector;
const getTickClassName = (tick) => (!(0, react_1.isValidElement)(tick) && !(0, isFunction_1.default)(tick) && typeof tick !== 'boolean' ? tick.className : '');
exports.getTickClassName = getTickClassName;
//# sourceMappingURL=PolarUtils.js.map