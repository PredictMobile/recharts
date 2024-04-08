"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Funnel = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactSmooth = _interopRequireDefault(require("react-smooth"));
var _isFunction = _interopRequireDefault(require("lodash/isFunction"));
var _isNumber = _interopRequireDefault(require("lodash/isNumber"));
var _isString = _interopRequireDefault(require("lodash/isString"));
var _omit = _interopRequireDefault(require("lodash/omit"));
var _isEqual = _interopRequireDefault(require("lodash/isEqual"));
var _clsx = _interopRequireDefault(require("clsx"));
var _Layer = require("../container/Layer");
var _LabelList = require("../component/LabelList");
var _Cell = require("../component/Cell");
var _ReactUtils = require("../util/ReactUtils");
var _Global = require("../util/Global");
var _DataUtils = require("../util/DataUtils");
var _ChartUtils = require("../util/ChartUtils");
var _types = require("../util/types");
var _FunnelUtils = require("../util/FunnelUtils");
var _Funnel;
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * @fileOverview Render sectors of a funnel
 */
class Funnel extends _react.PureComponent {
  constructor() {
    super(...arguments);
    _defineProperty(this, "state", {
      isAnimationFinished: false
    });
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
        curTrapezoids: nextProps.trapezoids,
        prevTrapezoids: prevState.curTrapezoids
      };
    }
    if (nextProps.trapezoids !== prevState.curTrapezoids) {
      return {
        curTrapezoids: nextProps.trapezoids
      };
    }
    return null;
  }
  isActiveIndex(i) {
    var {
      activeIndex
    } = this.props;
    if (Array.isArray(activeIndex)) {
      return activeIndex.indexOf(i) !== -1;
    }
    return i === activeIndex;
  }
  renderTrapezoidsStatically(trapezoids) {
    var {
      shape,
      activeShape
    } = this.props;
    return trapezoids.map((entry, i) => {
      var trapezoidOptions = this.isActiveIndex(i) ? activeShape : shape;
      var trapezoidProps = _objectSpread(_objectSpread({}, entry), {}, {
        isActive: this.isActiveIndex(i),
        stroke: entry.stroke
      });
      return /*#__PURE__*/_react.default.createElement(_Layer.Layer, _extends({
        className: "recharts-funnel-trapezoid"
      }, (0, _types.adaptEventsOfChild)(this.props, entry, i), {
        key: "trapezoid-".concat(entry === null || entry === void 0 ? void 0 : entry.x, "-").concat(entry === null || entry === void 0 ? void 0 : entry.y, "-").concat(entry === null || entry === void 0 ? void 0 : entry.name, "-").concat(entry === null || entry === void 0 ? void 0 : entry.value),
        role: "img"
      }), /*#__PURE__*/_react.default.createElement(_FunnelUtils.FunnelTrapezoid, _extends({
        option: trapezoidOptions
      }, trapezoidProps)));
    });
  }
  renderTrapezoidsWithAnimation() {
    var {
      trapezoids,
      isAnimationActive,
      animationBegin,
      animationDuration,
      animationEasing,
      animationId
    } = this.props;
    var {
      prevTrapezoids
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
      key: "funnel-".concat(animationId),
      onAnimationStart: this.handleAnimationStart,
      onAnimationEnd: this.handleAnimationEnd
    }, _ref => {
      var {
        t
      } = _ref;
      var stepData = trapezoids.map((entry, index) => {
        var prev = prevTrapezoids && prevTrapezoids[index];
        if (prev) {
          var _interpolatorX = (0, _DataUtils.interpolateNumber)(prev.x, entry.x);
          var _interpolatorY = (0, _DataUtils.interpolateNumber)(prev.y, entry.y);
          var _interpolatorUpperWidth = (0, _DataUtils.interpolateNumber)(prev.upperWidth, entry.upperWidth);
          var _interpolatorLowerWidth = (0, _DataUtils.interpolateNumber)(prev.lowerWidth, entry.lowerWidth);
          var _interpolatorHeight = (0, _DataUtils.interpolateNumber)(prev.height, entry.height);
          return _objectSpread(_objectSpread({}, entry), {}, {
            x: _interpolatorX(t),
            y: _interpolatorY(t),
            upperWidth: _interpolatorUpperWidth(t),
            lowerWidth: _interpolatorLowerWidth(t),
            height: _interpolatorHeight(t)
          });
        }
        var interpolatorX = (0, _DataUtils.interpolateNumber)(entry.x + entry.upperWidth / 2, entry.x);
        var interpolatorY = (0, _DataUtils.interpolateNumber)(entry.y + entry.height / 2, entry.y);
        var interpolatorUpperWidth = (0, _DataUtils.interpolateNumber)(0, entry.upperWidth);
        var interpolatorLowerWidth = (0, _DataUtils.interpolateNumber)(0, entry.lowerWidth);
        var interpolatorHeight = (0, _DataUtils.interpolateNumber)(0, entry.height);
        return _objectSpread(_objectSpread({}, entry), {}, {
          x: interpolatorX(t),
          y: interpolatorY(t),
          upperWidth: interpolatorUpperWidth(t),
          lowerWidth: interpolatorLowerWidth(t),
          height: interpolatorHeight(t)
        });
      });
      return /*#__PURE__*/_react.default.createElement(_Layer.Layer, null, this.renderTrapezoidsStatically(stepData));
    });
  }
  renderTrapezoids() {
    var {
      trapezoids,
      isAnimationActive
    } = this.props;
    var {
      prevTrapezoids
    } = this.state;
    if (isAnimationActive && trapezoids && trapezoids.length && (!prevTrapezoids || !(0, _isEqual.default)(prevTrapezoids, trapezoids))) {
      return this.renderTrapezoidsWithAnimation();
    }
    return this.renderTrapezoidsStatically(trapezoids);
  }
  render() {
    var {
      hide,
      trapezoids,
      className,
      isAnimationActive
    } = this.props;
    var {
      isAnimationFinished
    } = this.state;
    if (hide || !trapezoids || !trapezoids.length) {
      return null;
    }
    var layerClass = (0, _clsx.default)('recharts-trapezoids', className);
    return /*#__PURE__*/_react.default.createElement(_Layer.Layer, {
      className: layerClass
    }, this.renderTrapezoids(), (!isAnimationActive || isAnimationFinished) && _LabelList.LabelList.renderCallByParent(this.props, trapezoids));
  }
}
exports.Funnel = Funnel;
_Funnel = Funnel;
_defineProperty(Funnel, "displayName", 'Funnel');
_defineProperty(Funnel, "defaultProps", {
  stroke: '#fff',
  fill: '#808080',
  legendType: 'rect',
  labelLine: true,
  hide: false,
  isAnimationActive: !_Global.Global.isSsr,
  animationBegin: 400,
  animationDuration: 1500,
  animationEasing: 'ease',
  nameKey: 'name',
  lastShapeType: 'triangle'
});
_defineProperty(Funnel, "getRealFunnelData", item => {
  var {
    data,
    children
  } = item.props;
  var presentationProps = (0, _ReactUtils.filterProps)(item.props, false);
  var cells = (0, _ReactUtils.findAllByType)(children, _Cell.Cell);
  if (data && data.length) {
    return data.map((entry, index) => _objectSpread(_objectSpread(_objectSpread({
      payload: entry
    }, presentationProps), entry), cells && cells[index] && cells[index].props));
  }
  if (cells && cells.length) {
    return cells.map(cell => _objectSpread(_objectSpread({}, presentationProps), cell.props));
  }
  return [];
});
_defineProperty(Funnel, "getRealWidthHeight", (item, offset) => {
  var customWidth = item.props.width;
  var {
    width,
    height,
    left,
    right,
    top,
    bottom
  } = offset;
  var realHeight = height;
  var realWidth = width;
  if ((0, _isNumber.default)(customWidth)) {
    realWidth = customWidth;
  } else if ((0, _isString.default)(customWidth)) {
    realWidth = realWidth * parseFloat(customWidth) / 100;
  }
  return {
    realWidth: realWidth - left - right - 50,
    realHeight: realHeight - bottom - top,
    offsetX: (width - realWidth) / 2,
    offsetY: (height - realHeight) / 2
  };
});
_defineProperty(Funnel, "getComposedData", _ref2 => {
  var {
    item,
    offset
  } = _ref2;
  var funnelData = _Funnel.getRealFunnelData(item);
  var {
    dataKey,
    nameKey,
    tooltipType,
    lastShapeType,
    reversed
  } = item.props;
  var {
    left,
    top
  } = offset;
  var {
    realHeight,
    realWidth,
    offsetX,
    offsetY
  } = _Funnel.getRealWidthHeight(item, offset);
  var maxValue = Math.max.apply(null, funnelData.map(entry => (0, _ChartUtils.getValueByDataKey)(entry, dataKey, 0)));
  var len = funnelData.length;
  var rowHeight = realHeight / len;
  var parentViewBox = {
    x: offset.left,
    y: offset.top,
    width: offset.width,
    height: offset.height
  };
  var trapezoids = funnelData.map((entry, i) => {
    var rawVal = (0, _ChartUtils.getValueByDataKey)(entry, dataKey, 0);
    var name = (0, _ChartUtils.getValueByDataKey)(entry, nameKey, i);
    var val = rawVal;
    var nextVal;
    if (i !== len - 1) {
      nextVal = (0, _ChartUtils.getValueByDataKey)(funnelData[i + 1], dataKey, 0);
      if (nextVal instanceof Array) {
        [nextVal] = nextVal;
      }
    } else if (rawVal instanceof Array && rawVal.length === 2) {
      [val, nextVal] = rawVal;
    } else if (lastShapeType === 'rectangle') {
      nextVal = val;
    } else {
      nextVal = 0;
    }
    var x = (maxValue - val) * realWidth / (2 * maxValue) + top + 25 + offsetX;
    var y = rowHeight * i + left + offsetY;
    var upperWidth = val / maxValue * realWidth;
    var lowerWidth = nextVal / maxValue * realWidth;
    var tooltipPayload = [{
      name,
      value: val,
      payload: entry,
      dataKey,
      type: tooltipType
    }];
    var tooltipPosition = {
      x: x + upperWidth / 2,
      y: y + rowHeight / 2
    };
    return _objectSpread(_objectSpread({
      x,
      y,
      width: Math.max(upperWidth, lowerWidth),
      upperWidth,
      lowerWidth,
      height: rowHeight,
      name,
      val,
      tooltipPayload,
      tooltipPosition
    }, (0, _omit.default)(entry, 'width')), {}, {
      payload: entry,
      // @ts-expect-error parentViewBox property does not exist on type FunnelTrapezoidItem
      parentViewBox,
      labelViewBox: {
        x: x + (upperWidth - lowerWidth) / 4,
        y,
        width: Math.abs(upperWidth - lowerWidth) / 2 + Math.min(upperWidth, lowerWidth),
        height: rowHeight
      }
    });
  });
  if (reversed) {
    trapezoids = trapezoids.map((entry, index) => {
      var newY = entry.y - index * rowHeight + (len - 1 - index) * rowHeight;
      return _objectSpread(_objectSpread({}, entry), {}, {
        upperWidth: entry.lowerWidth,
        lowerWidth: entry.upperWidth,
        x: entry.x - (entry.lowerWidth - entry.upperWidth) / 2,
        y: entry.y - index * rowHeight + (len - 1 - index) * rowHeight,
        tooltipPosition: _objectSpread(_objectSpread({}, entry.tooltipPosition), {}, {
          y: newY + rowHeight / 2
        }),
        labelViewBox: _objectSpread(_objectSpread({}, entry.labelViewBox), {}, {
          y: newY
        })
      });
    });
  }
  return {
    trapezoids,
    data: funnelData
  };
});