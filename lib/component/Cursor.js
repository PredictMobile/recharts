"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Cursor = Cursor;
var _react = require("react");
var _clsx = _interopRequireDefault(require("clsx"));
var _Curve = require("../shape/Curve");
var _Cross = require("../shape/Cross");
var _getCursorRectangle = require("../util/cursor/getCursorRectangle");
var _Rectangle = require("../shape/Rectangle");
var _getRadialCursorPoints = require("../util/cursor/getRadialCursorPoints");
var _Sector = require("../shape/Sector");
var _getCursorPoints = require("../util/cursor/getCursorPoints");
var _ReactUtils = require("../util/ReactUtils");
var _tooltipContext = require("../context/tooltipContext");
var _chartLayoutContext = require("../context/chartLayoutContext");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/*
 * Cursor is the background, or a highlight,
 * that shows when user mouses over or activates
 * an area.
 *
 * It usually shows together with a tooltip
 * to emphasise which part of the chart does the tooltip refer to.
 */
function Cursor(props) {
  var _element$props$active;
  var {
    element,
    tooltipEventType,
    tooltipAxisBandSize,
    layout,
    chartName
  } = props;
  var {
    active,
    coordinate,
    payload,
    index
  } = (0, _tooltipContext.useTooltipContext)();
  var offset = (0, _chartLayoutContext.useOffset)();
  // The cursor is a part of the Tooltip, and it should be shown (by default) when the Tooltip is active.
  var isActive = (_element$props$active = element.props.active) !== null && _element$props$active !== void 0 ? _element$props$active : active;
  var activeCoordinate = coordinate;
  var activePayload = payload;
  var activeTooltipIndex = index;
  if (!element || !element.props.cursor || !isActive || !activeCoordinate || chartName !== 'ScatterChart' && tooltipEventType !== 'axis') {
    return null;
  }
  var restProps;
  var cursorComp = _Curve.Curve;
  if (chartName === 'ScatterChart') {
    restProps = activeCoordinate;
    cursorComp = _Cross.Cross;
  } else if (chartName === 'BarChart') {
    restProps = (0, _getCursorRectangle.getCursorRectangle)(layout, activeCoordinate, offset, tooltipAxisBandSize);
    cursorComp = _Rectangle.Rectangle;
  } else if (layout === 'radial') {
    var {
      cx,
      cy,
      radius,
      startAngle,
      endAngle
    } = (0, _getRadialCursorPoints.getRadialCursorPoints)(activeCoordinate);
    restProps = {
      cx,
      cy,
      startAngle,
      endAngle,
      innerRadius: radius,
      outerRadius: radius
    };
    cursorComp = _Sector.Sector;
  } else {
    restProps = {
      points: (0, _getCursorPoints.getCursorPoints)(layout, activeCoordinate, offset)
    };
    cursorComp = _Curve.Curve;
  }
  var cursorProps = _objectSpread(_objectSpread(_objectSpread(_objectSpread({
    stroke: '#ccc',
    pointerEvents: 'none'
  }, offset), restProps), (0, _ReactUtils.filterProps)(element.props.cursor, false)), {}, {
    payload: activePayload,
    payloadIndex: activeTooltipIndex,
    className: (0, _clsx.default)('recharts-tooltip-cursor', element.props.cursor.className)
  });
  return /*#__PURE__*/(0, _react.isValidElement)(element.props.cursor) ? /*#__PURE__*/(0, _react.cloneElement)(element.props.cursor, cursorProps) : /*#__PURE__*/(0, _react.createElement)(cursorComp, cursorProps);
}