"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DefaultTooltipContent = void 0;
var _react = _interopRequireDefault(require("react"));
var _sortBy = _interopRequireDefault(require("lodash/sortBy"));
var _isNil = _interopRequireDefault(require("lodash/isNil"));
var _clsx = _interopRequireDefault(require("clsx"));
var _DataUtils = require("../util/DataUtils");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * @fileOverview Default Tooltip Content
 */
function defaultFormatter(value) {
  return Array.isArray(value) && (0, _DataUtils.isNumOrStr)(value[0]) && (0, _DataUtils.isNumOrStr)(value[1]) ? value.join(' ~ ') : value;
}
var DefaultTooltipContent = props => {
  var {
    separator = ' : ',
    contentStyle = {},
    itemStyle = {},
    labelStyle = {},
    payload,
    formatter,
    itemSorter,
    wrapperClassName,
    labelClassName,
    label,
    labelFormatter,
    accessibilityLayer = false
  } = props;
  var renderContent = () => {
    if (payload && payload.length) {
      var listStyle = {
        padding: 0,
        margin: 0
      };
      var items = (itemSorter ? (0, _sortBy.default)(payload, itemSorter) : payload).map((entry, i) => {
        if (entry.type === 'none') {
          return null;
        }
        var finalItemStyle = _objectSpread({
          display: 'block',
          paddingTop: 4,
          paddingBottom: 4,
          color: entry.color || '#000'
        }, itemStyle);
        var finalFormatter = entry.formatter || formatter || defaultFormatter;
        var {
          value,
          name
        } = entry;
        var finalValue = value;
        var finalName = name;
        if (finalFormatter && finalValue != null && finalName != null) {
          var formatted = finalFormatter(value, name, entry, i, payload);
          if (Array.isArray(formatted)) {
            [finalValue, finalName] = formatted;
          } else {
            finalValue = formatted;
          }
        }
        return (
          /*#__PURE__*/
          // eslint-disable-next-line react/no-array-index-key
          _react.default.createElement("li", {
            className: "recharts-tooltip-item",
            key: "tooltip-item-".concat(i),
            style: finalItemStyle
          }, (0, _DataUtils.isNumOrStr)(finalName) ? /*#__PURE__*/_react.default.createElement("span", {
            className: "recharts-tooltip-item-name"
          }, finalName) : null, (0, _DataUtils.isNumOrStr)(finalName) ? /*#__PURE__*/_react.default.createElement("span", {
            className: "recharts-tooltip-item-separator"
          }, separator) : null, /*#__PURE__*/_react.default.createElement("span", {
            className: "recharts-tooltip-item-value"
          }, finalValue), /*#__PURE__*/_react.default.createElement("span", {
            className: "recharts-tooltip-item-unit"
          }, entry.unit || ''))
        );
      });
      return /*#__PURE__*/_react.default.createElement("ul", {
        className: "recharts-tooltip-item-list",
        style: listStyle
      }, items);
    }
    return null;
  };
  var finalStyle = _objectSpread({
    margin: 0,
    padding: 10,
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    whiteSpace: 'nowrap'
  }, contentStyle);
  var finalLabelStyle = _objectSpread({
    margin: 0
  }, labelStyle);
  var hasLabel = !(0, _isNil.default)(label);
  var finalLabel = hasLabel ? label : '';
  var wrapperCN = (0, _clsx.default)('recharts-default-tooltip', wrapperClassName);
  var labelCN = (0, _clsx.default)('recharts-tooltip-label', labelClassName);
  if (hasLabel && labelFormatter && payload !== undefined && payload !== null) {
    finalLabel = labelFormatter(label, payload);
  }
  var accessibilityAttributes = accessibilityLayer ? {
    role: 'status',
    'aria-live': 'assertive'
  } : {};
  return /*#__PURE__*/_react.default.createElement("div", _extends({
    className: wrapperCN,
    style: finalStyle
  }, accessibilityAttributes), /*#__PURE__*/_react.default.createElement("p", {
    className: labelCN,
    style: finalLabelStyle
  }, /*#__PURE__*/_react.default.isValidElement(finalLabel) ? finalLabel : "".concat(finalLabel)), renderContent());
};
exports.DefaultTooltipContent = DefaultTooltipContent;