"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Area = void 0;
var _react = _interopRequireWildcard(require("react"));
var _clsx = _interopRequireDefault(require("clsx"));
var _reactSmooth = _interopRequireDefault(require("react-smooth"));
var _isFunction = _interopRequireDefault(require("lodash/isFunction"));
var _max = _interopRequireDefault(require("lodash/max"));
var _isNil = _interopRequireDefault(require("lodash/isNil"));
var _isNaN = _interopRequireDefault(require("lodash/isNaN"));
var _isEqual = _interopRequireDefault(require("lodash/isEqual"));
var _Curve = require("../shape/Curve");
var _Dot = require("../shape/Dot");
var _Layer = require("../container/Layer");
var _LabelList = require("../component/LabelList");
var _Global = require("../util/Global");
var _DataUtils = require("../util/DataUtils");
var _ChartUtils = require("../util/ChartUtils");
var _ReactUtils = require("../util/ReactUtils");
var _legendPayloadContext = require("../context/legendPayloadContext");
var _excluded = ["layout", "type", "stroke", "connectNulls", "isRange", "ref"];
var _Area;
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * @fileOverview Area
 */
function getLegendItemColor(stroke, fill) {
  return stroke && stroke !== 'none' ? stroke : fill;
}
var computeLegendPayloadFromAreaData = props => {
  var {
    dataKey,
    name,
    stroke,
    fill,
    legendType,
    hide
  } = props;
  return [{
    inactive: hide,
    dataKey,
    type: legendType,
    color: getLegendItemColor(stroke, fill),
    value: name || dataKey,
    payload: props
  }];
};
function SetAreaLegend(props) {
  (0, _legendPayloadContext.useLegendPayloadDispatch)(computeLegendPayloadFromAreaData, props);
  return null;
}
class Area extends _react.PureComponent {
  constructor() {
    super(...arguments);
    _defineProperty(this, "state", {
      isAnimationFinished: true
    });
    _defineProperty(this, "id", (0, _DataUtils.uniqueId)('recharts-area-'));
    _defineProperty(this, "handleAnimationEnd", () => {
      var {
        onAnimationEnd
      } = this.props;
      this.setState({
        isAnimationFinished: true
      });
      if ((0, _isFunction.default)(onAnimationEnd)) {
        onAnimationEnd();
      }
    });
    _defineProperty(this, "handleAnimationStart", () => {
      var {
        onAnimationStart
      } = this.props;
      this.setState({
        isAnimationFinished: false
      });
      if ((0, _isFunction.default)(onAnimationStart)) {
        onAnimationStart();
      }
    });
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.animationId !== prevState.prevAnimationId) {
      return {
        prevAnimationId: nextProps.animationId,
        curPoints: nextProps.points,
        curBaseLine: nextProps.baseLine,
        prevPoints: prevState.curPoints,
        prevBaseLine: prevState.curBaseLine
      };
    }
    if (nextProps.points !== prevState.curPoints || nextProps.baseLine !== prevState.curBaseLine) {
      return {
        curPoints: nextProps.points,
        curBaseLine: nextProps.baseLine
      };
    }
    return null;
  }
  renderDots(needClip, clipDot, clipPathId) {
    var {
      isAnimationActive
    } = this.props;
    var {
      isAnimationFinished
    } = this.state;
    if (isAnimationActive && !isAnimationFinished) {
      return null;
    }
    var {
      dot,
      points,
      dataKey
    } = this.props;
    var areaProps = (0, _ReactUtils.filterProps)(this.props, false);
    var customDotProps = (0, _ReactUtils.filterProps)(dot, true);
    var dots = points.map((entry, i) => {
      var dotProps = _objectSpread(_objectSpread(_objectSpread({
        key: "dot-".concat(i),
        r: 3
      }, areaProps), customDotProps), {}, {
        dataKey,
        cx: entry.x,
        cy: entry.y,
        index: i,
        value: entry.value,
        payload: entry.payload
      });
      return Area.renderDotItem(dot, dotProps);
    });
    var dotsProps = {
      clipPath: needClip ? "url(#clipPath-".concat(clipDot ? '' : 'dots-').concat(clipPathId, ")") : null
    };
    return /*#__PURE__*/_react.default.createElement(_Layer.Layer, _extends({
      className: "recharts-area-dots"
    }, dotsProps), dots);
  }
  renderHorizontalRect(alpha) {
    var {
      baseLine,
      points,
      strokeWidth
    } = this.props;
    var startX = points[0].x;
    var endX = points[points.length - 1].x;
    var width = alpha * Math.abs(startX - endX);
    var maxY = (0, _max.default)(points.map(entry => entry.y || 0));
    if ((0, _DataUtils.isNumber)(baseLine) && typeof baseLine === 'number') {
      maxY = Math.max(baseLine, maxY);
    } else if (baseLine && Array.isArray(baseLine) && baseLine.length) {
      maxY = Math.max((0, _max.default)(baseLine.map(entry => entry.y || 0)), maxY);
    }
    if ((0, _DataUtils.isNumber)(maxY)) {
      return /*#__PURE__*/_react.default.createElement("rect", {
        x: startX < endX ? startX : startX - width,
        y: 0,
        width: width,
        height: Math.floor(maxY + (strokeWidth ? parseInt("".concat(strokeWidth), 10) : 1))
      });
    }
    return null;
  }
  renderVerticalRect(alpha) {
    var {
      baseLine,
      points,
      strokeWidth
    } = this.props;
    var startY = points[0].y;
    var endY = points[points.length - 1].y;
    var height = alpha * Math.abs(startY - endY);
    var maxX = (0, _max.default)(points.map(entry => entry.x || 0));
    if ((0, _DataUtils.isNumber)(baseLine) && typeof baseLine === 'number') {
      maxX = Math.max(baseLine, maxX);
    } else if (baseLine && Array.isArray(baseLine) && baseLine.length) {
      maxX = Math.max((0, _max.default)(baseLine.map(entry => entry.x || 0)), maxX);
    }
    if ((0, _DataUtils.isNumber)(maxX)) {
      return /*#__PURE__*/_react.default.createElement("rect", {
        x: 0,
        y: startY < endY ? startY : startY - height,
        width: maxX + (strokeWidth ? parseInt("".concat(strokeWidth), 10) : 1),
        height: Math.floor(height)
      });
    }
    return null;
  }
  renderClipRect(alpha) {
    var {
      layout
    } = this.props;
    if (layout === 'vertical') {
      return this.renderVerticalRect(alpha);
    }
    return this.renderHorizontalRect(alpha);
  }
  renderAreaStatically(points, baseLine, needClip, clipPathId) {
    var _this$props = this.props,
      {
        layout,
        type,
        stroke,
        connectNulls,
        isRange,
        ref
      } = _this$props,
      others = _objectWithoutProperties(_this$props, _excluded);
    return /*#__PURE__*/_react.default.createElement(_Layer.Layer, {
      clipPath: needClip ? "url(#clipPath-".concat(clipPathId, ")") : null
    }, /*#__PURE__*/_react.default.createElement(_Curve.Curve, _extends({}, (0, _ReactUtils.filterProps)(others, true), {
      points: points,
      connectNulls: connectNulls,
      type: type,
      baseLine: baseLine,
      layout: layout,
      stroke: "none",
      className: "recharts-area-area"
    })), stroke !== 'none' && /*#__PURE__*/_react.default.createElement(_Curve.Curve, _extends({}, (0, _ReactUtils.filterProps)(this.props, false), {
      className: "recharts-area-curve",
      layout: layout,
      type: type,
      connectNulls: connectNulls,
      fill: "none",
      points: points
    })), stroke !== 'none' && isRange && /*#__PURE__*/_react.default.createElement(_Curve.Curve, _extends({}, (0, _ReactUtils.filterProps)(this.props, false), {
      className: "recharts-area-curve",
      layout: layout,
      type: type,
      connectNulls: connectNulls,
      fill: "none",
      points: baseLine
    })));
  }
  renderAreaWithAnimation(needClip, clipPathId) {
    var {
      points,
      baseLine,
      isAnimationActive,
      animationBegin,
      animationDuration,
      animationEasing,
      animationId
    } = this.props;
    var {
      prevPoints,
      prevBaseLine
    } = this.state;
    // const clipPathId = isNil(id) ? this.id : id;

    return /*#__PURE__*/_react.default.createElement(_reactSmooth.default, {
      begin: animationBegin,
      duration: animationDuration,
      isActive: isAnimationActive,
      easing: animationEasing,
      from: {
        t: 0
      },
      to: {
        t: 1
      },
      key: "area-".concat(animationId),
      onAnimationEnd: this.handleAnimationEnd,
      onAnimationStart: this.handleAnimationStart
    }, _ref => {
      var {
        t
      } = _ref;
      if (prevPoints) {
        var prevPointsDiffFactor = prevPoints.length / points.length;
        // update animtaion
        var stepPoints = points.map((entry, index) => {
          var prevPointIndex = Math.floor(index * prevPointsDiffFactor);
          if (prevPoints[prevPointIndex]) {
            var prev = prevPoints[prevPointIndex];
            var interpolatorX = (0, _DataUtils.interpolateNumber)(prev.x, entry.x);
            var interpolatorY = (0, _DataUtils.interpolateNumber)(prev.y, entry.y);
            return _objectSpread(_objectSpread({}, entry), {}, {
              x: interpolatorX(t),
              y: interpolatorY(t)
            });
          }
          return entry;
        });
        var stepBaseLine;
        if ((0, _DataUtils.isNumber)(baseLine) && typeof baseLine === 'number') {
          var interpolator = (0, _DataUtils.interpolateNumber)(prevBaseLine, baseLine);
          stepBaseLine = interpolator(t);
        } else if ((0, _isNil.default)(baseLine) || (0, _isNaN.default)(baseLine)) {
          var _interpolator = (0, _DataUtils.interpolateNumber)(prevBaseLine, 0);
          stepBaseLine = _interpolator(t);
        } else {
          stepBaseLine = baseLine.map((entry, index) => {
            var prevPointIndex = Math.floor(index * prevPointsDiffFactor);
            if (prevBaseLine[prevPointIndex]) {
              var prev = prevBaseLine[prevPointIndex];
              var interpolatorX = (0, _DataUtils.interpolateNumber)(prev.x, entry.x);
              var interpolatorY = (0, _DataUtils.interpolateNumber)(prev.y, entry.y);
              return _objectSpread(_objectSpread({}, entry), {}, {
                x: interpolatorX(t),
                y: interpolatorY(t)
              });
            }
            return entry;
          });
        }
        return this.renderAreaStatically(stepPoints, stepBaseLine, needClip, clipPathId);
      }
      return /*#__PURE__*/_react.default.createElement(_Layer.Layer, null, /*#__PURE__*/_react.default.createElement("defs", null, /*#__PURE__*/_react.default.createElement("clipPath", {
        id: "animationClipPath-".concat(clipPathId)
      }, this.renderClipRect(t))), /*#__PURE__*/_react.default.createElement(_Layer.Layer, {
        clipPath: "url(#animationClipPath-".concat(clipPathId, ")")
      }, this.renderAreaStatically(points, baseLine, needClip, clipPathId)));
    });
  }
  renderArea(needClip, clipPathId) {
    var {
      points,
      baseLine,
      isAnimationActive
    } = this.props;
    var {
      prevPoints,
      prevBaseLine,
      totalLength
    } = this.state;
    if (isAnimationActive && points && points.length && (!prevPoints && totalLength > 0 || !(0, _isEqual.default)(prevPoints, points) || !(0, _isEqual.default)(prevBaseLine, baseLine))) {
      return this.renderAreaWithAnimation(needClip, clipPathId);
    }
    return this.renderAreaStatically(points, baseLine, needClip, clipPathId);
  }
  render() {
    var _filterProps;
    var {
      hide,
      dot,
      points,
      className,
      top,
      left,
      xAxis,
      yAxis,
      width,
      height,
      isAnimationActive,
      id
    } = this.props;
    if (hide || !points || !points.length) {
      return /*#__PURE__*/_react.default.createElement(SetAreaLegend, this.props);
    }
    var {
      isAnimationFinished
    } = this.state;
    var hasSinglePoint = points.length === 1;
    var layerClass = (0, _clsx.default)('recharts-area', className);
    var needClipX = xAxis && xAxis.allowDataOverflow;
    var needClipY = yAxis && yAxis.allowDataOverflow;
    var needClip = needClipX || needClipY;
    var clipPathId = (0, _isNil.default)(id) ? this.id : id;
    var {
      r = 3,
      strokeWidth = 2
    } = (_filterProps = (0, _ReactUtils.filterProps)(dot, false)) !== null && _filterProps !== void 0 ? _filterProps : {
      r: 3,
      strokeWidth: 2
    };
    var {
      clipDot = true
    } = (0, _ReactUtils.isDotProps)(dot) ? dot : {};
    var dotSize = r * 2 + strokeWidth;
    return /*#__PURE__*/_react.default.createElement(_Layer.Layer, {
      className: layerClass
    }, /*#__PURE__*/_react.default.createElement(SetAreaLegend, this.props), needClipX || needClipY ? /*#__PURE__*/_react.default.createElement("defs", null, /*#__PURE__*/_react.default.createElement("clipPath", {
      id: "clipPath-".concat(clipPathId)
    }, /*#__PURE__*/_react.default.createElement("rect", {
      x: needClipX ? left : left - width / 2,
      y: needClipY ? top : top - height / 2,
      width: needClipX ? width : width * 2,
      height: needClipY ? height : height * 2
    })), !clipDot && /*#__PURE__*/_react.default.createElement("clipPath", {
      id: "clipPath-dots-".concat(clipPathId)
    }, /*#__PURE__*/_react.default.createElement("rect", {
      x: left - dotSize / 2,
      y: top - dotSize / 2,
      width: width + dotSize,
      height: height + dotSize
    }))) : null, !hasSinglePoint ? this.renderArea(needClip, clipPathId) : null, (dot || hasSinglePoint) && this.renderDots(needClip, clipDot, clipPathId), (!isAnimationActive || isAnimationFinished) && _LabelList.LabelList.renderCallByParent(this.props, points));
  }
}
exports.Area = Area;
_Area = Area;
_defineProperty(Area, "displayName", 'Area');
_defineProperty(Area, "defaultProps", {
  stroke: '#3182bd',
  fill: '#3182bd',
  fillOpacity: 0.6,
  xAxisId: 0,
  yAxisId: 0,
  legendType: 'line',
  connectNulls: false,
  // points of area
  points: [],
  dot: false,
  activeDot: true,
  hide: false,
  isAnimationActive: !_Global.Global.isSsr,
  animationBegin: 0,
  animationDuration: 1500,
  animationEasing: 'ease'
});
_defineProperty(Area, "getBaseValue", (props, item, xAxis, yAxis) => {
  var {
    layout,
    baseValue: chartBaseValue
  } = props;
  var {
    baseValue: itemBaseValue
  } = item.props;

  // The baseValue can be defined both on the AreaChart as well as on the Area.
  // The value for the item takes precedence.
  var baseValue = itemBaseValue !== null && itemBaseValue !== void 0 ? itemBaseValue : chartBaseValue;
  if ((0, _DataUtils.isNumber)(baseValue) && typeof baseValue === 'number') {
    return baseValue;
  }
  var numericAxis = layout === 'horizontal' ? yAxis : xAxis;
  var domain = numericAxis.scale.domain();
  if (numericAxis.type === 'number') {
    var domainMax = Math.max(domain[0], domain[1]);
    var domainMin = Math.min(domain[0], domain[1]);
    if (baseValue === 'dataMin') {
      return domainMin;
    }
    if (baseValue === 'dataMax') {
      return domainMax;
    }
    return domainMax < 0 ? domainMax : Math.max(Math.min(domain[0], domain[1]), 0);
  }
  if (baseValue === 'dataMin') {
    return domain[0];
  }
  if (baseValue === 'dataMax') {
    return domain[1];
  }
  return domain[0];
});
_defineProperty(Area, "getComposedData", _ref2 => {
  var {
    props,
    item,
    xAxis,
    yAxis,
    xAxisTicks,
    yAxisTicks,
    bandSize,
    dataKey,
    stackedData,
    dataStartIndex,
    displayedData,
    offset
  } = _ref2;
  var {
    layout
  } = props;
  var hasStack = stackedData && stackedData.length;
  var baseValue = _Area.getBaseValue(props, item, xAxis, yAxis);
  var isHorizontalLayout = layout === 'horizontal';
  var isRange = false;
  var points = displayedData.map((entry, index) => {
    var value;
    if (hasStack) {
      value = stackedData[dataStartIndex + index];
    } else {
      value = (0, _ChartUtils.getValueByDataKey)(entry, dataKey);
      if (!Array.isArray(value)) {
        value = [baseValue, value];
      } else {
        isRange = true;
      }
    }
    var isBreakPoint = value[1] == null || hasStack && (0, _ChartUtils.getValueByDataKey)(entry, dataKey) == null;
    if (isHorizontalLayout) {
      return {
        x: (0, _ChartUtils.getCateCoordinateOfLine)({
          axis: xAxis,
          ticks: xAxisTicks,
          bandSize,
          entry,
          index
        }),
        y: isBreakPoint ? null : yAxis.scale(value[1]),
        value,
        payload: entry
      };
    }
    return {
      x: isBreakPoint ? null : xAxis.scale(value[1]),
      y: (0, _ChartUtils.getCateCoordinateOfLine)({
        axis: yAxis,
        ticks: yAxisTicks,
        bandSize,
        entry,
        index
      }),
      value,
      payload: entry
    };
  });
  var baseLine;
  if (hasStack || isRange) {
    baseLine = points.map(entry => {
      var x = Array.isArray(entry.value) ? entry.value[0] : null;
      if (isHorizontalLayout) {
        return {
          x: entry.x,
          y: x != null && entry.y != null ? yAxis.scale(x) : null
        };
      }
      return {
        x: x != null ? xAxis.scale(x) : null,
        y: entry.y
      };
    });
  } else {
    baseLine = isHorizontalLayout ? yAxis.scale(baseValue) : xAxis.scale(baseValue);
  }
  return _objectSpread({
    points,
    baseLine,
    layout,
    isRange
  }, offset);
});
_defineProperty(Area, "renderDotItem", (option, props) => {
  var dotItem;
  if ( /*#__PURE__*/_react.default.isValidElement(option)) {
    dotItem = /*#__PURE__*/_react.default.cloneElement(option, props);
  } else if ((0, _isFunction.default)(option)) {
    dotItem = option(props);
  } else {
    var className = (0, _clsx.default)('recharts-area-dot', typeof option !== 'boolean' ? option.className : '');
    dotItem = /*#__PURE__*/_react.default.createElement(_Dot.Dot, _extends({}, props, {
      className: className
    }));
  }
  return dotItem;
});