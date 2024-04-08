"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Bar = void 0;
var _react = _interopRequireWildcard(require("react"));
var _clsx = _interopRequireDefault(require("clsx"));
var _reactSmooth = _interopRequireDefault(require("react-smooth"));
var _isEqual = _interopRequireDefault(require("lodash/isEqual"));
var _isNil = _interopRequireDefault(require("lodash/isNil"));
var _Layer = require("../container/Layer");
var _ErrorBar = require("./ErrorBar");
var _Cell = require("../component/Cell");
var _LabelList = require("../component/LabelList");
var _DataUtils = require("../util/DataUtils");
var _ReactUtils = require("../util/ReactUtils");
var _Global = require("../util/Global");
var _ChartUtils = require("../util/ChartUtils");
var _types = require("../util/types");
var _BarUtils = require("../util/BarUtils");
var _legendPayloadContext = require("../context/legendPayloadContext");
var _excluded = ["value", "background"];
var _Bar;
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
 * @fileOverview Render a group of bar
 */
var computeLegendPayloadFromBarData = props => {
  var {
    dataKey,
    name,
    fill,
    legendType,
    hide
  } = props;
  return [{
    inactive: hide,
    dataKey,
    type: legendType,
    color: fill,
    value: name || dataKey,
    payload: props
  }];
};
function SetBarLegend(props) {
  (0, _legendPayloadContext.useLegendPayloadDispatch)(computeLegendPayloadFromBarData, props);
  return null;
}
class Bar extends _react.PureComponent {
  constructor() {
    super(...arguments);
    _defineProperty(this, "state", {
      isAnimationFinished: false
    });
    _defineProperty(this, "id", (0, _DataUtils.uniqueId)('recharts-bar-'));
    _defineProperty(this, "handleAnimationEnd", () => {
      var {
        onAnimationEnd
      } = this.props;
      this.setState({
        isAnimationFinished: true
      });
      if (onAnimationEnd) {
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
      if (onAnimationStart) {
        onAnimationStart();
      }
    });
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.animationId !== prevState.prevAnimationId) {
      return {
        prevAnimationId: nextProps.animationId,
        curData: nextProps.data,
        prevData: prevState.curData
      };
    }
    if (nextProps.data !== prevState.curData) {
      return {
        curData: nextProps.data
      };
    }
    return null;
  }
  renderRectanglesStatically(data) {
    var {
      shape,
      dataKey,
      activeIndex,
      activeBar
    } = this.props;
    var baseProps = (0, _ReactUtils.filterProps)(this.props, false);
    return data && data.map((entry, i) => {
      var isActive = i === activeIndex;
      var option = isActive ? activeBar : shape;
      var props = _objectSpread(_objectSpread(_objectSpread({}, baseProps), entry), {}, {
        isActive,
        option,
        index: i,
        dataKey,
        onAnimationStart: this.handleAnimationStart,
        onAnimationEnd: this.handleAnimationEnd
      });
      return /*#__PURE__*/_react.default.createElement(_Layer.Layer, _extends({
        className: "recharts-bar-rectangle"
      }, (0, _types.adaptEventsOfChild)(this.props, entry, i), {
        key: "rectangle-".concat(entry === null || entry === void 0 ? void 0 : entry.x, "-").concat(entry === null || entry === void 0 ? void 0 : entry.y, "-").concat(entry === null || entry === void 0 ? void 0 : entry.value)
      }), /*#__PURE__*/_react.default.createElement(_BarUtils.BarRectangle, props));
    });
  }
  renderRectanglesWithAnimation() {
    var {
      data,
      layout,
      isAnimationActive,
      animationBegin,
      animationDuration,
      animationEasing,
      animationId
    } = this.props;
    var {
      prevData
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
      key: "bar-".concat(animationId),
      onAnimationEnd: this.handleAnimationEnd,
      onAnimationStart: this.handleAnimationStart
    }, _ref => {
      var {
        t
      } = _ref;
      var stepData = data.map((entry, index) => {
        var prev = prevData && prevData[index];
        if (prev) {
          var interpolatorX = (0, _DataUtils.interpolateNumber)(prev.x, entry.x);
          var interpolatorY = (0, _DataUtils.interpolateNumber)(prev.y, entry.y);
          var interpolatorWidth = (0, _DataUtils.interpolateNumber)(prev.width, entry.width);
          var interpolatorHeight = (0, _DataUtils.interpolateNumber)(prev.height, entry.height);
          return _objectSpread(_objectSpread({}, entry), {}, {
            x: interpolatorX(t),
            y: interpolatorY(t),
            width: interpolatorWidth(t),
            height: interpolatorHeight(t)
          });
        }
        if (layout === 'horizontal') {
          var _interpolatorHeight = (0, _DataUtils.interpolateNumber)(0, entry.height);
          var h = _interpolatorHeight(t);
          return _objectSpread(_objectSpread({}, entry), {}, {
            y: entry.y + entry.height - h,
            height: h
          });
        }
        var interpolator = (0, _DataUtils.interpolateNumber)(0, entry.width);
        var w = interpolator(t);
        return _objectSpread(_objectSpread({}, entry), {}, {
          width: w
        });
      });
      return /*#__PURE__*/_react.default.createElement(_Layer.Layer, null, this.renderRectanglesStatically(stepData));
    });
  }
  renderRectangles() {
    var {
      data,
      isAnimationActive
    } = this.props;
    var {
      prevData
    } = this.state;
    if (isAnimationActive && data && data.length && (!prevData || !(0, _isEqual.default)(prevData, data))) {
      return this.renderRectanglesWithAnimation();
    }
    return this.renderRectanglesStatically(data);
  }
  renderBackground() {
    var {
      data,
      dataKey,
      activeIndex
    } = this.props;
    var backgroundProps = (0, _ReactUtils.filterProps)(this.props.background, false);
    return data.map((entry, i) => {
      var {
          value,
          background
        } = entry,
        rest = _objectWithoutProperties(entry, _excluded);
      if (!background) {
        return null;
      }
      var props = _objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread({}, rest), {}, {
        fill: '#eee'
      }, background), backgroundProps), (0, _types.adaptEventsOfChild)(this.props, entry, i)), {}, {
        onAnimationStart: this.handleAnimationStart,
        onAnimationEnd: this.handleAnimationEnd,
        dataKey,
        index: i,
        key: "background-bar-".concat(i),
        className: 'recharts-bar-background-rectangle'
      });
      return /*#__PURE__*/_react.default.createElement(_BarUtils.BarRectangle, _extends({
        option: this.props.background,
        isActive: i === activeIndex
      }, props));
    });
  }
  renderErrorBar(needClip, clipPathId) {
    if (this.props.isAnimationActive && !this.state.isAnimationFinished) {
      return null;
    }
    var {
      data,
      xAxis,
      yAxis,
      layout,
      children
    } = this.props;
    var errorBarItems = (0, _ReactUtils.findAllByType)(children, _ErrorBar.ErrorBar);
    if (!errorBarItems) {
      return null;
    }
    var offset = layout === 'vertical' ? data[0].height / 2 : data[0].width / 2;
    var dataPointFormatter = (dataPoint, dataKey) => {
      /**
       * if the value coming from `getComposedData` is an array then this is a stacked bar chart.
       * arr[1] represents end value of the bar since the data is in the form of [startValue, endValue].
       * */
      var value = Array.isArray(dataPoint.value) ? dataPoint.value[1] : dataPoint.value;
      return {
        x: dataPoint.x,
        y: dataPoint.y,
        value,
        errorVal: (0, _ChartUtils.getValueByDataKey)(dataPoint, dataKey)
      };
    };
    var errorBarProps = {
      clipPath: needClip ? "url(#clipPath-".concat(clipPathId, ")") : null
    };
    return /*#__PURE__*/_react.default.createElement(_Layer.Layer, errorBarProps, errorBarItems.map(item => /*#__PURE__*/_react.default.cloneElement(item, {
      key: "error-bar-".concat(clipPathId, "-").concat(item.props.dataKey),
      data,
      xAxis,
      yAxis,
      layout,
      offset,
      dataPointFormatter
    })));
  }
  render() {
    var {
      hide,
      data,
      className,
      xAxis,
      yAxis,
      left,
      top,
      width,
      height,
      isAnimationActive,
      background,
      id
    } = this.props;
    if (hide || !data || !data.length) {
      return /*#__PURE__*/_react.default.createElement(SetBarLegend, this.props);
    }
    var {
      isAnimationFinished
    } = this.state;
    var layerClass = (0, _clsx.default)('recharts-bar', className);
    var needClipX = xAxis && xAxis.allowDataOverflow;
    var needClipY = yAxis && yAxis.allowDataOverflow;
    var needClip = needClipX || needClipY;
    var clipPathId = (0, _isNil.default)(id) ? this.id : id;
    return /*#__PURE__*/_react.default.createElement(_Layer.Layer, {
      className: layerClass
    }, /*#__PURE__*/_react.default.createElement(SetBarLegend, this.props), needClipX || needClipY ? /*#__PURE__*/_react.default.createElement("defs", null, /*#__PURE__*/_react.default.createElement("clipPath", {
      id: "clipPath-".concat(clipPathId)
    }, /*#__PURE__*/_react.default.createElement("rect", {
      x: needClipX ? left : left - width / 2,
      y: needClipY ? top : top - height / 2,
      width: needClipX ? width : width * 2,
      height: needClipY ? height : height * 2
    }))) : null, /*#__PURE__*/_react.default.createElement(_Layer.Layer, {
      className: "recharts-bar-rectangles",
      clipPath: needClip ? "url(#clipPath-".concat(clipPathId, ")") : null
    }, background ? this.renderBackground() : null, this.renderRectangles()), this.renderErrorBar(needClip, clipPathId), (!isAnimationActive || isAnimationFinished) && _LabelList.LabelList.renderCallByParent(this.props, data));
  }
}
exports.Bar = Bar;
_Bar = Bar;
_defineProperty(Bar, "displayName", 'Bar');
_defineProperty(Bar, "defaultProps", {
  xAxisId: 0,
  yAxisId: 0,
  legendType: 'rect',
  minPointSize: 0,
  hide: false,
  data: [],
  layout: 'vertical',
  activeBar: false,
  isAnimationActive: !_Global.Global.isSsr,
  animationBegin: 0,
  animationDuration: 400,
  animationEasing: 'ease'
});
/**
 * Compose the data of each group
 * @param {Object} props Props for the component
 * @param {Object} item        An instance of Bar
 * @param {Array} barPosition  The offset and size of each bar
 * @param {Object} xAxis       The configuration of x-axis
 * @param {Object} yAxis       The configuration of y-axis
 * @param {Array} stackedData  The stacked data of a bar item
 * @return{Array} Composed data
 */
_defineProperty(Bar, "getComposedData", _ref2 => {
  var {
    props,
    item,
    barPosition,
    bandSize,
    xAxis,
    yAxis,
    xAxisTicks,
    yAxisTicks,
    stackedData,
    dataStartIndex,
    displayedData,
    offset
  } = _ref2;
  var pos = (0, _ChartUtils.findPositionOfBar)(barPosition, item);
  if (!pos) {
    return null;
  }
  var {
    layout
  } = props;
  var {
    dataKey,
    children,
    minPointSize: minPointSizeProp
  } = item.props;
  var numericAxis = layout === 'horizontal' ? yAxis : xAxis;
  var stackedDomain = stackedData ? numericAxis.scale.domain() : null;
  var baseValue = (0, _ChartUtils.getBaseValueOfBar)({
    numericAxis
  });
  var cells = (0, _ReactUtils.findAllByType)(children, _Cell.Cell);
  var rects = displayedData.map((entry, index) => {
    var value, x, y, width, height, background;
    if (stackedData) {
      value = (0, _ChartUtils.truncateByDomain)(stackedData[dataStartIndex + index], stackedDomain);
    } else {
      value = (0, _ChartUtils.getValueByDataKey)(entry, dataKey);
      if (!Array.isArray(value)) {
        value = [baseValue, value];
      }
    }
    var minPointSize = (0, _BarUtils.minPointSizeCallback)(minPointSizeProp, _Bar.defaultProps.minPointSize)(value[1], index);
    if (layout === 'horizontal') {
      var _ref3;
      var [baseValueScale, currentValueScale] = [yAxis.scale(value[0]), yAxis.scale(value[1])];
      x = (0, _ChartUtils.getCateCoordinateOfBar)({
        axis: xAxis,
        ticks: xAxisTicks,
        bandSize,
        offset: pos.offset,
        entry,
        index
      });
      y = (_ref3 = currentValueScale !== null && currentValueScale !== void 0 ? currentValueScale : baseValueScale) !== null && _ref3 !== void 0 ? _ref3 : undefined;
      width = pos.size;
      var computedHeight = baseValueScale - currentValueScale;
      height = Number.isNaN(computedHeight) ? 0 : computedHeight;
      background = {
        x,
        y: yAxis.y,
        width,
        height: yAxis.height
      };
      if (Math.abs(minPointSize) > 0 && Math.abs(height) < Math.abs(minPointSize)) {
        var delta = (0, _DataUtils.mathSign)(height || minPointSize) * (Math.abs(minPointSize) - Math.abs(height));
        y -= delta;
        height += delta;
      }
    } else {
      var [_baseValueScale, _currentValueScale] = [xAxis.scale(value[0]), xAxis.scale(value[1])];
      x = _baseValueScale;
      y = (0, _ChartUtils.getCateCoordinateOfBar)({
        axis: yAxis,
        ticks: yAxisTicks,
        bandSize,
        offset: pos.offset,
        entry,
        index
      });
      width = _currentValueScale - _baseValueScale;
      height = pos.size;
      background = {
        x: xAxis.x,
        y,
        width: xAxis.width,
        height
      };
      if (Math.abs(minPointSize) > 0 && Math.abs(width) < Math.abs(minPointSize)) {
        var _delta = (0, _DataUtils.mathSign)(width || minPointSize) * (Math.abs(minPointSize) - Math.abs(width));
        width += _delta;
      }
    }
    return _objectSpread(_objectSpread(_objectSpread({}, entry), {}, {
      x,
      y,
      width,
      height,
      value: stackedData ? value : value[1],
      payload: entry,
      background
    }, cells && cells[index] && cells[index].props), {}, {
      // @ts-expect-error missing types
      tooltipPayload: [(0, _ChartUtils.getTooltipItem)(item, entry)],
      tooltipPosition: {
        x: x + width / 2,
        y: y + height / 2
      }
    });
  });
  return _objectSpread({
    data: rects,
    layout
  }, offset);
});