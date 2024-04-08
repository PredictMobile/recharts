"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReferenceDot = ReferenceDot;
var _react = _interopRequireDefault(require("react"));
var _isFunction = _interopRequireDefault(require("lodash/isFunction"));
var _clsx = _interopRequireDefault(require("clsx"));
var _Layer = require("../container/Layer");
var _Dot = require("../shape/Dot");
var _Label = require("../component/Label");
var _DataUtils = require("../util/DataUtils");
var _CartesianUtils = require("../util/CartesianUtils");
var _ReactUtils = require("../util/ReactUtils");
var _chartLayoutContext = require("../context/chartLayoutContext");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var useCoordinate = (x, y, xAxisId, yAxisId, ifOverflow) => {
  var isX = (0, _DataUtils.isNumOrStr)(x);
  var isY = (0, _DataUtils.isNumOrStr)(y);
  var xAxis = (0, _chartLayoutContext.useXAxisOrThrow)(xAxisId);
  var yAxis = (0, _chartLayoutContext.useYAxisOrThrow)(yAxisId);
  if (!isX || !isY) {
    return null;
  }
  var scales = (0, _CartesianUtils.createLabeledScales)({
    x: xAxis.scale,
    y: yAxis.scale
  });
  var result = scales.apply({
    x,
    y
  }, {
    bandAware: true
  });
  if (ifOverflow === 'discard' && !scales.isInRange(result)) {
    return null;
  }
  return result;
};
function ReferenceDot(props) {
  var {
    x,
    y,
    r
  } = props;
  var clipPathId = (0, _chartLayoutContext.useClipPathId)();
  var coordinate = useCoordinate(x, y, props.xAxisId, props.yAxisId, props.ifOverflow);
  if (!coordinate) {
    return null;
  }
  var {
    x: cx,
    y: cy
  } = coordinate;
  var {
    shape,
    className,
    ifOverflow
  } = props;
  var clipPath = ifOverflow === 'hidden' ? "url(#".concat(clipPathId, ")") : undefined;
  var dotProps = _objectSpread(_objectSpread({
    clipPath
  }, (0, _ReactUtils.filterProps)(props, true)), {}, {
    cx,
    cy
  });
  return /*#__PURE__*/_react.default.createElement(_Layer.Layer, {
    className: (0, _clsx.default)('recharts-reference-dot', className)
  }, ReferenceDot.renderDot(shape, dotProps), _Label.Label.renderCallByParent(props, {
    x: cx - r,
    y: cy - r,
    width: 2 * r,
    height: 2 * r
  }));
}
ReferenceDot.displayName = 'ReferenceDot';
ReferenceDot.defaultProps = {
  isFront: false,
  ifOverflow: 'discard',
  xAxisId: 0,
  yAxisId: 0,
  r: 10,
  fill: '#fff',
  stroke: '#ccc',
  fillOpacity: 1,
  strokeWidth: 1
};
ReferenceDot.renderDot = (option, props) => {
  var dot;
  if ( /*#__PURE__*/_react.default.isValidElement(option)) {
    dot = /*#__PURE__*/_react.default.cloneElement(option, props);
  } else if ((0, _isFunction.default)(option)) {
    dot = option(props);
  } else {
    dot = /*#__PURE__*/_react.default.createElement(_Dot.Dot, _extends({}, props, {
      cx: props.cx,
      cy: props.cy,
      className: "recharts-reference-dot-dot"
    }));
  }
  return dot;
};