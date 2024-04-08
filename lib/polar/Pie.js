"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Pie = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactSmooth = _interopRequireDefault(require("react-smooth"));
var _get = _interopRequireDefault(require("lodash/get"));
var _isEqual = _interopRequireDefault(require("lodash/isEqual"));
var _isFunction = _interopRequireDefault(require("lodash/isFunction"));
var _clsx = _interopRequireDefault(require("clsx"));
var _Layer = require("../container/Layer");
var _Curve = require("../shape/Curve");
var _Text = require("../component/Text");
var _Label = require("../component/Label");
var _LabelList = require("../component/LabelList");
var _Cell = require("../component/Cell");
var _ReactUtils = require("../util/ReactUtils");
var _Global = require("../util/Global");
var _PolarUtils = require("../util/PolarUtils");
var _DataUtils = require("../util/DataUtils");
var _ChartUtils = require("../util/ChartUtils");
var _types = require("../util/types");
var _ActiveShapeUtils = require("../util/ActiveShapeUtils");
var _legendPayloadContext = require("../context/legendPayloadContext");
var _Pie;
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * @fileOverview Render sectors of a pie
 */
var computeLegendPayloadFromPieData = _ref => {
  var {
    sectors,
    legendType
  } = _ref;
  if (sectors == null) {
    return [];
  }
  return sectors.map(entry => ({
    type: legendType,
    value: entry.name,
    color: entry.fill,
    payload: entry
  }));
};
function SetPiePayloadLegend(props) {
  (0, _legendPayloadContext.useLegendPayloadDispatch)(computeLegendPayloadFromPieData, props);
  return null;
}
class Pie extends _react.PureComponent {
  constructor(props) {
    super(props);
    _defineProperty(this, "pieRef", null);
    _defineProperty(this, "sectorRefs", []);
    _defineProperty(this, "id", (0, _DataUtils.uniqueId)('recharts-pie-'));
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
    this.state = {
      isAnimationFinished: !props.isAnimationActive,
      prevIsAnimationActive: props.isAnimationActive,
      prevAnimationId: props.animationId,
      sectorToFocus: 0
    };
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.prevIsAnimationActive !== nextProps.isAnimationActive) {
      return {
        prevIsAnimationActive: nextProps.isAnimationActive,
        prevAnimationId: nextProps.animationId,
        curSectors: nextProps.sectors,
        prevSectors: [],
        isAnimationFinished: true
      };
    }
    if (nextProps.isAnimationActive && nextProps.animationId !== prevState.prevAnimationId) {
      return {
        prevAnimationId: nextProps.animationId,
        curSectors: nextProps.sectors,
        prevSectors: prevState.curSectors,
        isAnimationFinished: true
      };
    }
    if (nextProps.sectors !== prevState.curSectors) {
      return {
        curSectors: nextProps.sectors,
        isAnimationFinished: true
      };
    }
    return null;
  }
  static getTextAnchor(x, cx) {
    if (x > cx) {
      return 'start';
    }
    if (x < cx) {
      return 'end';
    }
    return 'middle';
  }
  isActiveIndex(i) {
    var {
      activeIndex
    } = this.props;
    if (Array.isArray(activeIndex)) {
      return activeIndex.indexOf(i) !== -1;
    }
    return i === activeIndex;
  }
  hasActiveIndex() {
    var {
      activeIndex
    } = this.props;
    return Array.isArray(activeIndex) ? activeIndex.length !== 0 : activeIndex || activeIndex === 0;
  }
  static renderLabelLineItem(option, props) {
    if ( /*#__PURE__*/_react.default.isValidElement(option)) {
      return /*#__PURE__*/_react.default.cloneElement(option, props);
    }
    if ((0, _isFunction.default)(option)) {
      return option(props);
    }
    var className = (0, _clsx.default)('recharts-pie-label-line', typeof option !== 'boolean' ? option.className : '');
    return /*#__PURE__*/_react.default.createElement(_Curve.Curve, _extends({}, props, {
      type: "linear",
      className: className
    }));
  }
  static renderLabelItem(option, props, value) {
    if ( /*#__PURE__*/_react.default.isValidElement(option)) {
      return /*#__PURE__*/_react.default.cloneElement(option, props);
    }
    var label = value;
    if ((0, _isFunction.default)(option)) {
      label = option(props);
      if ( /*#__PURE__*/_react.default.isValidElement(label)) {
        return label;
      }
    }
    var className = (0, _clsx.default)('recharts-pie-label-text', typeof option !== 'boolean' && !(0, _isFunction.default)(option) ? option.className : '');
    return /*#__PURE__*/_react.default.createElement(_Text.Text, _extends({}, props, {
      alignmentBaseline: "middle",
      className: className
    }), label);
  }
  renderLabels(sectors) {
    var {
      isAnimationActive
    } = this.props;
    if (isAnimationActive && !this.state.isAnimationFinished) {
      return null;
    }
    var {
      label,
      labelLine,
      dataKey
    } = this.props;
    var pieProps = (0, _ReactUtils.filterProps)(this.props, false);
    var customLabelProps = (0, _ReactUtils.filterProps)(label, false);
    var customLabelLineProps = (0, _ReactUtils.filterProps)(labelLine, false);
    var offsetRadius = label && label.offsetRadius || 20;
    var labels = sectors.map((entry, i) => {
      var midAngle = (entry.startAngle + entry.endAngle) / 2;
      var endPoint = (0, _PolarUtils.polarToCartesian)(entry.cx, entry.cy, entry.outerRadius + offsetRadius, midAngle);
      var labelProps = _objectSpread(_objectSpread(_objectSpread(_objectSpread({}, pieProps), entry), {}, {
        stroke: 'none'
      }, customLabelProps), {}, {
        index: i,
        textAnchor: Pie.getTextAnchor(endPoint.x, entry.cx)
      }, endPoint);
      var lineProps = _objectSpread(_objectSpread(_objectSpread(_objectSpread({}, pieProps), entry), {}, {
        fill: 'none',
        stroke: entry.fill
      }, customLabelLineProps), {}, {
        index: i,
        points: [(0, _PolarUtils.polarToCartesian)(entry.cx, entry.cy, entry.outerRadius, midAngle), endPoint],
        key: 'line'
      });
      return (
        /*#__PURE__*/
        // eslint-disable-next-line react/no-array-index-key
        _react.default.createElement(_Layer.Layer, {
          key: "label-".concat(entry.startAngle, "-").concat(entry.endAngle, "-").concat(entry.midAngle, "-").concat(i)
        }, labelLine && Pie.renderLabelLineItem(labelLine, lineProps), Pie.renderLabelItem(label, labelProps, (0, _ChartUtils.getValueByDataKey)(entry, dataKey)))
      );
    });
    return /*#__PURE__*/_react.default.createElement(_Layer.Layer, {
      className: "recharts-pie-labels"
    }, labels);
  }
  renderSectorsStatically(sectors) {
    var {
      activeShape,
      blendStroke,
      inactiveShape: inactiveShapeProp
    } = this.props;
    return sectors.map((entry, i) => {
      if ((entry === null || entry === void 0 ? void 0 : entry.startAngle) === 0 && (entry === null || entry === void 0 ? void 0 : entry.endAngle) === 0 && sectors.length !== 1) return null;
      var isActive = this.isActiveIndex(i);
      var inactiveShape = inactiveShapeProp && this.hasActiveIndex() ? inactiveShapeProp : null;
      var sectorOptions = isActive ? activeShape : inactiveShape;
      var sectorProps = _objectSpread(_objectSpread({}, entry), {}, {
        stroke: blendStroke ? entry.fill : entry.stroke,
        tabIndex: -1
      });
      return /*#__PURE__*/_react.default.createElement(_Layer.Layer, _extends({
        ref: _ref2 => {
          if (_ref2 && !this.sectorRefs.includes(_ref2)) {
            this.sectorRefs.push(_ref2);
          }
        },
        tabIndex: -1,
        className: "recharts-pie-sector"
      }, (0, _types.adaptEventsOfChild)(this.props, entry, i), {
        // eslint-disable-next-line react/no-array-index-key
        key: "sector-".concat(entry === null || entry === void 0 ? void 0 : entry.startAngle, "-").concat(entry === null || entry === void 0 ? void 0 : entry.endAngle, "-").concat(entry.midAngle, "-").concat(i)
      }), /*#__PURE__*/_react.default.createElement(_ActiveShapeUtils.Shape, _extends({
        option: sectorOptions,
        isActive: isActive,
        shapeType: "sector"
      }, sectorProps)));
    });
  }
  renderSectorsWithAnimation() {
    var {
      sectors,
      isAnimationActive,
      animationBegin,
      animationDuration,
      animationEasing,
      animationId
    } = this.props;
    var {
      prevSectors,
      prevIsAnimationActive
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
      key: "pie-".concat(animationId, "-").concat(prevIsAnimationActive),
      onAnimationStart: this.handleAnimationStart,
      onAnimationEnd: this.handleAnimationEnd
    }, _ref3 => {
      var {
        t
      } = _ref3;
      var stepData = [];
      var first = sectors && sectors[0];
      var curAngle = first.startAngle;
      sectors.forEach((entry, index) => {
        var prev = prevSectors && prevSectors[index];
        var paddingAngle = index > 0 ? (0, _get.default)(entry, 'paddingAngle', 0) : 0;
        if (prev) {
          var angleIp = (0, _DataUtils.interpolateNumber)(prev.endAngle - prev.startAngle, entry.endAngle - entry.startAngle);
          var latest = _objectSpread(_objectSpread({}, entry), {}, {
            startAngle: curAngle + paddingAngle,
            endAngle: curAngle + angleIp(t) + paddingAngle
          });
          stepData.push(latest);
          curAngle = latest.endAngle;
        } else {
          var {
            endAngle,
            startAngle
          } = entry;
          var interpolatorAngle = (0, _DataUtils.interpolateNumber)(0, endAngle - startAngle);
          var deltaAngle = interpolatorAngle(t);
          var _latest = _objectSpread(_objectSpread({}, entry), {}, {
            startAngle: curAngle + paddingAngle,
            endAngle: curAngle + deltaAngle + paddingAngle
          });
          stepData.push(_latest);
          curAngle = _latest.endAngle;
        }
      });
      return /*#__PURE__*/_react.default.createElement(_Layer.Layer, null, this.renderSectorsStatically(stepData));
    });
  }
  attachKeyboardHandlers(pieRef) {
    // eslint-disable-next-line no-param-reassign
    pieRef.onkeydown = e => {
      if (!e.altKey) {
        switch (e.key) {
          case 'ArrowLeft':
            {
              var next = ++this.state.sectorToFocus % this.sectorRefs.length;
              this.sectorRefs[next].focus();
              this.setState({
                sectorToFocus: next
              });
              break;
            }
          case 'ArrowRight':
            {
              var _next = --this.state.sectorToFocus < 0 ? this.sectorRefs.length - 1 : this.state.sectorToFocus % this.sectorRefs.length;
              this.sectorRefs[_next].focus();
              this.setState({
                sectorToFocus: _next
              });
              break;
            }
          case 'Escape':
            {
              this.sectorRefs[this.state.sectorToFocus].blur();
              this.setState({
                sectorToFocus: 0
              });
              break;
            }
          default:
            {
              // There is nothing to do here
            }
        }
      }
    };
  }
  renderSectors() {
    var {
      sectors,
      isAnimationActive
    } = this.props;
    var {
      prevSectors
    } = this.state;
    if (isAnimationActive && sectors && sectors.length && (!prevSectors || !(0, _isEqual.default)(prevSectors, sectors))) {
      return this.renderSectorsWithAnimation();
    }
    return this.renderSectorsStatically(sectors);
  }
  componentDidMount() {
    if (this.pieRef) {
      this.attachKeyboardHandlers(this.pieRef);
    }
  }
  render() {
    var {
      hide,
      sectors,
      className,
      label,
      cx,
      cy,
      innerRadius,
      outerRadius,
      isAnimationActive
    } = this.props;
    var {
      isAnimationFinished
    } = this.state;
    if (hide || !sectors || !sectors.length || !(0, _DataUtils.isNumber)(cx) || !(0, _DataUtils.isNumber)(cy) || !(0, _DataUtils.isNumber)(innerRadius) || !(0, _DataUtils.isNumber)(outerRadius)) {
      /*
       * This used to render `null`, but it should still set the legend because:
       * 1. Hidden pie still renders a legend item (albeit with inactive color)
       * 2. if a dataKey does not match anything from props.data, then props.sectors are not defined.
       * Legend still renders though! Behaviour (2) is arguably a bug - and we should be fixing it perhaps?
       * But for now I will keep it as-is.
       */
      return /*#__PURE__*/_react.default.createElement(SetPiePayloadLegend, {
        sectors: this.props.sectors || this.props.data,
        legendType: this.props.legendType
      });
    }
    var layerClass = (0, _clsx.default)('recharts-pie', className);
    return /*#__PURE__*/_react.default.createElement(_Layer.Layer, {
      tabIndex: this.props.rootTabIndex,
      className: layerClass,
      ref: _ref4 => {
        this.pieRef = _ref4;
      }
    }, this.renderSectors(), label && this.renderLabels(sectors), _Label.Label.renderCallByParent(this.props, null, false), (!isAnimationActive || isAnimationFinished) && _LabelList.LabelList.renderCallByParent(this.props, sectors, false), /*#__PURE__*/_react.default.createElement(SetPiePayloadLegend, {
      sectors: this.props.sectors,
      legendType: this.props.legendType
    }));
  }
}
exports.Pie = Pie;
_Pie = Pie;
_defineProperty(Pie, "displayName", 'Pie');
_defineProperty(Pie, "defaultProps", {
  stroke: '#fff',
  fill: '#808080',
  legendType: 'rect',
  cx: '50%',
  cy: '50%',
  startAngle: 0,
  endAngle: 360,
  innerRadius: 0,
  outerRadius: '80%',
  paddingAngle: 0,
  labelLine: true,
  hide: false,
  minAngle: 0,
  isAnimationActive: !_Global.Global.isSsr,
  animationBegin: 400,
  animationDuration: 1500,
  animationEasing: 'ease',
  nameKey: 'name',
  blendStroke: false,
  rootTabIndex: 0
});
_defineProperty(Pie, "parseDeltaAngle", (startAngle, endAngle) => {
  var sign = (0, _DataUtils.mathSign)(endAngle - startAngle);
  var deltaAngle = Math.min(Math.abs(endAngle - startAngle), 360);
  return sign * deltaAngle;
});
_defineProperty(Pie, "getRealPieData", item => {
  var {
    data,
    children
  } = item.props;
  var presentationProps = (0, _ReactUtils.filterProps)(item.props, false);
  var cells = (0, _ReactUtils.findAllByType)(children, _Cell.Cell);
  if (data && data.length) {
    return data.map((entry, index) => _objectSpread(_objectSpread(_objectSpread({
      payload: entry
    }, presentationProps), entry), cells && cells[index] && cells[index].props));
  }
  if (cells && cells.length) {
    return cells.map(cell => _objectSpread(_objectSpread({}, presentationProps), cell.props));
  }
  return [];
});
_defineProperty(Pie, "parseCoordinateOfPie", (item, offset) => {
  var {
    top,
    left,
    width,
    height
  } = offset;
  var maxPieRadius = (0, _PolarUtils.getMaxRadius)(width, height);
  var cx = left + (0, _DataUtils.getPercentValue)(item.props.cx, width, width / 2);
  var cy = top + (0, _DataUtils.getPercentValue)(item.props.cy, height, height / 2);
  var innerRadius = (0, _DataUtils.getPercentValue)(item.props.innerRadius, maxPieRadius, 0);
  var outerRadius = (0, _DataUtils.getPercentValue)(item.props.outerRadius, maxPieRadius, maxPieRadius * 0.8);
  var maxRadius = item.props.maxRadius || Math.sqrt(width * width + height * height) / 2;
  return {
    cx,
    cy,
    innerRadius,
    outerRadius,
    maxRadius
  };
});
_defineProperty(Pie, "getComposedData", _ref5 => {
  var {
    item,
    offset
  } = _ref5;
  var pieData = _Pie.getRealPieData(item);
  if (!pieData || !pieData.length) {
    return null;
  }
  var {
    cornerRadius,
    startAngle,
    endAngle,
    paddingAngle,
    dataKey,
    nameKey,
    tooltipType
  } = item.props;
  var minAngle = Math.abs(item.props.minAngle);
  var coordinate = _Pie.parseCoordinateOfPie(item, offset);
  var deltaAngle = _Pie.parseDeltaAngle(startAngle, endAngle);
  var absDeltaAngle = Math.abs(deltaAngle);
  var notZeroItemCount = pieData.filter(entry => (0, _ChartUtils.getValueByDataKey)(entry, dataKey, 0) !== 0).length;
  var totalPadingAngle = (absDeltaAngle >= 360 ? notZeroItemCount : notZeroItemCount - 1) * paddingAngle;
  var realTotalAngle = absDeltaAngle - notZeroItemCount * minAngle - totalPadingAngle;
  var sum = pieData.reduce((result, entry) => {
    var val = (0, _ChartUtils.getValueByDataKey)(entry, dataKey, 0);
    return result + ((0, _DataUtils.isNumber)(val) ? val : 0);
  }, 0);
  var sectors;
  if (sum > 0) {
    var prev;
    sectors = pieData.map((entry, i) => {
      var val = (0, _ChartUtils.getValueByDataKey)(entry, dataKey, 0);
      var name = (0, _ChartUtils.getValueByDataKey)(entry, nameKey, i);
      var percent = ((0, _DataUtils.isNumber)(val) ? val : 0) / sum;
      var tempStartAngle;
      if (i) {
        tempStartAngle = prev.endAngle + (0, _DataUtils.mathSign)(deltaAngle) * paddingAngle * (val !== 0 ? 1 : 0);
      } else {
        tempStartAngle = startAngle;
      }
      var tempEndAngle = tempStartAngle + (0, _DataUtils.mathSign)(deltaAngle) * ((val !== 0 ? minAngle : 0) + percent * realTotalAngle);
      var midAngle = (tempStartAngle + tempEndAngle) / 2;
      var middleRadius = (coordinate.innerRadius + coordinate.outerRadius) / 2;
      var tooltipPayload = [{
        name,
        value: val,
        payload: entry,
        dataKey,
        type: tooltipType
      }];
      var tooltipPosition = (0, _PolarUtils.polarToCartesian)(coordinate.cx, coordinate.cy, middleRadius, midAngle);
      prev = _objectSpread(_objectSpread(_objectSpread({
        percent,
        cornerRadius,
        name,
        tooltipPayload,
        midAngle,
        middleRadius,
        tooltipPosition
      }, entry), coordinate), {}, {
        value: (0, _ChartUtils.getValueByDataKey)(entry, dataKey),
        startAngle: tempStartAngle,
        endAngle: tempEndAngle,
        payload: entry,
        paddingAngle: (0, _DataUtils.mathSign)(deltaAngle) * paddingAngle
      });
      return prev;
    });
  }
  return _objectSpread(_objectSpread({}, coordinate), {}, {
    sectors,
    data: pieData
  });
});