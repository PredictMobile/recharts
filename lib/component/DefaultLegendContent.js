"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DefaultLegendContent = void 0;
var _react = _interopRequireWildcard(require("react"));
var _isFunction = _interopRequireDefault(require("lodash/isFunction"));
var _clsx = _interopRequireDefault(require("clsx"));
var _LogUtils = require("../util/LogUtils");
var _Surface = require("../container/Surface");
var _Symbols = require("../shape/Symbols");
var _types = require("../util/types");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * @fileOverview Default Legend Content
 */
var SIZE = 32;
class DefaultLegendContent extends _react.PureComponent {
  /**
   * Render the path of icon
   * @param data Data of each legend item
   * @param iconType if defined, it will always render this icon. If undefined then it uses icon from data.type
   * @return Path element
   */
  renderIcon(data, iconType) {
    var {
      inactiveColor
    } = this.props;
    var halfSize = SIZE / 2;
    var sixthSize = SIZE / 6;
    var thirdSize = SIZE / 3;
    var color = data.inactive ? inactiveColor : data.color;
    var preferredIcon = iconType !== null && iconType !== void 0 ? iconType : data.type;
    if (preferredIcon === 'none') {
      return null;
    }
    if (preferredIcon === 'plainline') {
      return /*#__PURE__*/_react.default.createElement("line", {
        strokeWidth: 4,
        fill: "none",
        stroke: color,
        strokeDasharray: data.payload.strokeDasharray,
        x1: 0,
        y1: halfSize,
        x2: SIZE,
        y2: halfSize,
        className: "recharts-legend-icon"
      });
    }
    if (preferredIcon === 'line') {
      return /*#__PURE__*/_react.default.createElement("path", {
        strokeWidth: 4,
        fill: "none",
        stroke: color,
        d: "M0,".concat(halfSize, "h").concat(thirdSize, "\n            A").concat(sixthSize, ",").concat(sixthSize, ",0,1,1,").concat(2 * thirdSize, ",").concat(halfSize, "\n            H").concat(SIZE, "M").concat(2 * thirdSize, ",").concat(halfSize, "\n            A").concat(sixthSize, ",").concat(sixthSize, ",0,1,1,").concat(thirdSize, ",").concat(halfSize),
        className: "recharts-legend-icon"
      });
    }
    if (preferredIcon === 'rect') {
      return /*#__PURE__*/_react.default.createElement("path", {
        stroke: "none",
        fill: color,
        d: "M0,".concat(SIZE / 8, "h").concat(SIZE, "v").concat(SIZE * 3 / 4, "h").concat(-SIZE, "z"),
        className: "recharts-legend-icon"
      });
    }
    if ( /*#__PURE__*/_react.default.isValidElement(data.legendIcon)) {
      var iconProps = _objectSpread({}, data);
      delete iconProps.legendIcon;
      return /*#__PURE__*/_react.default.cloneElement(data.legendIcon, iconProps);
    }
    return /*#__PURE__*/_react.default.createElement(_Symbols.Symbols, {
      fill: color,
      cx: halfSize,
      cy: halfSize,
      size: SIZE,
      sizeType: "diameter",
      type: preferredIcon
    });
  }

  /**
   * Draw items of legend
   * @return Items
   */
  renderItems() {
    var {
      payload,
      iconSize,
      layout,
      formatter,
      inactiveColor,
      iconType
    } = this.props;
    var viewBox = {
      x: 0,
      y: 0,
      width: SIZE,
      height: SIZE
    };
    var itemStyle = {
      display: layout === 'horizontal' ? 'inline-block' : 'block',
      marginRight: 10
    };
    var svgStyle = {
      display: 'inline-block',
      verticalAlign: 'middle',
      marginRight: 4
    };
    return payload.map((entry, i) => {
      var finalFormatter = entry.formatter || formatter;
      var className = (0, _clsx.default)({
        'recharts-legend-item': true,
        ["legend-item-".concat(i)]: true,
        inactive: entry.inactive
      });
      if (entry.type === 'none') {
        return null;
      }

      // Do not render entry.value as functions. Always require static string properties.
      var entryValue = !(0, _isFunction.default)(entry.value) ? entry.value : null;
      (0, _LogUtils.warn)(!(0, _isFunction.default)(entry.value), "The name property is also required when using a function for the dataKey of a chart's cartesian components. Ex: <Bar name=\"Name of my Data\"/>" // eslint-disable-line max-len
      );
      var color = entry.inactive ? inactiveColor : entry.color;
      return /*#__PURE__*/_react.default.createElement("li", _extends({
        className: className,
        style: itemStyle
        // eslint-disable-next-line react/no-array-index-key
        ,
        key: "legend-item-".concat(i)
      }, (0, _types.adaptEventsOfChild)(this.props, entry, i)), /*#__PURE__*/_react.default.createElement(_Surface.Surface, {
        width: iconSize,
        height: iconSize,
        viewBox: viewBox,
        style: svgStyle
      }, this.renderIcon(entry, iconType)), /*#__PURE__*/_react.default.createElement("span", {
        className: "recharts-legend-item-text",
        style: {
          color
        }
      }, finalFormatter ? finalFormatter(entryValue, entry, i) : entryValue));
    });
  }
  render() {
    var {
      payload,
      layout,
      align
    } = this.props;
    if (!payload || !payload.length) {
      return null;
    }
    var finalStyle = {
      padding: 0,
      margin: 0,
      textAlign: layout === 'horizontal' ? align : 'left'
    };
    return /*#__PURE__*/_react.default.createElement("ul", {
      className: "recharts-default-legend",
      style: finalStyle
    }, this.renderItems());
  }
}
exports.DefaultLegendContent = DefaultLegendContent;
_defineProperty(DefaultLegendContent, "displayName", 'Legend');
_defineProperty(DefaultLegendContent, "defaultProps", {
  iconSize: 14,
  layout: 'horizontal',
  align: 'center',
  verticalAlign: 'middle',
  inactiveColor: '#ccc'
});