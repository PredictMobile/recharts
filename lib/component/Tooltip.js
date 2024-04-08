"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Tooltip = void 0;
var _react = _interopRequireWildcard(require("react"));
var _DefaultTooltipContent = require("./DefaultTooltipContent");
var _TooltipBoundingBox = require("./TooltipBoundingBox");
var _Global = require("../util/Global");
var _getUniqPayload = require("../util/payload/getUniqPayload");
var _chartLayoutContext = require("../context/chartLayoutContext");
var _tooltipContext = require("../context/tooltipContext");
var _accessibilityContext = require("../context/accessibilityContext");
var _useGetBoundingClientRect = require("../util/useGetBoundingClientRect");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function defaultUniqBy(entry) {
  return entry.dataKey;
}
function renderContent(content, props) {
  if ( /*#__PURE__*/_react.default.isValidElement(content)) {
    return /*#__PURE__*/_react.default.cloneElement(content, props);
  }
  if (typeof content === 'function') {
    return /*#__PURE__*/_react.default.createElement(content, props);
  }
  return /*#__PURE__*/_react.default.createElement(_DefaultTooltipContent.DefaultTooltipContent, props);
}
function TooltipInternal(props) {
  var {
    active: activeFromProps,
    allowEscapeViewBox,
    animationDuration,
    animationEasing,
    content,
    filterNull,
    isAnimationActive,
    offset,
    payloadUniqBy,
    position,
    reverseDirection,
    useTranslate3d,
    wrapperStyle
  } = props;
  var viewBox = (0, _chartLayoutContext.useViewBox)();
  var accessibilityLayer = (0, _accessibilityContext.useAccessibilityLayer)();
  var {
    active: activeFromContext,
    payload,
    coordinate,
    label
  } = (0, _tooltipContext.useTooltipContext)();
  /*
   * The user can set `active=true` on the Tooltip in which case the Tooltip will stay always active,
   * or `active=false` in which case the Tooltip never shows.
   *
   * If the `active` prop is not defined then it will show and hide based on mouse or keyboard activity.
   */
  var finalIsActive = activeFromProps !== null && activeFromProps !== void 0 ? activeFromProps : activeFromContext;
  var [lastBoundingBox, updateBoundingBox] = (0, _useGetBoundingClientRect.useGetBoundingClientRect)(undefined, [payload, finalIsActive]);
  var finalPayload = payload !== null && payload !== void 0 ? payload : [];
  if (!finalIsActive) {
    finalPayload = [];
  }
  if (filterNull && finalPayload.length) {
    finalPayload = (0, _getUniqPayload.getUniqPayload)(payload.filter(entry => entry.value != null && (entry.hide !== true || props.includeHidden)), payloadUniqBy, defaultUniqBy);
  }
  var hasPayload = finalPayload.length > 0;
  return /*#__PURE__*/_react.default.createElement(_TooltipBoundingBox.TooltipBoundingBox, {
    allowEscapeViewBox: allowEscapeViewBox,
    animationDuration: animationDuration,
    animationEasing: animationEasing,
    isAnimationActive: isAnimationActive,
    active: finalIsActive,
    coordinate: coordinate,
    hasPayload: hasPayload,
    offset: offset,
    position: position,
    reverseDirection: reverseDirection,
    useTranslate3d: useTranslate3d,
    viewBox: viewBox,
    wrapperStyle: wrapperStyle,
    lastBoundingBox: lastBoundingBox,
    innerRef: updateBoundingBox
  }, renderContent(content, _objectSpread(_objectSpread({}, props), {}, {
    payload: finalPayload,
    label,
    active: finalIsActive,
    coordinate,
    accessibilityLayer
  })));
}
class Tooltip extends _react.PureComponent {
  render() {
    return /*#__PURE__*/_react.default.createElement(TooltipInternal, this.props);
  }
}
exports.Tooltip = Tooltip;
_defineProperty(Tooltip, "displayName", 'Tooltip');
_defineProperty(Tooltip, "defaultProps", {
  allowEscapeViewBox: {
    x: false,
    y: false
  },
  animationDuration: 400,
  animationEasing: 'ease',
  contentStyle: {},
  coordinate: {
    x: 0,
    y: 0
  },
  cursor: true,
  cursorStyle: {},
  filterNull: true,
  isAnimationActive: !_Global.Global.isSsr,
  itemStyle: {},
  labelStyle: {},
  offset: 10,
  reverseDirection: {
    x: false,
    y: false
  },
  separator: ' : ',
  trigger: 'hover',
  useTranslate3d: false,
  wrapperStyle: {}
});