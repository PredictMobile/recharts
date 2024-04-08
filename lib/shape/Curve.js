"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPath = exports.Curve = void 0;
var _react = _interopRequireDefault(require("react"));
var _d3Shape = require("victory-vendor/d3-shape");
var _upperFirst = _interopRequireDefault(require("lodash/upperFirst"));
var _isFunction = _interopRequireDefault(require("lodash/isFunction"));
var _clsx = _interopRequireDefault(require("clsx"));
var _types = require("../util/types");
var _ReactUtils = require("../util/ReactUtils");
var _DataUtils = require("../util/DataUtils");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * @fileOverview Curve
 */
var CURVE_FACTORIES = {
  curveBasisClosed: _d3Shape.curveBasisClosed,
  curveBasisOpen: _d3Shape.curveBasisOpen,
  curveBasis: _d3Shape.curveBasis,
  curveBumpX: _d3Shape.curveBumpX,
  curveBumpY: _d3Shape.curveBumpY,
  curveLinearClosed: _d3Shape.curveLinearClosed,
  curveLinear: _d3Shape.curveLinear,
  curveMonotoneX: _d3Shape.curveMonotoneX,
  curveMonotoneY: _d3Shape.curveMonotoneY,
  curveNatural: _d3Shape.curveNatural,
  curveStep: _d3Shape.curveStep,
  curveStepAfter: _d3Shape.curveStepAfter,
  curveStepBefore: _d3Shape.curveStepBefore
};
var defined = p => p.x === +p.x && p.y === +p.y;
var getX = p => p.x;
var getY = p => p.y;
var getCurveFactory = (type, layout) => {
  if ((0, _isFunction.default)(type)) {
    return type;
  }
  var name = "curve".concat((0, _upperFirst.default)(type));
  if ((name === 'curveMonotone' || name === 'curveBump') && layout) {
    return CURVE_FACTORIES["".concat(name).concat(layout === 'vertical' ? 'Y' : 'X')];
  }
  return CURVE_FACTORIES[name] || _d3Shape.curveLinear;
};
/**
 * Calculate the path of curve. Returns null if points is an empty array.
 * @return path or null
 */
var getPath = _ref => {
  var {
    type = 'linear',
    points = [],
    baseLine,
    layout,
    connectNulls = false
  } = _ref;
  var curveFactory = getCurveFactory(type, layout);
  var formatPoints = connectNulls ? points.filter(entry => defined(entry)) : points;
  var lineFunction;
  if (Array.isArray(baseLine)) {
    var formatBaseLine = connectNulls ? baseLine.filter(base => defined(base)) : baseLine;
    var areaPoints = formatPoints.map((entry, index) => _objectSpread(_objectSpread({}, entry), {}, {
      base: formatBaseLine[index]
    }));
    if (layout === 'vertical') {
      lineFunction = (0, _d3Shape.area)().y(getY).x1(getX).x0(d => d.base.x);
    } else {
      lineFunction = (0, _d3Shape.area)().x(getX).y1(getY).y0(d => d.base.y);
    }
    lineFunction.defined(defined).curve(curveFactory);
    return lineFunction(areaPoints);
  }
  if (layout === 'vertical' && (0, _DataUtils.isNumber)(baseLine)) {
    lineFunction = (0, _d3Shape.area)().y(getY).x1(getX).x0(baseLine);
  } else if ((0, _DataUtils.isNumber)(baseLine)) {
    lineFunction = (0, _d3Shape.area)().x(getX).y1(getY).y0(baseLine);
  } else {
    lineFunction = (0, _d3Shape.line)().x(getX).y(getY);
  }
  lineFunction.defined(defined).curve(curveFactory);
  return lineFunction(formatPoints);
};
exports.getPath = getPath;
var Curve = props => {
  var {
    className,
    points,
    path,
    pathRef
  } = props;
  if ((!points || !points.length) && !path) {
    return null;
  }
  var realPath = points && points.length ? getPath(props) : path;
  return /*#__PURE__*/_react.default.createElement("path", _extends({}, (0, _ReactUtils.filterProps)(props, false), (0, _types.adaptEventHandlers)(props), {
    className: (0, _clsx.default)('recharts-curve', className),
    d: realPath,
    ref: pathRef
  }));
};
exports.Curve = Curve;