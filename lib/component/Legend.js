"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Legend = void 0;
var _react = _interopRequireWildcard(require("react"));
var _DefaultLegendContent = require("./DefaultLegendContent");
var _DataUtils = require("../util/DataUtils");
var _getUniqPayload = require("../util/payload/getUniqPayload");
var _legendPayloadContext = require("../context/legendPayloadContext");
var _useGetBoundingClientRect = require("../util/useGetBoundingClientRect");
var _chartLayoutContext = require("../context/chartLayoutContext");
var _legendBoundingBoxContext = require("../context/legendBoundingBoxContext");
var _excluded = ["contextPayload"],
  _excluded2 = ["ref"];
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
function defaultUniqBy(entry) {
  return entry.value;
}
function LegendContent(props) {
  var {
      contextPayload
    } = props,
    otherProps = _objectWithoutProperties(props, _excluded);
  var finalPayload = (0, _getUniqPayload.getUniqPayload)(contextPayload, props.payloadUniqBy, defaultUniqBy);
  var contentProps = _objectSpread(_objectSpread({}, otherProps), {}, {
    payload: finalPayload
  });
  if ( /*#__PURE__*/_react.default.isValidElement(props.content)) {
    return /*#__PURE__*/_react.default.cloneElement(props.content, contentProps);
  }
  if (typeof props.content === 'function') {
    return /*#__PURE__*/_react.default.createElement(props.content, contentProps);
  }
  var {
      ref
    } = contentProps,
    propsWithoutRef = _objectWithoutProperties(contentProps, _excluded2);
  return /*#__PURE__*/_react.default.createElement(_DefaultLegendContent.DefaultLegendContent, propsWithoutRef);
}
function getDefaultPosition(style, props, margin, chartWidth, chartHeight, box) {
  var {
    layout,
    align,
    verticalAlign
  } = props;
  var hPos, vPos;
  if (!style || (style.left === undefined || style.left === null) && (style.right === undefined || style.right === null)) {
    if (align === 'center' && layout === 'vertical') {
      hPos = {
        left: ((chartWidth || 0) - box.width) / 2
      };
    } else {
      hPos = align === 'right' ? {
        right: margin && margin.right || 0
      } : {
        left: margin && margin.left || 0
      };
    }
  }
  if (!style || (style.top === undefined || style.top === null) && (style.bottom === undefined || style.bottom === null)) {
    if (verticalAlign === 'middle') {
      vPos = {
        top: ((chartHeight || 0) - box.height) / 2
      };
    } else {
      vPos = verticalAlign === 'bottom' ? {
        bottom: margin && margin.bottom || 0
      } : {
        top: margin && margin.top || 0
      };
    }
  }
  return _objectSpread(_objectSpread({}, hPos), vPos);
}
function LegendWrapper(props) {
  var contextPayload = (0, _legendPayloadContext.useLegendPayload)();
  var margin = (0, _chartLayoutContext.useMargin)();
  var {
    width: widthFromProps,
    height: heightFromProps,
    wrapperStyle
  } = props;
  var onBBoxUpdate = (0, _react.useContext)(_legendBoundingBoxContext.LegendBoundingBoxContext);
  // The contextPayload is not used directly inside the hook, but we need the onBBoxUpdate call
  // when the payload changes, therefore it's here as a dependency.
  var [lastBoundingBox, updateBoundingBox] = (0, _useGetBoundingClientRect.useGetBoundingClientRect)(onBBoxUpdate, [contextPayload]);
  var chartWidth = (0, _chartLayoutContext.useChartWidth)();
  var chartHeight = (0, _chartLayoutContext.useChartHeight)();
  var maxWidth = chartWidth - (margin.left || 0) - (margin.right || 0);
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  var widthOrHeight = Legend.getWidthOrHeight(props.layout, heightFromProps, widthFromProps, maxWidth);
  var outerStyle = _objectSpread(_objectSpread({
    position: 'absolute',
    width: (widthOrHeight === null || widthOrHeight === void 0 ? void 0 : widthOrHeight.width) || widthFromProps || 'auto',
    height: (widthOrHeight === null || widthOrHeight === void 0 ? void 0 : widthOrHeight.height) || heightFromProps || 'auto'
  }, getDefaultPosition(wrapperStyle, props, margin, chartWidth, chartHeight, lastBoundingBox)), wrapperStyle);
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "recharts-legend-wrapper",
    style: outerStyle,
    ref: updateBoundingBox
  }, /*#__PURE__*/_react.default.createElement(LegendContent, _extends({}, props, widthOrHeight, {
    margin: margin
    // This doesn't need the bboxupdate callback at all - I pass it for the sake of not changing anything in the API
    ,
    onBBoxUpdate: onBBoxUpdate,
    chartWidth: chartWidth,
    chartHeight: chartHeight,
    contextPayload: contextPayload
  })));
}
class Legend extends _react.PureComponent {
  static getWidthOrHeight(layout, height, width, maxWidth) {
    if (layout === 'vertical' && (0, _DataUtils.isNumber)(height)) {
      return {
        height
      };
    }
    if (layout === 'horizontal') {
      return {
        width: width || maxWidth
      };
    }
    return null;
  }
  render() {
    return /*#__PURE__*/_react.default.createElement("foreignObject", {
      x: "0",
      y: "0",
      width: "100%",
      height: "100%"
    }, /*#__PURE__*/_react.default.createElement(LegendWrapper, this.props));
  }
}
exports.Legend = Legend;
_defineProperty(Legend, "displayName", 'Legend');
_defineProperty(Legend, "defaultProps", {
  iconSize: 14,
  layout: 'horizontal',
  align: 'center',
  verticalAlign: 'bottom'
});