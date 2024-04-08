"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CartesianAxis = void 0;
var _react = _interopRequireWildcard(require("react"));
var _isFunction = _interopRequireDefault(require("lodash/isFunction"));
var _get = _interopRequireDefault(require("lodash/get"));
var _clsx = _interopRequireDefault(require("clsx"));
var _ShallowEqual = require("../util/ShallowEqual");
var _Layer = require("../container/Layer");
var _Text = require("../component/Text");
var _Label = require("../component/Label");
var _DataUtils = require("../util/DataUtils");
var _types = require("../util/types");
var _ReactUtils = require("../util/ReactUtils");
var _getTicks = require("./getTicks");
var _excluded = ["viewBox"],
  _excluded2 = ["viewBox"],
  _excluded3 = ["ticks"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * @fileOverview Cartesian Axis
 */
/** The orientation of the axis in correspondence to the chart */

/** A unit to be appended to a value */

/** The formatter function of tick */

class CartesianAxis extends _react.Component {
  constructor(props) {
    super(props);
    this.state = {
      fontSize: '',
      letterSpacing: ''
    };
  }
  shouldComponentUpdate(_ref, nextState) {
    var {
        viewBox
      } = _ref,
      restProps = _objectWithoutProperties(_ref, _excluded);
    // props.viewBox is sometimes generated every time -
    // check that specially as object equality is likely to fail
    var _this$props = this.props,
      {
        viewBox: viewBoxOld
      } = _this$props,
      restPropsOld = _objectWithoutProperties(_this$props, _excluded2);
    return !(0, _ShallowEqual.shallowEqual)(viewBox, viewBoxOld) || !(0, _ShallowEqual.shallowEqual)(restProps, restPropsOld) || !(0, _ShallowEqual.shallowEqual)(nextState, this.state);
  }
  componentDidMount() {
    var htmlLayer = this.layerReference;
    if (!htmlLayer) return;
    var tick = htmlLayer.getElementsByClassName('recharts-cartesian-axis-tick-value')[0];
    if (tick) {
      this.setState({
        fontSize: window.getComputedStyle(tick).fontSize,
        letterSpacing: window.getComputedStyle(tick).letterSpacing
      });
    }
  }

  /**
   * Calculate the coordinates of endpoints in ticks
   * @param  {Object} data The data of a simple tick
   * @return {Object} (x1, y1): The coordinate of endpoint close to tick text
   *  (x2, y2): The coordinate of endpoint close to axis
   */
  getTickLineCoord(data) {
    var {
      x,
      y,
      width,
      height,
      orientation,
      tickSize,
      mirror,
      tickMargin
    } = this.props;
    var x1, x2, y1, y2, tx, ty;
    var sign = mirror ? -1 : 1;
    var finalTickSize = data.tickSize || tickSize;
    var tickCoord = (0, _DataUtils.isNumber)(data.tickCoord) ? data.tickCoord : data.coordinate;
    switch (orientation) {
      case 'top':
        x1 = x2 = data.coordinate;
        y2 = y + +!mirror * height;
        y1 = y2 - sign * finalTickSize;
        ty = y1 - sign * tickMargin;
        tx = tickCoord;
        break;
      case 'left':
        y1 = y2 = data.coordinate;
        x2 = x + +!mirror * width;
        x1 = x2 - sign * finalTickSize;
        tx = x1 - sign * tickMargin;
        ty = tickCoord;
        break;
      case 'right':
        y1 = y2 = data.coordinate;
        x2 = x + +mirror * width;
        x1 = x2 + sign * finalTickSize;
        tx = x1 + sign * tickMargin;
        ty = tickCoord;
        break;
      default:
        x1 = x2 = data.coordinate;
        y2 = y + +mirror * height;
        y1 = y2 + sign * finalTickSize;
        ty = y1 + sign * tickMargin;
        tx = tickCoord;
        break;
    }
    return {
      line: {
        x1,
        y1,
        x2,
        y2
      },
      tick: {
        x: tx,
        y: ty
      }
    };
  }
  getTickTextAnchor() {
    var {
      orientation,
      mirror
    } = this.props;
    var textAnchor;
    switch (orientation) {
      case 'left':
        textAnchor = mirror ? 'start' : 'end';
        break;
      case 'right':
        textAnchor = mirror ? 'end' : 'start';
        break;
      default:
        textAnchor = 'middle';
        break;
    }
    return textAnchor;
  }
  getTickVerticalAnchor() {
    var {
      orientation,
      mirror
    } = this.props;
    var verticalAnchor = 'end';
    switch (orientation) {
      case 'left':
      case 'right':
        verticalAnchor = 'middle';
        break;
      case 'top':
        verticalAnchor = mirror ? 'start' : 'end';
        break;
      default:
        verticalAnchor = mirror ? 'end' : 'start';
        break;
    }
    return verticalAnchor;
  }
  renderAxisLine() {
    var {
      x,
      y,
      width,
      height,
      orientation,
      mirror,
      axisLine
    } = this.props;
    var props = _objectSpread(_objectSpread(_objectSpread({}, (0, _ReactUtils.filterProps)(this.props, false)), (0, _ReactUtils.filterProps)(axisLine, false)), {}, {
      fill: 'none'
    });
    if (orientation === 'top' || orientation === 'bottom') {
      var needHeight = +(orientation === 'top' && !mirror || orientation === 'bottom' && mirror);
      props = _objectSpread(_objectSpread({}, props), {}, {
        x1: x,
        y1: y + needHeight * height,
        x2: x + width,
        y2: y + needHeight * height
      });
    } else {
      var needWidth = +(orientation === 'left' && !mirror || orientation === 'right' && mirror);
      props = _objectSpread(_objectSpread({}, props), {}, {
        x1: x + needWidth * width,
        y1: y,
        x2: x + needWidth * width,
        y2: y + height
      });
    }
    return /*#__PURE__*/_react.default.createElement("line", _extends({}, props, {
      className: (0, _clsx.default)('recharts-cartesian-axis-line', (0, _get.default)(axisLine, 'className'))
    }));
  }
  static renderTickItem(option, props, value) {
    var tickItem;
    if ( /*#__PURE__*/_react.default.isValidElement(option)) {
      tickItem = /*#__PURE__*/_react.default.cloneElement(option, props);
    } else if ((0, _isFunction.default)(option)) {
      tickItem = option(props);
    } else {
      tickItem = /*#__PURE__*/_react.default.createElement(_Text.Text, _extends({}, props, {
        className: "recharts-cartesian-axis-tick-value"
      }), value);
    }
    return tickItem;
  }

  /**
   * render the ticks
   * @param {Array} ticks The ticks to actually render (overrides what was passed in props)
   * @param {string} fontSize Fontsize to consider for tick spacing
   * @param {string} letterSpacing Letterspacing to consider for tick spacing
   * @return {ReactComponent} renderedTicks
   */
  renderTicks(ticks, fontSize, letterSpacing) {
    var {
      tickLine,
      stroke,
      tick,
      tickFormatter,
      unit
    } = this.props;
    var finalTicks = (0, _getTicks.getTicks)(_objectSpread(_objectSpread({}, this.props), {}, {
      ticks
    }), fontSize, letterSpacing);
    var textAnchor = this.getTickTextAnchor();
    var verticalAnchor = this.getTickVerticalAnchor();
    var axisProps = (0, _ReactUtils.filterProps)(this.props, false);
    var customTickProps = (0, _ReactUtils.filterProps)(tick, false);
    var tickLineProps = _objectSpread(_objectSpread({}, axisProps), {}, {
      fill: 'none'
    }, (0, _ReactUtils.filterProps)(tickLine, false));
    var items = finalTicks.map((entry, i) => {
      var {
        line: lineCoord,
        tick: tickCoord
      } = this.getTickLineCoord(entry);
      var tickProps = _objectSpread(_objectSpread(_objectSpread(_objectSpread({
        textAnchor,
        verticalAnchor
      }, axisProps), {}, {
        stroke: 'none',
        fill: stroke
      }, customTickProps), tickCoord), {}, {
        index: i,
        payload: entry,
        visibleTicksCount: finalTicks.length,
        tickFormatter
      });
      return /*#__PURE__*/_react.default.createElement(_Layer.Layer, _extends({
        className: "recharts-cartesian-axis-tick",
        key: "tick-".concat(entry.value, "-").concat(entry.coordinate, "-").concat(entry.tickCoord)
      }, (0, _types.adaptEventsOfChild)(this.props, entry, i)), tickLine && /*#__PURE__*/_react.default.createElement("line", _extends({}, tickLineProps, lineCoord, {
        className: (0, _clsx.default)('recharts-cartesian-axis-tick-line', (0, _get.default)(tickLine, 'className'))
      })), tick && CartesianAxis.renderTickItem(tick, tickProps, "".concat((0, _isFunction.default)(tickFormatter) ? tickFormatter(entry.value, i, finalTicks) : entry.value).concat(unit || '')));
    });
    return /*#__PURE__*/_react.default.createElement("g", {
      className: "recharts-cartesian-axis-ticks"
    }, items);
  }
  render() {
    var {
      axisLine,
      width,
      height,
      ticksGenerator,
      className,
      hide
    } = this.props;
    if (hide) {
      return null;
    }
    var _this$props2 = this.props,
      {
        ticks
      } = _this$props2,
      noTicksProps = _objectWithoutProperties(_this$props2, _excluded3);
    var finalTicks = ticks;
    if ((0, _isFunction.default)(ticksGenerator)) {
      finalTicks = ticks && ticks.length > 0 ? ticksGenerator(this.props) : ticksGenerator(noTicksProps);
    }
    if (width <= 0 || height <= 0 || !finalTicks || !finalTicks.length) {
      return null;
    }
    return /*#__PURE__*/_react.default.createElement(_Layer.Layer, {
      className: (0, _clsx.default)('recharts-cartesian-axis', className),
      ref: _ref2 => {
        this.layerReference = _ref2;
      }
    }, axisLine && this.renderAxisLine(), this.renderTicks(finalTicks, this.state.fontSize, this.state.letterSpacing), _Label.Label.renderCallByParent(this.props));
  }
}
exports.CartesianAxis = CartesianAxis;
_defineProperty(CartesianAxis, "displayName", 'CartesianAxis');
_defineProperty(CartesianAxis, "defaultProps", {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  viewBox: {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  },
  // The orientation of axis
  orientation: 'bottom',
  // The ticks
  ticks: [],
  stroke: '#666',
  tickLine: true,
  axisLine: true,
  tick: true,
  mirror: false,
  minTickGap: 5,
  // The width or height of tick
  tickSize: 6,
  tickMargin: 2,
  interval: 'preserveEnd'
});