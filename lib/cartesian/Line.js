"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Line = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactSmooth = _interopRequireDefault(require("react-smooth"));
var _isFunction = _interopRequireDefault(require("lodash/isFunction"));
var _isNil = _interopRequireDefault(require("lodash/isNil"));
var _isEqual = _interopRequireDefault(require("lodash/isEqual"));
var _clsx = _interopRequireDefault(require("clsx"));
var _Curve = require("../shape/Curve");
var _Dot = require("../shape/Dot");
var _Layer = require("../container/Layer");
var _LabelList = require("../component/LabelList");
var _ErrorBar = require("./ErrorBar");
var _DataUtils = require("../util/DataUtils");
var _ReactUtils = require("../util/ReactUtils");
var _Global = require("../util/Global");
var _ChartUtils = require("../util/ChartUtils");
var _legendPayloadContext = require("../context/legendPayloadContext");
var _excluded = ["type", "layout", "connectNulls", "ref"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * @fileOverview Line
 */
var computeLegendPayloadFromAreaData = props => {
  var {
    dataKey,
    name,
    stroke,
    legendType,
    hide
  } = props;
  return [{
    inactive: hide,
    dataKey,
    type: legendType,
    color: stroke,
    value: name || dataKey,
    payload: props
  }];
};
function SetLineLegend(props) {
  (0, _legendPayloadContext.useLegendPayloadDispatch)(computeLegendPayloadFromAreaData, props);
  return null;
}
class Line extends _react.PureComponent {
  constructor() {
    super(...arguments);
    _defineProperty(this, "state", {
      isAnimationFinished: true,
      totalLength: 0
    });
    _defineProperty(this, "generateSimpleStrokeDasharray", (totalLength, length) => {
      return "".concat(length, "px ").concat(totalLength - length, "px");
    });
    _defineProperty(this, "getStrokeDasharray", (length, totalLength, lines) => {
      var lineLength = lines.reduce((pre, next) => pre + next);

      // if lineLength is 0 return the default when no strokeDasharray is provided
      if (!lineLength) {
        return this.generateSimpleStrokeDasharray(totalLength, length);
      }
      var count = Math.floor(length / lineLength);
      var remainLength = length % lineLength;
      var restLength = totalLength - length;
      var remainLines = [];
      for (var i = 0, sum = 0; i < lines.length; sum += lines[i], ++i) {
        if (sum + lines[i] > remainLength) {
          remainLines = [...lines.slice(0, i), remainLength - sum];
          break;
        }
      }
      var emptyLines = remainLines.length % 2 === 0 ? [0, restLength] : [restLength];
      return [...Line.repeat(lines, count), ...remainLines, ...emptyLines].map(line => "".concat(line, "px")).join(', ');
    });
    _defineProperty(this, "id", (0, _DataUtils.uniqueId)('recharts-line-'));
    _defineProperty(this, "pathRef", node => {
      this.mainCurve = node;
    });
    _defineProperty(this, "handleAnimationEnd", () => {
      this.setState({
        isAnimationFinished: true
      });
      if (this.props.onAnimationEnd) {
        this.props.onAnimationEnd();
      }
    });
    _defineProperty(this, "handleAnimationStart", () => {
      this.setState({
        isAnimationFinished: false
      });
      if (this.props.onAnimationStart) {
        this.props.onAnimationStart();
      }
    });
  }
  componentDidMount() {
    if (!this.props.isAnimationActive) {
      return;
    }
    var totalLength = this.getTotalLength();
    this.setState({
      totalLength
    });
  }
  componentDidUpdate() {
    if (!this.props.isAnimationActive) {
      return;
    }
    var totalLength = this.getTotalLength();
    if (totalLength !== this.state.totalLength) {
      this.setState({
        totalLength
      });
    }
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.animationId !== prevState.prevAnimationId) {
      return {
        prevAnimationId: nextProps.animationId,
        curPoints: nextProps.points,
        prevPoints: prevState.curPoints
      };
    }
    if (nextProps.points !== prevState.curPoints) {
      return {
        curPoints: nextProps.points
      };
    }
    return null;
  }
  getTotalLength() {
    var curveDom = this.mainCurve;
    try {
      return curveDom && curveDom.getTotalLength && curveDom.getTotalLength() || 0;
    } catch (err) {
      return 0;
    }
  }
  static repeat(lines, count) {
    var linesUnit = lines.length % 2 !== 0 ? [...lines, 0] : lines;
    var result = [];
    for (var i = 0; i < count; ++i) {
      result = [...result, ...linesUnit];
    }
    return result;
  }
  renderErrorBar(needClip, clipPathId) {
    if (this.props.isAnimationActive && !this.state.isAnimationFinished) {
      return null;
    }
    var {
      points,
      xAxis,
      yAxis,
      layout,
      children
    } = this.props;
    var errorBarItems = (0, _ReactUtils.findAllByType)(children, _ErrorBar.ErrorBar);
    if (!errorBarItems) {
      return null;
    }
    var dataPointFormatter = (dataPoint, dataKey) => {
      return {
        x: dataPoint.x,
        y: dataPoint.y,
        value: dataPoint.value,
        errorVal: (0, _ChartUtils.getValueByDataKey)(dataPoint.payload, dataKey)
      };
    };
    var errorBarProps = {
      clipPath: needClip ? "url(#clipPath-".concat(clipPathId, ")") : null
    };
    return /*#__PURE__*/_react.default.createElement(_Layer.Layer, errorBarProps, errorBarItems.map(item => /*#__PURE__*/_react.default.cloneElement(item, {
      key: "bar-".concat(item.props.dataKey),
      data: points,
      xAxis,
      yAxis,
      layout,
      dataPointFormatter
    })));
  }
  static renderDotItem(option, props) {
    var dotItem;
    if ( /*#__PURE__*/_react.default.isValidElement(option)) {
      dotItem = /*#__PURE__*/_react.default.cloneElement(option, props);
    } else if ((0, _isFunction.default)(option)) {
      dotItem = option(props);
    } else {
      var className = (0, _clsx.default)('recharts-line-dot', typeof option !== 'boolean' ? option.className : '');
      dotItem = /*#__PURE__*/_react.default.createElement(_Dot.Dot, _extends({}, props, {
        className: className
      }));
    }
    return dotItem;
  }
  renderDots(needClip, clipDot, clipPathId) {
    var {
      isAnimationActive
    } = this.props;
    if (isAnimationActive && !this.state.isAnimationFinished) {
      return null;
    }
    var {
      dot,
      points,
      dataKey
    } = this.props;
    var lineProps = (0, _ReactUtils.filterProps)(this.props, false);
    var customDotProps = (0, _ReactUtils.filterProps)(dot, true);
    var dots = points.map((entry, i) => {
      var dotProps = _objectSpread(_objectSpread(_objectSpread({
        key: "dot-".concat(i),
        r: 3
      }, lineProps), customDotProps), {}, {
        value: entry.value,
        dataKey,
        cx: entry.x,
        cy: entry.y,
        index: i,
        payload: entry.payload
      });
      return Line.renderDotItem(dot, dotProps);
    });
    var dotsProps = {
      clipPath: needClip ? "url(#clipPath-".concat(clipDot ? '' : 'dots-').concat(clipPathId, ")") : null
    };
    return /*#__PURE__*/_react.default.createElement(_Layer.Layer, _extends({
      className: "recharts-line-dots",
      key: "dots"
    }, dotsProps), dots);
  }
  renderCurveStatically(points, needClip, clipPathId, props) {
    var _this$props = this.props,
      {
        type,
        layout,
        connectNulls,
        ref
      } = _this$props,
      others = _objectWithoutProperties(_this$props, _excluded);
    var curveProps = _objectSpread(_objectSpread(_objectSpread({}, (0, _ReactUtils.filterProps)(others, true)), {}, {
      fill: 'none',
      className: 'recharts-line-curve',
      clipPath: needClip ? "url(#clipPath-".concat(clipPathId, ")") : null,
      points
    }, props), {}, {
      type,
      layout,
      connectNulls
    });
    return /*#__PURE__*/_react.default.createElement(_Curve.Curve, _extends({}, curveProps, {
      pathRef: this.pathRef
    }));
  }
  renderCurveWithAnimation(needClip, clipPathId) {
    var {
      points,
      strokeDasharray,
      isAnimationActive,
      animationBegin,
      animationDuration,
      animationEasing,
      animationId,
      animateNewValues,
      width,
      height
    } = this.props;
    var {
      prevPoints,
      totalLength
    } = this.state;
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
      key: "line-".concat(animationId),
      onAnimationEnd: this.handleAnimationEnd,
      onAnimationStart: this.handleAnimationStart
    }, _ref => {
      var {
        t
      } = _ref;
      if (prevPoints) {
        var prevPointsDiffFactor = prevPoints.length / points.length;
        var stepData = points.map((entry, index) => {
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

          // magic number of faking previous x and y location
          if (animateNewValues) {
            var _interpolatorX = (0, _DataUtils.interpolateNumber)(width * 2, entry.x);
            var _interpolatorY = (0, _DataUtils.interpolateNumber)(height / 2, entry.y);
            return _objectSpread(_objectSpread({}, entry), {}, {
              x: _interpolatorX(t),
              y: _interpolatorY(t)
            });
          }
          return _objectSpread(_objectSpread({}, entry), {}, {
            x: entry.x,
            y: entry.y
          });
        });
        return this.renderCurveStatically(stepData, needClip, clipPathId);
      }
      var interpolator = (0, _DataUtils.interpolateNumber)(0, totalLength);
      var curLength = interpolator(t);
      var currentStrokeDasharray;
      if (strokeDasharray) {
        var lines = "".concat(strokeDasharray).split(/[,\s]+/gim).map(num => parseFloat(num));
        currentStrokeDasharray = this.getStrokeDasharray(curLength, totalLength, lines);
      } else {
        currentStrokeDasharray = this.generateSimpleStrokeDasharray(totalLength, curLength);
      }
      return this.renderCurveStatically(points, needClip, clipPathId, {
        strokeDasharray: currentStrokeDasharray
      });
    });
  }
  renderCurve(needClip, clipPathId) {
    var {
      points,
      isAnimationActive
    } = this.props;
    var {
      prevPoints,
      totalLength
    } = this.state;
    if (isAnimationActive && points && points.length && (!prevPoints && totalLength > 0 || !(0, _isEqual.default)(prevPoints, points))) {
      return this.renderCurveWithAnimation(needClip, clipPathId);
    }
    return this.renderCurveStatically(points, needClip, clipPathId);
  }
  render() {
    var _filterProps;
    var {
      hide,
      dot,
      points,
      className,
      xAxis,
      yAxis,
      top,
      left,
      width,
      height,
      isAnimationActive,
      id
    } = this.props;
    if (hide || !points || !points.length) {
      return /*#__PURE__*/_react.default.createElement(SetLineLegend, this.props);
    }
    var {
      isAnimationFinished
    } = this.state;
    var hasSinglePoint = points.length === 1;
    var layerClass = (0, _clsx.default)('recharts-line', className);
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
    }, /*#__PURE__*/_react.default.createElement(SetLineLegend, this.props), needClipX || needClipY ? /*#__PURE__*/_react.default.createElement("defs", null, /*#__PURE__*/_react.default.createElement("clipPath", {
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
    }))) : null, !hasSinglePoint && this.renderCurve(needClip, clipPathId), this.renderErrorBar(needClip, clipPathId), (hasSinglePoint || dot) && this.renderDots(needClip, clipDot, clipPathId), (!isAnimationActive || isAnimationFinished) && _LabelList.LabelList.renderCallByParent(this.props, points));
  }
}
exports.Line = Line;
_defineProperty(Line, "displayName", 'Line');
_defineProperty(Line, "defaultProps", {
  xAxisId: 0,
  yAxisId: 0,
  connectNulls: false,
  activeDot: true,
  dot: true,
  legendType: 'line',
  stroke: '#3182bd',
  strokeWidth: 1,
  fill: '#fff',
  points: [],
  isAnimationActive: !_Global.Global.isSsr,
  animateNewValues: true,
  animationBegin: 0,
  animationDuration: 1500,
  animationEasing: 'ease',
  hide: false,
  label: false
});
/**
 * Compose the data of each group
 * @param {Object} props The props from the component
 * @param  {Object} xAxis   The configuration of x-axis
 * @param  {Object} yAxis   The configuration of y-axis
 * @param  {String} dataKey The unique key of a group
 * @return {Array}  Composed data
 */
_defineProperty(Line, "getComposedData", _ref2 => {
  var {
    props,
    xAxis,
    yAxis,
    xAxisTicks,
    yAxisTicks,
    dataKey,
    bandSize,
    displayedData,
    offset
  } = _ref2;
  var {
    layout
  } = props;
  var points = displayedData.map((entry, index) => {
    var value = (0, _ChartUtils.getValueByDataKey)(entry, dataKey);
    if (layout === 'horizontal') {
      return {
        x: (0, _ChartUtils.getCateCoordinateOfLine)({
          axis: xAxis,
          ticks: xAxisTicks,
          bandSize,
          entry,
          index
        }),
        y: (0, _isNil.default)(value) ? null : yAxis.scale(value),
        value,
        payload: entry
      };
    }
    return {
      x: (0, _isNil.default)(value) ? null : xAxis.scale(value),
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
  return _objectSpread({
    points,
    layout
  }, offset);
});