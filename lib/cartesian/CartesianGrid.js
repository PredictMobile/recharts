"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CartesianGrid = CartesianGrid;
var _react = _interopRequireDefault(require("react"));
var _isFunction = _interopRequireDefault(require("lodash/isFunction"));
var _LogUtils = require("../util/LogUtils");
var _DataUtils = require("../util/DataUtils");
var _ReactUtils = require("../util/ReactUtils");
var _ChartUtils = require("../util/ChartUtils");
var _getTicks = require("./getTicks");
var _CartesianAxis = require("./CartesianAxis");
var _chartLayoutContext = require("../context/chartLayoutContext");
var _excluded = ["x1", "y1", "x2", "y2", "key"],
  _excluded2 = ["offset"];
/**
 * @fileOverview Cartesian Grid
 */
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
/**
 * The <CartesianGrid horizontal
 */

var Background = props => {
  var {
    fill
  } = props;
  if (!fill || fill === 'none') {
    return null;
  }
  var {
    fillOpacity,
    x,
    y,
    width,
    height
  } = props;
  return /*#__PURE__*/_react.default.createElement("rect", {
    x: x,
    y: y,
    width: width,
    height: height,
    stroke: "none",
    fill: fill,
    fillOpacity: fillOpacity,
    className: "recharts-cartesian-grid-bg"
  });
};
function renderLineItem(option, props) {
  var lineItem;
  if ( /*#__PURE__*/_react.default.isValidElement(option)) {
    // @ts-expect-error typescript does not see the props type when cloning an element
    lineItem = /*#__PURE__*/_react.default.cloneElement(option, props);
  } else if ((0, _isFunction.default)(option)) {
    lineItem = option(props);
  } else {
    var {
        x1,
        y1,
        x2,
        y2,
        key
      } = props,
      others = _objectWithoutProperties(props, _excluded);
    var _filterProps = (0, _ReactUtils.filterProps)(others, false),
      {
        offset: __
      } = _filterProps,
      restOfFilteredProps = _objectWithoutProperties(_filterProps, _excluded2);
    lineItem = /*#__PURE__*/_react.default.createElement("line", _extends({}, restOfFilteredProps, {
      x1: x1,
      y1: y1,
      x2: x2,
      y2: y2,
      fill: "none",
      key: key
    }));
  }
  return lineItem;
}
function HorizontalGridLines(props) {
  var {
    x,
    width,
    horizontal = true,
    horizontalPoints
  } = props;
  if (!horizontal || !horizontalPoints || !horizontalPoints.length) {
    return null;
  }
  var items = horizontalPoints.map((entry, i) => {
    var lineItemProps = _objectSpread(_objectSpread({}, props), {}, {
      x1: x,
      y1: entry,
      x2: x + width,
      y2: entry,
      key: "line-".concat(i),
      index: i
    });
    return renderLineItem(horizontal, lineItemProps);
  });
  return /*#__PURE__*/_react.default.createElement("g", {
    className: "recharts-cartesian-grid-horizontal"
  }, items);
}
function VerticalGridLines(props) {
  var {
    y,
    height,
    vertical = true,
    verticalPoints
  } = props;
  if (!vertical || !verticalPoints || !verticalPoints.length) {
    return null;
  }
  var items = verticalPoints.map((entry, i) => {
    var lineItemProps = _objectSpread(_objectSpread({}, props), {}, {
      x1: entry,
      y1: y,
      x2: entry,
      y2: y + height,
      key: "line-".concat(i),
      index: i
    });
    return renderLineItem(vertical, lineItemProps);
  });
  return /*#__PURE__*/_react.default.createElement("g", {
    className: "recharts-cartesian-grid-vertical"
  }, items);
}
function HorizontalStripes(props) {
  var {
    horizontalFill,
    fillOpacity,
    x,
    y,
    width,
    height,
    horizontalPoints,
    horizontal = true
  } = props;
  if (!horizontal || !horizontalFill || !horizontalFill.length) {
    return null;
  }

  // Why =y -y? I was trying to find any difference that this makes, with floating point numbers and edge cases but ... nothing.
  var roundedSortedHorizontalPoints = horizontalPoints.map(e => Math.round(e + y - y)).sort((a, b) => a - b);
  // Why is this condition `!==` instead of `<=` ?
  if (y !== roundedSortedHorizontalPoints[0]) {
    roundedSortedHorizontalPoints.unshift(0);
  }
  var items = roundedSortedHorizontalPoints.map((entry, i) => {
    // Why do we strip only the last stripe if it is invisible, and not all invisible stripes?
    var lastStripe = !roundedSortedHorizontalPoints[i + 1];
    var lineHeight = lastStripe ? y + height - entry : roundedSortedHorizontalPoints[i + 1] - entry;
    if (lineHeight <= 0) {
      return null;
    }
    var colorIndex = i % horizontalFill.length;
    return /*#__PURE__*/_react.default.createElement("rect", {
      key: "react-".concat(i) // eslint-disable-line react/no-array-index-key
      ,
      y: entry,
      x: x,
      height: lineHeight,
      width: width,
      stroke: "none",
      fill: horizontalFill[colorIndex],
      fillOpacity: fillOpacity,
      className: "recharts-cartesian-grid-bg"
    });
  });
  return /*#__PURE__*/_react.default.createElement("g", {
    className: "recharts-cartesian-gridstripes-horizontal"
  }, items);
}
function VerticalStripes(props) {
  var {
    vertical = true,
    verticalFill,
    fillOpacity,
    x,
    y,
    width,
    height,
    verticalPoints
  } = props;
  if (!vertical || !verticalFill || !verticalFill.length) {
    return null;
  }
  var roundedSortedVerticalPoints = verticalPoints.map(e => Math.round(e + x - x)).sort((a, b) => a - b);
  if (x !== roundedSortedVerticalPoints[0]) {
    roundedSortedVerticalPoints.unshift(0);
  }
  var items = roundedSortedVerticalPoints.map((entry, i) => {
    var lastStripe = !roundedSortedVerticalPoints[i + 1];
    var lineWidth = lastStripe ? x + width - entry : roundedSortedVerticalPoints[i + 1] - entry;
    if (lineWidth <= 0) {
      return null;
    }
    var colorIndex = i % verticalFill.length;
    return /*#__PURE__*/_react.default.createElement("rect", {
      key: "react-".concat(i) // eslint-disable-line react/no-array-index-key
      ,
      x: entry,
      y: y,
      width: lineWidth,
      height: height,
      stroke: "none",
      fill: verticalFill[colorIndex],
      fillOpacity: fillOpacity,
      className: "recharts-cartesian-grid-bg"
    });
  });
  return /*#__PURE__*/_react.default.createElement("g", {
    className: "recharts-cartesian-gridstripes-vertical"
  }, items);
}
var defaultVerticalCoordinatesGenerator = (_ref, syncWithTicks) => {
  var {
    xAxis,
    width,
    height,
    offset
  } = _ref;
  return (0, _ChartUtils.getCoordinatesOfGrid)((0, _getTicks.getTicks)(_objectSpread(_objectSpread(_objectSpread({}, _CartesianAxis.CartesianAxis.defaultProps), xAxis), {}, {
    ticks: (0, _ChartUtils.getTicksOfAxis)(xAxis, true),
    viewBox: {
      x: 0,
      y: 0,
      width,
      height
    }
  })), offset.left, offset.left + offset.width, syncWithTicks);
};
var defaultHorizontalCoordinatesGenerator = (_ref2, syncWithTicks) => {
  var {
    yAxis,
    width,
    height,
    offset
  } = _ref2;
  return (0, _ChartUtils.getCoordinatesOfGrid)((0, _getTicks.getTicks)(_objectSpread(_objectSpread(_objectSpread({}, _CartesianAxis.CartesianAxis.defaultProps), yAxis), {}, {
    ticks: (0, _ChartUtils.getTicksOfAxis)(yAxis, true),
    viewBox: {
      x: 0,
      y: 0,
      width,
      height
    }
  })), offset.top, offset.top + offset.height, syncWithTicks);
};
var defaultProps = {
  horizontal: true,
  vertical: true,
  // The ordinates of horizontal grid lines
  horizontalPoints: [],
  // The abscissas of vertical grid lines
  verticalPoints: [],
  stroke: '#ccc',
  fill: 'none',
  // The fill of colors of grid lines
  verticalFill: [],
  horizontalFill: []
};
function CartesianGrid(props) {
  var _props$stroke, _props$fill, _props$horizontal, _props$horizontalFill, _props$vertical, _props$verticalFill;
  var chartWidth = (0, _chartLayoutContext.useChartWidth)();
  var chartHeight = (0, _chartLayoutContext.useChartHeight)();
  var offset = (0, _chartLayoutContext.useOffset)();
  var propsIncludingDefaults = _objectSpread(_objectSpread({}, props), {}, {
    stroke: (_props$stroke = props.stroke) !== null && _props$stroke !== void 0 ? _props$stroke : defaultProps.stroke,
    fill: (_props$fill = props.fill) !== null && _props$fill !== void 0 ? _props$fill : defaultProps.fill,
    horizontal: (_props$horizontal = props.horizontal) !== null && _props$horizontal !== void 0 ? _props$horizontal : defaultProps.horizontal,
    horizontalFill: (_props$horizontalFill = props.horizontalFill) !== null && _props$horizontalFill !== void 0 ? _props$horizontalFill : defaultProps.horizontalFill,
    vertical: (_props$vertical = props.vertical) !== null && _props$vertical !== void 0 ? _props$vertical : defaultProps.vertical,
    verticalFill: (_props$verticalFill = props.verticalFill) !== null && _props$verticalFill !== void 0 ? _props$verticalFill : defaultProps.verticalFill,
    x: (0, _DataUtils.isNumber)(props.x) ? props.x : offset.left,
    y: (0, _DataUtils.isNumber)(props.y) ? props.y : offset.top,
    width: (0, _DataUtils.isNumber)(props.width) ? props.width : offset.width,
    height: (0, _DataUtils.isNumber)(props.height) ? props.height : offset.height
  });
  var {
    x,
    y,
    width,
    height,
    syncWithTicks,
    horizontalValues,
    verticalValues
  } = propsIncludingDefaults;

  // @ts-expect-error the scale prop is mixed up - we need to untagle this at some point
  var xAxis = (0, _chartLayoutContext.useArbitraryXAxis)();
  // @ts-expect-error the scale prop is mixed up - we need to untagle this at some point
  var yAxis = (0, _chartLayoutContext.useYAxisWithFiniteDomainOrRandom)();
  if (!(0, _DataUtils.isNumber)(width) || width <= 0 || !(0, _DataUtils.isNumber)(height) || height <= 0 || !(0, _DataUtils.isNumber)(x) || x !== +x || !(0, _DataUtils.isNumber)(y) || y !== +y) {
    return null;
  }

  /*
   * verticalCoordinatesGenerator and horizontalCoordinatesGenerator are defined
   * outside of the propsIncludingDefaults because they were never part of the original props
   * and they were never passed as a prop down to horizontal/vertical custom elements.
   * If we add these two to propsIncludingDefaults then we are changing public API.
   * Not a bad thing per se but also not necessary.
   */
  var verticalCoordinatesGenerator = propsIncludingDefaults.verticalCoordinatesGenerator || defaultVerticalCoordinatesGenerator;
  var horizontalCoordinatesGenerator = propsIncludingDefaults.horizontalCoordinatesGenerator || defaultHorizontalCoordinatesGenerator;
  var {
    horizontalPoints,
    verticalPoints
  } = propsIncludingDefaults;

  // No horizontal points are specified
  if ((!horizontalPoints || !horizontalPoints.length) && (0, _isFunction.default)(horizontalCoordinatesGenerator)) {
    var isHorizontalValues = horizontalValues && horizontalValues.length;
    var generatorResult = horizontalCoordinatesGenerator({
      yAxis: yAxis ? _objectSpread(_objectSpread({}, yAxis), {}, {
        ticks: isHorizontalValues ? horizontalValues : yAxis.ticks
      }) : undefined,
      width: chartWidth,
      height: chartHeight,
      offset
    }, isHorizontalValues ? true : syncWithTicks);
    (0, _LogUtils.warn)(Array.isArray(generatorResult), "horizontalCoordinatesGenerator should return Array but instead it returned [".concat(typeof generatorResult, "]"));
    if (Array.isArray(generatorResult)) {
      horizontalPoints = generatorResult;
    }
  }

  // No vertical points are specified
  if ((!verticalPoints || !verticalPoints.length) && (0, _isFunction.default)(verticalCoordinatesGenerator)) {
    var isVerticalValues = verticalValues && verticalValues.length;
    var _generatorResult = verticalCoordinatesGenerator({
      xAxis: xAxis ? _objectSpread(_objectSpread({}, xAxis), {}, {
        ticks: isVerticalValues ? verticalValues : xAxis.ticks
      }) : undefined,
      width: chartWidth,
      height: chartHeight,
      offset
    }, isVerticalValues ? true : syncWithTicks);
    (0, _LogUtils.warn)(Array.isArray(_generatorResult), "verticalCoordinatesGenerator should return Array but instead it returned [".concat(typeof _generatorResult, "]"));
    if (Array.isArray(_generatorResult)) {
      verticalPoints = _generatorResult;
    }
  }
  return /*#__PURE__*/_react.default.createElement("g", {
    className: "recharts-cartesian-grid"
  }, /*#__PURE__*/_react.default.createElement(Background, {
    fill: propsIncludingDefaults.fill,
    fillOpacity: propsIncludingDefaults.fillOpacity,
    x: propsIncludingDefaults.x,
    y: propsIncludingDefaults.y,
    width: propsIncludingDefaults.width,
    height: propsIncludingDefaults.height
  }), /*#__PURE__*/_react.default.createElement(HorizontalGridLines, _extends({}, propsIncludingDefaults, {
    offset: offset,
    horizontalPoints: horizontalPoints,
    xAxis: xAxis,
    yAxis: yAxis
  })), /*#__PURE__*/_react.default.createElement(VerticalGridLines, _extends({}, propsIncludingDefaults, {
    offset: offset,
    verticalPoints: verticalPoints,
    xAxis: xAxis,
    yAxis: yAxis
  })), /*#__PURE__*/_react.default.createElement(HorizontalStripes, _extends({}, propsIncludingDefaults, {
    horizontalPoints: horizontalPoints
  })), /*#__PURE__*/_react.default.createElement(VerticalStripes, _extends({}, propsIncludingDefaults, {
    verticalPoints: verticalPoints
  })));
}
CartesianGrid.displayName = 'CartesianGrid';