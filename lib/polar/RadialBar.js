"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RadialBar = void 0;
var _react = _interopRequireWildcard(require("react"));
var _clsx = _interopRequireDefault(require("clsx"));
var _reactSmooth = _interopRequireDefault(require("react-smooth"));
var _isEqual = _interopRequireDefault(require("lodash/isEqual"));
var _isFunction = _interopRequireDefault(require("lodash/isFunction"));
var _RadialBarUtils = require("../util/RadialBarUtils");
var _Layer = require("../container/Layer");
var _ReactUtils = require("../util/ReactUtils");
var _Global = require("../util/Global");
var _LabelList = require("../component/LabelList");
var _Cell = require("../component/Cell");
var _DataUtils = require("../util/DataUtils");
var _ChartUtils = require("../util/ChartUtils");
var _types = require("../util/types");
var _PolarUtils = require("../util/PolarUtils");
var _legendPayloadContext = require("../context/legendPayloadContext");
var _excluded = ["shape", "activeShape", "activeIndex", "cornerRadius"],
  _excluded2 = ["value", "background"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * @fileOverview Render a group of radial bar
 */
// TODO: Cause of circular dependency. Needs refactoring of functions that need them.
// import { AngleAxisProps, RadiusAxisProps } from './types';

var computeLegendPayloadFromRadarData = _ref => {
  var {
    data,
    legendType
  } = _ref;
  return data.map(entry => ({
    type: legendType,
    value: entry.name,
    color: entry.fill,
    payload: entry
  }));
};
function SetRadialBarPayloadLegend(props) {
  (0, _legendPayloadContext.useLegendPayloadDispatch)(computeLegendPayloadFromRadarData, props);
  return null;
}
class RadialBar extends _react.PureComponent {
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
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.animationId !== prevState.prevAnimationId) {
      return {
        prevAnimationId: nextProps.animationId,
        curData: nextProps.data,
        prevData: prevState.curData
      };
    }
    if (nextProps.data !== prevState.curData) {
      return {
        curData: nextProps.data
      };
    }
    return null;
  }
  getDeltaAngle() {
    var {
      startAngle,
      endAngle
    } = this.props;
    var sign = (0, _DataUtils.mathSign)(endAngle - startAngle);
    var deltaAngle = Math.min(Math.abs(endAngle - startAngle), 360);
    return sign * deltaAngle;
  }
  renderSectorsStatically(sectors) {
    var _this$props = this.props,
      {
        shape,
        activeShape,
        activeIndex,
        cornerRadius
      } = _this$props,
      others = _objectWithoutProperties(_this$props, _excluded);
    var baseProps = (0, _ReactUtils.filterProps)(others, false);
    return sectors.map((entry, i) => {
      var isActive = i === activeIndex;
      var props = _objectSpread(_objectSpread(_objectSpread(_objectSpread({}, baseProps), {}, {
        cornerRadius: (0, _RadialBarUtils.parseCornerRadius)(cornerRadius)
      }, entry), (0, _types.adaptEventsOfChild)(this.props, entry, i)), {}, {
        key: "sector-".concat(i),
        className: "recharts-radial-bar-sector ".concat(entry.className),
        forceCornerRadius: others.forceCornerRadius,
        cornerIsExternal: others.cornerIsExternal,
        isActive,
        option: isActive ? activeShape : shape
      });
      return /*#__PURE__*/_react.default.createElement(_RadialBarUtils.RadialBarSector, props);
    });
  }
  renderSectorsWithAnimation() {
    var {
      data,
      isAnimationActive,
      animationBegin,
      animationDuration,
      animationEasing,
      animationId
    } = this.props;
    var {
      prevData
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
      key: "radialBar-".concat(animationId),
      onAnimationStart: this.handleAnimationStart,
      onAnimationEnd: this.handleAnimationEnd
    }, _ref2 => {
      var {
        t
      } = _ref2;
      var stepData = data.map((entry, index) => {
        var prev = prevData && prevData[index];
        if (prev) {
          var interpolatorStartAngle = (0, _DataUtils.interpolateNumber)(prev.startAngle, entry.startAngle);
          var interpolatorEndAngle = (0, _DataUtils.interpolateNumber)(prev.endAngle, entry.endAngle);
          return _objectSpread(_objectSpread({}, entry), {}, {
            startAngle: interpolatorStartAngle(t),
            endAngle: interpolatorEndAngle(t)
          });
        }
        var {
          endAngle,
          startAngle
        } = entry;
        var interpolator = (0, _DataUtils.interpolateNumber)(startAngle, endAngle);
        return _objectSpread(_objectSpread({}, entry), {}, {
          endAngle: interpolator(t)
        });
      });
      return /*#__PURE__*/_react.default.createElement(_Layer.Layer, null, this.renderSectorsStatically(stepData));
    });
  }
  renderSectors() {
    var {
      data,
      isAnimationActive
    } = this.props;
    var {
      prevData
    } = this.state;
    if (isAnimationActive && data && data.length && (!prevData || !(0, _isEqual.default)(prevData, data))) {
      return this.renderSectorsWithAnimation();
    }
    return this.renderSectorsStatically(data);
  }
  renderBackground(sectors) {
    var {
      cornerRadius
    } = this.props;
    var backgroundProps = (0, _ReactUtils.filterProps)(this.props.background, false);
    return sectors.map((entry, i) => {
      var {
          value,
          background
        } = entry,
        rest = _objectWithoutProperties(entry, _excluded2);
      if (!background) {
        return null;
      }
      var props = _objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread({
        cornerRadius: (0, _RadialBarUtils.parseCornerRadius)(cornerRadius)
      }, rest), {}, {
        fill: '#eee'
      }, background), backgroundProps), (0, _types.adaptEventsOfChild)(this.props, entry, i)), {}, {
        index: i,
        key: "sector-".concat(i),
        className: (0, _clsx.default)('recharts-radial-bar-background-sector', backgroundProps === null || backgroundProps === void 0 ? void 0 : backgroundProps.className),
        option: background,
        isActive: false
      });
      return /*#__PURE__*/_react.default.createElement(_RadialBarUtils.RadialBarSector, props);
    });
  }
  render() {
    var {
      hide,
      data,
      className,
      background,
      isAnimationActive
    } = this.props;
    if (hide || !data || !data.length) {
      return null;
    }
    var {
      isAnimationFinished
    } = this.state;
    var layerClass = (0, _clsx.default)('recharts-area', className);
    return /*#__PURE__*/_react.default.createElement(_Layer.Layer, {
      className: layerClass
    }, /*#__PURE__*/_react.default.createElement(SetRadialBarPayloadLegend, {
      data: this.props.data,
      legendType: this.props.legendType
    }), background && /*#__PURE__*/_react.default.createElement(_Layer.Layer, {
      className: "recharts-radial-bar-background"
    }, this.renderBackground(data)), /*#__PURE__*/_react.default.createElement(_Layer.Layer, {
      className: "recharts-radial-bar-sectors"
    }, this.renderSectors()), (!isAnimationActive || isAnimationFinished) && _LabelList.LabelList.renderCallByParent(_objectSpread({}, this.props), data));
  }
}
exports.RadialBar = RadialBar;
_defineProperty(RadialBar, "displayName", 'RadialBar');
_defineProperty(RadialBar, "defaultProps", {
  angleAxisId: 0,
  radiusAxisId: 0,
  minPointSize: 0,
  hide: false,
  legendType: 'rect',
  data: [],
  isAnimationActive: !_Global.Global.isSsr,
  animationBegin: 0,
  animationDuration: 1500,
  animationEasing: 'ease',
  forceCornerRadius: false,
  cornerIsExternal: false
});
_defineProperty(RadialBar, "getComposedData", _ref3 => {
  var {
    item,
    props,
    radiusAxis,
    radiusAxisTicks,
    angleAxis,
    angleAxisTicks,
    displayedData,
    dataKey,
    stackedData,
    barPosition,
    bandSize,
    dataStartIndex
  } = _ref3;
  var pos = (0, _ChartUtils.findPositionOfBar)(barPosition, item);
  if (!pos) {
    return null;
  }
  var {
    cx,
    cy
  } = angleAxis;
  var {
    layout
  } = props;
  var {
    children,
    minPointSize
  } = item.props;
  var numericAxis = layout === 'radial' ? angleAxis : radiusAxis;
  var stackedDomain = stackedData ? numericAxis.scale.domain() : null;
  var baseValue = (0, _ChartUtils.getBaseValueOfBar)({
    numericAxis
  });
  var cells = (0, _ReactUtils.findAllByType)(children, _Cell.Cell);
  var sectors = displayedData.map((entry, index) => {
    var value, innerRadius, outerRadius, startAngle, endAngle, backgroundSector;
    if (stackedData) {
      value = (0, _ChartUtils.truncateByDomain)(stackedData[dataStartIndex + index], stackedDomain);
    } else {
      value = (0, _ChartUtils.getValueByDataKey)(entry, dataKey);
      if (!Array.isArray(value)) {
        value = [baseValue, value];
      }
    }
    if (layout === 'radial') {
      innerRadius = (0, _ChartUtils.getCateCoordinateOfBar)({
        axis: radiusAxis,
        ticks: radiusAxisTicks,
        bandSize,
        offset: pos.offset,
        entry,
        index
      });
      endAngle = angleAxis.scale(value[1]);
      startAngle = angleAxis.scale(value[0]);
      outerRadius = innerRadius + pos.size;
      var deltaAngle = endAngle - startAngle;
      if (Math.abs(minPointSize) > 0 && Math.abs(deltaAngle) < Math.abs(minPointSize)) {
        var delta = (0, _DataUtils.mathSign)(deltaAngle || minPointSize) * (Math.abs(minPointSize) - Math.abs(deltaAngle));
        endAngle += delta;
      }
      backgroundSector = {
        background: {
          cx,
          cy,
          innerRadius,
          outerRadius,
          startAngle: props.startAngle,
          endAngle: props.endAngle
        }
      };
    } else {
      innerRadius = radiusAxis.scale(value[0]);
      outerRadius = radiusAxis.scale(value[1]);
      startAngle = (0, _ChartUtils.getCateCoordinateOfBar)({
        axis: angleAxis,
        ticks: angleAxisTicks,
        bandSize,
        offset: pos.offset,
        entry,
        index
      });
      endAngle = startAngle + pos.size;
      var deltaRadius = outerRadius - innerRadius;
      if (Math.abs(minPointSize) > 0 && Math.abs(deltaRadius) < Math.abs(minPointSize)) {
        var _delta = (0, _DataUtils.mathSign)(deltaRadius || minPointSize) * (Math.abs(minPointSize) - Math.abs(deltaRadius));
        outerRadius += _delta;
      }
    }
    return _objectSpread(_objectSpread(_objectSpread(_objectSpread({}, entry), backgroundSector), {}, {
      payload: entry,
      value: stackedData ? value : value[1],
      cx,
      cy,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle
    }, cells && cells[index] && cells[index].props), {}, {
      // @ts-expect-error missing types
      tooltipPayload: [(0, _ChartUtils.getTooltipItem)(item, entry)],
      tooltipPosition: (0, _PolarUtils.polarToCartesian)(cx, cy, (innerRadius + outerRadius) / 2, (startAngle + endAngle) / 2)
    });
  });
  return {
    data: sectors,
    layout
  };
});