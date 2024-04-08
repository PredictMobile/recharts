"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PolarAngleAxisWrapper = exports.PolarAngleAxis = void 0;
var _react = _interopRequireWildcard(require("react"));
var _isFunction = _interopRequireDefault(require("lodash/isFunction"));
var _clsx = _interopRequireDefault(require("clsx"));
var _Layer = require("../container/Layer");
var _Dot = require("../shape/Dot");
var _Polygon = require("../shape/Polygon");
var _Text = require("../component/Text");
var _types = require("../util/types");
var _ReactUtils = require("../util/ReactUtils");
var _PolarUtils = require("../util/PolarUtils");
var _ChartUtils = require("../util/ChartUtils");
var _chartLayoutContext = require("../context/chartLayoutContext");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var RADIAN = Math.PI / 180;
var eps = 1e-5;
var AXIS_TYPE = 'angleAxis';
var PolarAngleAxisWrapper = defaultsAndInputs => {
  var _getTicksOfAxis;
  var {
    angleAxisId
  } = defaultsAndInputs;
  var axisOptions = (0, _chartLayoutContext.useMaybePolarAngleAxis)(angleAxisId);
  var props = _objectSpread(_objectSpread({}, defaultsAndInputs), axisOptions);
  var {
    axisLine
  } = props;
  var ticks = (_getTicksOfAxis = (0, _ChartUtils.getTicksOfAxis)(axisOptions, true)) !== null && _getTicksOfAxis !== void 0 ? _getTicksOfAxis : defaultsAndInputs.ticks;
  if (!ticks || !ticks.length) {
    return null;
  }

  /**
   * Calculate the coordinate of line endpoint
   * @param data The data if there are ticks
   * @return (x1, y1): The point close to text,
   *         (x2, y2): The point close to axis
   */
  var getTickLineCoord = data => {
    var {
      cx,
      cy,
      radius,
      orientation,
      tickSize
    } = props;
    var tickLineSize = tickSize || 8;
    var p1 = (0, _PolarUtils.polarToCartesian)(cx, cy, radius, data.coordinate);
    var p2 = (0, _PolarUtils.polarToCartesian)(cx, cy, radius + (orientation === 'inner' ? -1 : 1) * tickLineSize, data.coordinate);
    return {
      x1: p1.x,
      y1: p1.y,
      x2: p2.x,
      y2: p2.y
    };
  };

  /**
   * Get the text-anchor of each tick
   * @param data Data of ticks
   * @return text-anchor
   */
  var getTickTextAnchor = data => {
    var {
      orientation
    } = props;
    var cos = Math.cos(-data.coordinate * RADIAN);
    var textAnchor;
    if (cos > eps) {
      textAnchor = orientation === 'outer' ? 'start' : 'end';
    } else if (cos < -eps) {
      textAnchor = orientation === 'outer' ? 'end' : 'start';
    } else {
      textAnchor = 'middle';
    }
    return textAnchor;
  };
  var renderAxisLine = () => {
    var {
      cx,
      cy,
      radius,
      axisLineType
    } = props;
    var axisLineProps = _objectSpread(_objectSpread({}, (0, _ReactUtils.filterProps)(props, false)), {}, {
      fill: 'none'
    }, (0, _ReactUtils.filterProps)(axisLine, false));
    if (axisLineType === 'circle') {
      return /*#__PURE__*/_react.default.createElement(_Dot.Dot, _extends({
        className: "recharts-polar-angle-axis-line"
      }, axisLineProps, {
        cx: cx,
        cy: cy,
        r: radius
      }));
    }
    var points = ticks.map(entry => (0, _PolarUtils.polarToCartesian)(cx, cy, radius, entry.coordinate));
    return /*#__PURE__*/_react.default.createElement(_Polygon.Polygon, _extends({
      className: "recharts-polar-angle-axis-line"
    }, axisLineProps, {
      points: points
    }));
  };
  var renderTickItem = (option, tickProps, value) => {
    var tickItem;
    if ( /*#__PURE__*/_react.default.isValidElement(option)) {
      tickItem = /*#__PURE__*/_react.default.cloneElement(option, tickProps);
    } else if ((0, _isFunction.default)(option)) {
      tickItem = option(props);
    } else {
      tickItem = /*#__PURE__*/_react.default.createElement(_Text.Text, _extends({}, tickProps, {
        className: "recharts-polar-angle-axis-tick-value"
      }), value);
    }
    return tickItem;
  };
  var renderTicks = () => {
    var {
      tick,
      tickLine,
      tickFormatter,
      stroke
    } = props;
    var axisProps = (0, _ReactUtils.filterProps)(props, false);
    var customTickProps = (0, _ReactUtils.filterProps)(tick, false);
    var tickLineProps = _objectSpread(_objectSpread({}, axisProps), {}, {
      fill: 'none'
    }, (0, _ReactUtils.filterProps)(tickLine, false));
    var items = ticks.map((entry, i) => {
      var lineCoord = getTickLineCoord(entry);
      var textAnchor = getTickTextAnchor(entry);
      var tickProps = _objectSpread(_objectSpread(_objectSpread({
        textAnchor
      }, axisProps), {}, {
        stroke: 'none',
        fill: stroke
      }, customTickProps), {}, {
        index: i,
        payload: entry,
        x: lineCoord.x2,
        y: lineCoord.y2
      });
      return /*#__PURE__*/_react.default.createElement(_Layer.Layer, _extends({
        className: (0, _clsx.default)('recharts-polar-angle-axis-tick', (0, _PolarUtils.getTickClassName)(tick)),
        key: "tick-".concat(entry.coordinate)
      }, (0, _types.adaptEventsOfChild)(props, entry, i)), tickLine && /*#__PURE__*/_react.default.createElement("line", _extends({
        className: "recharts-polar-angle-axis-tick-line"
      }, tickLineProps, lineCoord)), tick && renderTickItem(tick, tickProps, tickFormatter ? tickFormatter(entry.value, i, ticks) : entry.value));
    });
    return /*#__PURE__*/_react.default.createElement(_Layer.Layer, {
      className: "recharts-polar-angle-axis-ticks"
    }, items);
  };
  return /*#__PURE__*/_react.default.createElement(_Layer.Layer, {
    className: (0, _clsx.default)('recharts-polar-angle-axis', AXIS_TYPE, props.className)
  }, axisLine && renderAxisLine(), renderTicks());
};
exports.PolarAngleAxisWrapper = PolarAngleAxisWrapper;
class PolarAngleAxis extends _react.PureComponent {
  render() {
    if (this.props.radius <= 0) return null;
    return /*#__PURE__*/_react.default.createElement(PolarAngleAxisWrapper, this.props);
  }
}
exports.PolarAngleAxis = PolarAngleAxis;
_defineProperty(PolarAngleAxis, "displayName", 'PolarAngleAxis');
_defineProperty(PolarAngleAxis, "axisType", AXIS_TYPE);
_defineProperty(PolarAngleAxis, "defaultProps", {
  type: 'category',
  angleAxisId: 0,
  scale: 'auto',
  cx: 0,
  cy: 0,
  orientation: 'outer',
  axisLine: true,
  tickLine: true,
  tickSize: 8,
  tick: true,
  hide: false,
  allowDuplicatedCategory: true
});