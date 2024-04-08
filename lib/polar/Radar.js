"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Radar = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactSmooth = _interopRequireDefault(require("react-smooth"));
var _isNil = _interopRequireDefault(require("lodash/isNil"));
var _last = _interopRequireDefault(require("lodash/last"));
var _first = _interopRequireDefault(require("lodash/first"));
var _isEqual = _interopRequireDefault(require("lodash/isEqual"));
var _isFunction = _interopRequireDefault(require("lodash/isFunction"));
var _clsx = _interopRequireDefault(require("clsx"));
var _DataUtils = require("../util/DataUtils");
var _Global = require("../util/Global");
var _PolarUtils = require("../util/PolarUtils");
var _ChartUtils = require("../util/ChartUtils");
var _Polygon = require("../shape/Polygon");
var _Dot = require("../shape/Dot");
var _Layer = require("../container/Layer");
var _LabelList = require("../component/LabelList");
var _ReactUtils = require("../util/ReactUtils");
var _legendPayloadContext = require("../context/legendPayloadContext");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * @fileOverview Radar
 */
function getLegendItemColor(stroke, fill) {
  return stroke && stroke !== 'none' ? stroke : fill;
}
var computeLegendPayloadFromRadarSectors = props => {
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
function SetRadarPayloadLegend(props) {
  (0, _legendPayloadContext.useLegendPayloadDispatch)(computeLegendPayloadFromRadarSectors, props);
  return null;
}
class Radar extends _react.PureComponent {
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
    _defineProperty(this, "handleMouseEnter", e => {
      var {
        onMouseEnter
      } = this.props;
      if (onMouseEnter) {
        onMouseEnter(this.props, e);
      }
    });
    _defineProperty(this, "handleMouseLeave", e => {
      var {
        onMouseLeave
      } = this.props;
      if (onMouseLeave) {
        onMouseLeave(this.props, e);
      }
    });
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
  static renderDotItem(option, props) {
    var dotItem;
    if ( /*#__PURE__*/_react.default.isValidElement(option)) {
      dotItem = /*#__PURE__*/_react.default.cloneElement(option, props);
    } else if ((0, _isFunction.default)(option)) {
      dotItem = option(props);
    } else {
      dotItem = /*#__PURE__*/_react.default.createElement(_Dot.Dot, _extends({}, props, {
        className: (0, _clsx.default)('recharts-radar-dot', typeof option !== 'boolean' ? option.className : '')
      }));
    }
    return dotItem;
  }
  renderDots(points) {
    var {
      dot,
      dataKey
    } = this.props;
    var baseProps = (0, _ReactUtils.filterProps)(this.props, false);
    var customDotProps = (0, _ReactUtils.filterProps)(dot, true);
    var dots = points.map((entry, i) => {
      var dotProps = _objectSpread(_objectSpread(_objectSpread({
        key: "dot-".concat(i),
        r: 3
      }, baseProps), customDotProps), {}, {
        dataKey,
        cx: entry.x,
        cy: entry.y,
        index: i,
        payload: entry
      });
      return Radar.renderDotItem(dot, dotProps);
    });
    return /*#__PURE__*/_react.default.createElement(_Layer.Layer, {
      className: "recharts-radar-dots"
    }, dots);
  }
  renderPolygonStatically(points) {
    var {
      shape,
      dot,
      isRange,
      baseLinePoints,
      connectNulls
    } = this.props;
    var radar;
    if ( /*#__PURE__*/_react.default.isValidElement(shape)) {
      radar = /*#__PURE__*/_react.default.cloneElement(shape, _objectSpread(_objectSpread({}, this.props), {}, {
        points
      }));
    } else if ((0, _isFunction.default)(shape)) {
      radar = shape(_objectSpread(_objectSpread({}, this.props), {}, {
        points
      }));
    } else {
      radar = /*#__PURE__*/_react.default.createElement(_Polygon.Polygon, _extends({}, (0, _ReactUtils.filterProps)(this.props, true), {
        onMouseEnter: this.handleMouseEnter,
        onMouseLeave: this.handleMouseLeave,
        points: points,
        baseLinePoints: isRange ? baseLinePoints : null,
        connectNulls: connectNulls
      }));
    }
    return /*#__PURE__*/_react.default.createElement(_Layer.Layer, {
      className: "recharts-radar-polygon"
    }, radar, dot ? this.renderDots(points) : null);
  }
  renderPolygonWithAnimation() {
    var {
      points,
      isAnimationActive,
      animationBegin,
      animationDuration,
      animationEasing,
      animationId
    } = this.props;
    var {
      prevPoints
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
      key: "radar-".concat(animationId),
      onAnimationEnd: this.handleAnimationEnd,
      onAnimationStart: this.handleAnimationStart
    }, _ref => {
      var {
        t
      } = _ref;
      var prevPointsDiffFactor = prevPoints && prevPoints.length / points.length;
      var stepData = points.map((entry, index) => {
        var prev = prevPoints && prevPoints[Math.floor(index * prevPointsDiffFactor)];
        if (prev) {
          var _interpolatorX = (0, _DataUtils.interpolateNumber)(prev.x, entry.x);
          var _interpolatorY = (0, _DataUtils.interpolateNumber)(prev.y, entry.y);
          return _objectSpread(_objectSpread({}, entry), {}, {
            x: _interpolatorX(t),
            y: _interpolatorY(t)
          });
        }
        var interpolatorX = (0, _DataUtils.interpolateNumber)(entry.cx, entry.x);
        var interpolatorY = (0, _DataUtils.interpolateNumber)(entry.cy, entry.y);
        return _objectSpread(_objectSpread({}, entry), {}, {
          x: interpolatorX(t),
          y: interpolatorY(t)
        });
      });
      return this.renderPolygonStatically(stepData);
    });
  }
  renderPolygon() {
    var {
      points,
      isAnimationActive,
      isRange
    } = this.props;
    var {
      prevPoints
    } = this.state;
    if (isAnimationActive && points && points.length && !isRange && (!prevPoints || !(0, _isEqual.default)(prevPoints, points))) {
      return this.renderPolygonWithAnimation();
    }
    return this.renderPolygonStatically(points);
  }
  render() {
    var {
      hide,
      className,
      points,
      isAnimationActive
    } = this.props;
    if (hide || !points || !points.length) {
      /*
       * This used to render `null`, but it should still set the legend because:
       * 1. Hidden Radar still renders a legend item (albeit with inactive color)
       * 2. if a dataKey does not match anything from props.data, then props.points are not defined.
       * Legend still renders though! Behaviour (2) is arguably a bug - and we should be fixing it perhaps?
       * But for now I will keep it as-is.
       */
      return /*#__PURE__*/_react.default.createElement(SetRadarPayloadLegend, this.props);
    }
    var {
      isAnimationFinished
    } = this.state;
    var layerClass = (0, _clsx.default)('recharts-radar', className);
    return /*#__PURE__*/_react.default.createElement(_Layer.Layer, {
      className: layerClass
    }, /*#__PURE__*/_react.default.createElement(SetRadarPayloadLegend, this.props), this.renderPolygon(), (!isAnimationActive || isAnimationFinished) && _LabelList.LabelList.renderCallByParent(this.props, points));
  }
}
exports.Radar = Radar;
_defineProperty(Radar, "displayName", 'Radar');
_defineProperty(Radar, "defaultProps", {
  angleAxisId: 0,
  radiusAxisId: 0,
  hide: false,
  activeDot: true,
  dot: false,
  legendType: 'rect',
  isAnimationActive: !_Global.Global.isSsr,
  animationBegin: 0,
  animationDuration: 1500,
  animationEasing: 'ease'
});
_defineProperty(Radar, "getComposedData", _ref2 => {
  var {
    radiusAxis,
    angleAxis,
    displayedData,
    dataKey,
    bandSize
  } = _ref2;
  var {
    cx,
    cy
  } = angleAxis;
  var isRange = false;
  var points = [];
  var angleBandSize = angleAxis.type !== 'number' ? bandSize !== null && bandSize !== void 0 ? bandSize : 0 : 0;
  displayedData.forEach((entry, i) => {
    var name = (0, _ChartUtils.getValueByDataKey)(entry, angleAxis.dataKey, i);
    var value = (0, _ChartUtils.getValueByDataKey)(entry, dataKey);
    var angle = angleAxis.scale(name) + angleBandSize;
    var pointValue = Array.isArray(value) ? (0, _last.default)(value) : value;
    var radius = (0, _isNil.default)(pointValue) ? undefined : radiusAxis.scale(pointValue);
    if (Array.isArray(value) && value.length >= 2) {
      isRange = true;
    }
    points.push(_objectSpread(_objectSpread({}, (0, _PolarUtils.polarToCartesian)(cx, cy, radius, angle)), {}, {
      name,
      value,
      cx,
      cy,
      radius,
      angle,
      payload: entry
    }));
  });
  var baseLinePoints = [];
  if (isRange) {
    points.forEach(point => {
      if (Array.isArray(point.value)) {
        var baseValue = (0, _first.default)(point.value);
        var radius = (0, _isNil.default)(baseValue) ? undefined : radiusAxis.scale(baseValue);
        baseLinePoints.push(_objectSpread(_objectSpread({}, point), {}, {
          radius
        }, (0, _PolarUtils.polarToCartesian)(cx, cy, radius, point.angle)));
      } else {
        baseLinePoints.push(point);
      }
    });
  }
  return {
    points,
    isRange,
    baseLinePoints
  };
});