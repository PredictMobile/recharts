"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Curve = exports.getPath = void 0;
const react_1 = __importDefault(require("react"));
const d3_shape_1 = require("victory-vendor/d3-shape");
const upperFirst_1 = __importDefault(require("lodash/upperFirst"));
const isFunction_1 = __importDefault(require("lodash/isFunction"));
const clsx_1 = __importDefault(require("clsx"));
const types_1 = require("../util/types");
const ReactUtils_1 = require("../util/ReactUtils");
const DataUtils_1 = require("../util/DataUtils");
const CURVE_FACTORIES = {
    curveBasisClosed: d3_shape_1.curveBasisClosed,
    curveBasisOpen: d3_shape_1.curveBasisOpen,
    curveBasis: d3_shape_1.curveBasis,
    curveBumpX: d3_shape_1.curveBumpX,
    curveBumpY: d3_shape_1.curveBumpY,
    curveLinearClosed: d3_shape_1.curveLinearClosed,
    curveLinear: d3_shape_1.curveLinear,
    curveMonotoneX: d3_shape_1.curveMonotoneX,
    curveMonotoneY: d3_shape_1.curveMonotoneY,
    curveNatural: d3_shape_1.curveNatural,
    curveStep: d3_shape_1.curveStep,
    curveStepAfter: d3_shape_1.curveStepAfter,
    curveStepBefore: d3_shape_1.curveStepBefore,
};
const defined = (p) => p.x === +p.x && p.y === +p.y;
const getX = (p) => p.x;
const getY = (p) => p.y;
const getCurveFactory = (type, layout) => {
    if ((0, isFunction_1.default)(type)) {
        return type;
    }
    const name = `curve${(0, upperFirst_1.default)(type)}`;
    if ((name === 'curveMonotone' || name === 'curveBump') && layout) {
        return CURVE_FACTORIES[`${name}${layout === 'vertical' ? 'Y' : 'X'}`];
    }
    return CURVE_FACTORIES[name] || d3_shape_1.curveLinear;
};
const getPath = ({ type = 'linear', points = [], baseLine, layout, connectNulls = false, }) => {
    const curveFactory = getCurveFactory(type, layout);
    const formatPoints = connectNulls ? points.filter(entry => defined(entry)) : points;
    let lineFunction;
    if (Array.isArray(baseLine)) {
        const formatBaseLine = connectNulls ? baseLine.filter(base => defined(base)) : baseLine;
        const areaPoints = formatPoints.map((entry, index) => (Object.assign(Object.assign({}, entry), { base: formatBaseLine[index] })));
        if (layout === 'vertical') {
            lineFunction = (0, d3_shape_1.area)()
                .y(getY)
                .x1(getX)
                .x0(d => d.base.x);
        }
        else {
            lineFunction = (0, d3_shape_1.area)()
                .x(getX)
                .y1(getY)
                .y0(d => d.base.y);
        }
        lineFunction.defined(defined).curve(curveFactory);
        return lineFunction(areaPoints);
    }
    if (layout === 'vertical' && (0, DataUtils_1.isNumber)(baseLine)) {
        lineFunction = (0, d3_shape_1.area)().y(getY).x1(getX).x0(baseLine);
    }
    else if ((0, DataUtils_1.isNumber)(baseLine)) {
        lineFunction = (0, d3_shape_1.area)().x(getX).y1(getY).y0(baseLine);
    }
    else {
        lineFunction = (0, d3_shape_1.line)().x(getX).y(getY);
    }
    lineFunction.defined(defined).curve(curveFactory);
    return lineFunction(formatPoints);
};
exports.getPath = getPath;
const Curve = props => {
    const { className, points, path, pathRef } = props;
    if ((!points || !points.length) && !path) {
        return null;
    }
    const realPath = points && points.length ? (0, exports.getPath)(props) : path;
    return (react_1.default.createElement("path", Object.assign({}, (0, ReactUtils_1.filterProps)(props, false), (0, types_1.adaptEventHandlers)(props), { className: (0, clsx_1.default)('recharts-curve', className), d: realPath, ref: pathRef })));
};
exports.Curve = Curve;
//# sourceMappingURL=Curve.js.map