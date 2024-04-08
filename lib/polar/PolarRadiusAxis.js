"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PolarRadiusAxisWrapper = exports.PolarRadiusAxis = void 0;
var _react = _interopRequireWildcard(require("react"));
var _maxBy = _interopRequireDefault(require("lodash/maxBy"));
var _minBy = _interopRequireDefault(require("lodash/minBy"));
var _isFunction = _interopRequireDefault(require("lodash/isFunction"));
var _clsx = _interopRequireDefault(require("clsx"));
var _chartLayoutContext = require("../context/chartLayoutContext");
var _Text = require("../component/Text");
var _Label = require("../component/Label");
var _Layer = require("../container/Layer");
var _PolarUtils = require("../util/PolarUtils");
var _types = require("../util/types");
var _ReactUtils = require("../util/ReactUtils");
var _ChartUtils = require("../util/ChartUtils");
var _excluded = ["cx", "cy", "angle"],
  _excluded2 = ["angle", "tickFormatter", "stroke"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var AXIS_TYPE = 'radiusAxis';
var PolarRadiusAxisWrapper = defaultsAndInputs => {
  var _getTicksOfAxis;
  var {
    radiusAxisId
  } = defaultsAndInputs;
  var axisOptions = (0, _chartLayoutContext.useMaybePolarRadiusAxis)(radiusAxisId);
  var props = _objectSpread(_objectSpread({}, defaultsAndInputs), axisOptions);
  var {
    tick,
    axisLine
  } = props;
  var ticks = (_getTicksOfAxis = (0, _ChartUtils.getTicksOfAxis)(axisOptions, true)) !== null && _getTicksOfAxis !== void 0 ? _getTicksOfAxis : defaultsAndInputs.ticks;
  if (!ticks || !ticks.length) {
    return null;
  }

  /**
   * Calculate the coordinate of tick
   * @param coordinate The radius of tick
   * @return (x, y)
   */
  var getTickValueCoord = _ref => {
    var {
      coordinate
    } = _ref;
    var {
      angle,
      cx,
      cy
    } = props;
    return (0, _PolarUtils.polarToCartesian)(cx, cy, coordinate, angle);
  };
  var getTickTextAnchor = () => {
    var {
      orientation
    } = props;
    var textAnchor;
    switch (orientation) {
      case 'left':
        textAnchor = 'end';
        break;
      case 'right':
        textAnchor = 'start';
        break;
      default:
        textAnchor = 'middle';
        break;
    }
    return textAnchor;
  };
  var getViewBox = () => {
    var {
      cx,
      cy,
      angle
    } = props;
    var maxRadiusTick = (0, _maxBy.default)(ticks, entry => entry.coordinate || 0);
    var minRadiusTick = (0, _minBy.default)(ticks, entry => entry.coordinate || 0);
    return {
      cx,
      cy,
      startAngle: angle,
      endAngle: angle,
      innerRadius: minRadiusTick.coordinate || 0,
      outerRadius: maxRadiusTick.coordinate || 0
    };
  };
  var renderAxisLine = () => {
    var {
        cx,
        cy,
        angle
      } = props,
      others = _objectWithoutProperties(props, _excluded);
    var extent = ticks.reduce((result, entry) => [Math.min(result[0], entry.coordinate), Math.max(result[1], entry.coordinate)], [Infinity, -Infinity]);
    var point0 = (0, _PolarUtils.polarToCartesian)(cx, cy, extent[0], angle);
    var point1 = (0, _PolarUtils.polarToCartesian)(cx, cy, extent[1], angle);
    var axisLineProps = _objectSpread(_objectSpread(_objectSpread({}, (0, _ReactUtils.filterProps)(others, false)), {}, {
      fill: 'none'
    }, (0, _ReactUtils.filterProps)(axisLine, false)), {}, {
      x1: point0.x,
      y1: point0.y,
      x2: point1.x,
      y2: point1.y
    });
    return /*#__PURE__*/_react.default.createElement("line", _extends({
      className: "recharts-polar-radius-axis-line"
    }, axisLineProps));
  };
  var renderTickItem = (option, tickProps, value) => {
    var tickItem;
    if ( /*#__PURE__*/_react.default.isValidElement(option)) {
      tickItem = /*#__PURE__*/_react.default.cloneElement(option, tickProps);
    } else if ((0, _isFunction.default)(option)) {
      tickItem = option(tickProps);
    } else {
      tickItem = /*#__PURE__*/_react.default.createElement(_Text.Text, _extends({}, tickProps, {
        className: "recharts-polar-radius-axis-tick-value"
      }), value);
    }
    return tickItem;
  };
  var renderTicks = () => {
    var {
        angle,
        tickFormatter,
        stroke
      } = props,
      others = _objectWithoutProperties(props, _excluded2);
    var textAnchor = getTickTextAnchor();
    var axisProps = (0, _ReactUtils.filterProps)(others, false);
    var customTickProps = (0, _ReactUtils.filterProps)(tick, false);
    var items = ticks.map((entry, i) => {
      var coord = getTickValueCoord(entry);
      var tickProps = _objectSpread(_objectSpread(_objectSpread(_objectSpread({
        textAnchor,
        transform: "rotate(".concat(90 - angle, ", ").concat(coord.x, ", ").concat(coord.y, ")")
      }, axisProps), {}, {
        stroke: 'none',
        fill: stroke
      }, customTickProps), {}, {
        index: i
      }, coord), {}, {
        payload: entry
      });
      return /*#__PURE__*/_react.default.createElement(_Layer.Layer, _extends({
        className: (0, _clsx.default)('recharts-polar-radius-axis-tick', (0, _PolarUtils.getTickClassName)(tick)),
        key: "tick-".concat(entry.coordinate)
      }, (0, _types.adaptEventsOfChild)(props, entry, i)), renderTickItem(tick, tickProps, tickFormatter ? tickFormatter(entry.value, i, ticks) : entry.value));
    });
    return /*#__PURE__*/_react.default.createElement(_Layer.Layer, {
      className: "recharts-polar-radius-axis-ticks"
    }, items);
  };
  return /*#__PURE__*/_react.default.createElement(_Layer.Layer, {
    className: (0, _clsx.default)('recharts-polar-radius-axis', AXIS_TYPE, props.className)
  }, axisLine && renderAxisLine(), tick && renderTicks(), _Label.Label.renderCallByParent(props, getViewBox()));
};
exports.PolarRadiusAxisWrapper = PolarRadiusAxisWrapper;
class PolarRadiusAxis extends _react.PureComponent {
  render() {
    return /*#__PURE__*/_react.default.createElement(PolarRadiusAxisWrapper, this.props);
  }
}
exports.PolarRadiusAxis = PolarRadiusAxis;
_defineProperty(PolarRadiusAxis, "displayName", 'PolarRadiusAxis');
_defineProperty(PolarRadiusAxis, "axisType", AXIS_TYPE);
_defineProperty(PolarRadiusAxis, "defaultProps", {
  type: 'number',
  radiusAxisId: 0,
  cx: 0,
  cy: 0,
  angle: 0,
  orientation: 'right',
  stroke: '#ccc',
  axisLine: true,
  tick: true,
  tickCount: 5,
  allowDataOverflow: false,
  scale: 'auto',
  allowDuplicatedCategory: true
});