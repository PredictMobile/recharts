"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLegendProps = void 0;
var _Legend = require("../component/Legend");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * @deprecated we are replacing this function with Context-based legend instead. See useLegendPayloadDispatch and useLegendPayload
 * @param children do not use
 * @param legendWidth do not use
 * @returns mix of everything, do not use
 */
var getLegendProps = _ref => {
  var {
    legendItem,
    legendWidth
  } = _ref;
  return _objectSpread(_objectSpread({}, legendItem.props), _Legend.Legend.getWidthOrHeight(legendItem.props.layout, legendItem.props.height, legendItem.props.width, legendWidth));
};
exports.getLegendProps = getLegendProps;