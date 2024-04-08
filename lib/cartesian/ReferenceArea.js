"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReferenceArea = ReferenceArea;
var _react = _interopRequireDefault(require("react"));
var _isFunction = _interopRequireDefault(require("lodash/isFunction"));
var _clsx = _interopRequireDefault(require("clsx"));
var _Layer = require("../container/Layer");
var _Label = require("../component/Label");
var _CartesianUtils = require("../util/CartesianUtils");
var _DataUtils = require("../util/DataUtils");
var _Rectangle = require("../shape/Rectangle");
var _ReactUtils = require("../util/ReactUtils");
var _chartLayoutContext = require("../context/chartLayoutContext");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); } /**
 * @fileOverview Reference Line
 */
var getRect = (hasX1, hasX2, hasY1, hasY2, xAxis, yAxis, props) => {
  var {
    x1: xValue1,
    x2: xValue2,
    y1: yValue1,
    y2: yValue2
  } = props;
  if (!xAxis || !yAxis) return null;
  var scales = (0, _CartesianUtils.createLabeledScales)({
    x: xAxis.scale,
    y: yAxis.scale
  });
  var p1 = {
    x: hasX1 ? scales.x.apply(xValue1, {
      position: 'start'
    }) : scales.x.rangeMin,
    y: hasY1 ? scales.y.apply(yValue1, {
      position: 'start'
    }) : scales.y.rangeMin
  };
  var p2 = {
    x: hasX2 ? scales.x.apply(xValue2, {
      position: 'end'
    }) : scales.x.rangeMax,
    y: hasY2 ? scales.y.apply(yValue2, {
      position: 'end'
    }) : scales.y.rangeMax
  };
  if (props.ifOverflow === 'discard' && (!scales.isInRange(p1) || !scales.isInRange(p2))) {
    return null;
  }
  return (0, _CartesianUtils.rectWithPoints)(p1, p2);
};
var renderRect = (option, props) => {
  var rect;
  if ( /*#__PURE__*/_react.default.isValidElement(option)) {
    rect = /*#__PURE__*/_react.default.cloneElement(option, props);
  } else if ((0, _isFunction.default)(option)) {
    rect = option(props);
  } else {
    rect = /*#__PURE__*/_react.default.createElement(_Rectangle.Rectangle, _extends({}, props, {
      className: "recharts-reference-area-rect"
    }));
  }
  return rect;
};
function ReferenceArea(props) {
  var {
    x1,
    x2,
    y1,
    y2,
    className,
    shape,
    xAxisId,
    yAxisId
  } = props;
  var clipPathId = (0, _chartLayoutContext.useClipPathId)();
  var xAxis = (0, _chartLayoutContext.useMaybeXAxis)(xAxisId);
  var yAxis = (0, _chartLayoutContext.useMaybeYAxis)(yAxisId);
  if (!xAxis || !yAxis) return null;
  var hasX1 = (0, _DataUtils.isNumOrStr)(x1);
  var hasX2 = (0, _DataUtils.isNumOrStr)(x2);
  var hasY1 = (0, _DataUtils.isNumOrStr)(y1);
  var hasY2 = (0, _DataUtils.isNumOrStr)(y2);
  if (!hasX1 && !hasX2 && !hasY1 && !hasY2 && !shape) {
    return null;
  }

  // @ts-expect-error the xAxis and yAxis in context do not match what this function is expecting - the whole axis type situation needs improvement
  var rect = getRect(hasX1, hasX2, hasY1, hasY2, xAxis, yAxis, props);
  if (!rect && !shape) {
    return null;
  }
  var isOverflowHidden = props.ifOverflow === 'hidden';
  var clipPath = isOverflowHidden ? "url(#".concat(clipPathId, ")") : undefined;
  return /*#__PURE__*/_react.default.createElement(_Layer.Layer, {
    className: (0, _clsx.default)('recharts-reference-area', className)
  }, renderRect(shape, _objectSpread(_objectSpread({
    clipPath
  }, (0, _ReactUtils.filterProps)(props, true)), rect)), _Label.Label.renderCallByParent(props, rect));
}
ReferenceArea.displayName = 'ReferenceArea';
ReferenceArea.defaultProps = {
  isFront: false,
  ifOverflow: 'discard',
  xAxisId: 0,
  yAxisId: 0,
  r: 10,
  fill: '#ccc',
  fillOpacity: 0.5,
  stroke: 'none',
  strokeWidth: 1
};