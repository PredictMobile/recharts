"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PolarGrid = void 0;
var _clsx = _interopRequireDefault(require("clsx"));
var _react = _interopRequireDefault(require("react"));
var _ChartUtils = require("../util/ChartUtils");
var _chartLayoutContext = require("../context/chartLayoutContext");
var _PolarUtils = require("../util/PolarUtils");
var _ReactUtils = require("../util/ReactUtils");
var _excluded = ["gridType", "radialLines"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var getPolygonPath = (radius, cx, cy, polarAngles) => {
  var path = '';
  polarAngles.forEach((angle, i) => {
    var point = (0, _PolarUtils.polarToCartesian)(cx, cy, radius, angle);
    if (i) {
      path += "L ".concat(point.x, ",").concat(point.y);
    } else {
      path += "M ".concat(point.x, ",").concat(point.y);
    }
  });
  path += 'Z';
  return path;
};

// Draw axis of radial line
var PolarAngles = props => {
  var {
    cx,
    cy,
    innerRadius,
    outerRadius,
    polarAngles,
    radialLines
  } = props;
  if (!polarAngles || !polarAngles.length || !radialLines) {
    return null;
  }
  var polarAnglesProps = _objectSpread({
    stroke: '#ccc'
  }, (0, _ReactUtils.filterProps)(props, false));
  return /*#__PURE__*/_react.default.createElement("g", {
    className: "recharts-polar-grid-angle"
  }, polarAngles.map(entry => {
    var start = (0, _PolarUtils.polarToCartesian)(cx, cy, innerRadius, entry);
    var end = (0, _PolarUtils.polarToCartesian)(cx, cy, outerRadius, entry);
    return /*#__PURE__*/_react.default.createElement("line", _extends({}, polarAnglesProps, {
      key: "line-".concat(entry),
      x1: start.x,
      y1: start.y,
      x2: end.x,
      y2: end.y
    }));
  }));
};

// Draw concentric circles
var ConcentricCircle = props => {
  var {
    cx,
    cy,
    radius,
    index
  } = props;
  var concentricCircleProps = _objectSpread(_objectSpread({
    stroke: '#ccc'
  }, (0, _ReactUtils.filterProps)(props, false)), {}, {
    fill: 'none'
  });
  return /*#__PURE__*/_react.default.createElement("circle", _extends({}, concentricCircleProps, {
    className: (0, _clsx.default)('recharts-polar-grid-concentric-circle', props.className),
    key: "circle-".concat(index),
    cx: cx,
    cy: cy,
    r: radius
  }));
};

// Draw concentric polygons
var ConcentricPolygon = props => {
  var {
    radius,
    index
  } = props;
  var concentricPolygonProps = _objectSpread(_objectSpread({
    stroke: '#ccc'
  }, (0, _ReactUtils.filterProps)(props, false)), {}, {
    fill: 'none'
  });
  return /*#__PURE__*/_react.default.createElement("path", _extends({}, concentricPolygonProps, {
    className: (0, _clsx.default)('recharts-polar-grid-concentric-polygon', props.className),
    key: "path-".concat(index),
    d: getPolygonPath(radius, props.cx, props.cy, props.polarAngles)
  }));
};

// Draw concentric axis
var ConcentricGridPath = props => {
  var {
    polarRadius,
    gridType
  } = props;
  if (!polarRadius || !polarRadius.length) {
    return null;
  }
  return /*#__PURE__*/_react.default.createElement("g", {
    className: "recharts-polar-grid-concentric"
  }, polarRadius.map((entry, i) => {
    var key = i;
    if (gridType === 'circle') return /*#__PURE__*/_react.default.createElement(ConcentricCircle, _extends({
      key: key
    }, props, {
      radius: entry,
      index: i
    }));
    return /*#__PURE__*/_react.default.createElement(ConcentricPolygon, _extends({
      key: key
    }, props, {
      radius: entry,
      index: i
    }));
  }));
};
var PolarGrid = _ref => {
  var _angleAxis$cx, _angleAxis$cy, _angleAxis$innerRadiu, _angleAxis$outerRadiu, _getTicksOfAxis, _getTicksOfAxis2;
  var {
      gridType = 'polygon',
      radialLines = true
    } = _ref,
    inputs = _objectWithoutProperties(_ref, _excluded);
  var angleAxis = (0, _chartLayoutContext.useArbitraryPolarAngleAxis)();
  var radiusAxis = (0, _chartLayoutContext.useArbitraryPolarRadiusAxis)();
  var props = _objectSpread({
    cx: (_angleAxis$cx = angleAxis === null || angleAxis === void 0 ? void 0 : angleAxis.cx) !== null && _angleAxis$cx !== void 0 ? _angleAxis$cx : 0,
    cy: (_angleAxis$cy = angleAxis === null || angleAxis === void 0 ? void 0 : angleAxis.cy) !== null && _angleAxis$cy !== void 0 ? _angleAxis$cy : 0,
    // @ts-expect-error innerRadius is not defined on PolarAngleAxisProps, but it was cloned from there previously
    innerRadius: (_angleAxis$innerRadiu = angleAxis === null || angleAxis === void 0 ? void 0 : angleAxis.innerRadius) !== null && _angleAxis$innerRadiu !== void 0 ? _angleAxis$innerRadiu : 0,
    // @ts-expect-error outerRadius is not defined on PolarAngleAxisProps, but it was cloned from there previously
    outerRadius: (_angleAxis$outerRadiu = angleAxis === null || angleAxis === void 0 ? void 0 : angleAxis.outerRadius) !== null && _angleAxis$outerRadiu !== void 0 ? _angleAxis$outerRadiu : 0
  }, inputs);
  var {
    polarAngles: polarAnglesInput,
    polarRadius: polarRadiusInput,
    cx,
    cy,
    innerRadius,
    outerRadius
  } = props;
  if (outerRadius <= 0) {
    return null;
  }
  var polarAngles = Array.isArray(polarAnglesInput) ? polarAnglesInput : (_getTicksOfAxis = (0, _ChartUtils.getTicksOfAxis)(angleAxis, true)) === null || _getTicksOfAxis === void 0 ? void 0 : _getTicksOfAxis.map(entry => entry.coordinate);
  var polarRadius = Array.isArray(polarRadiusInput) ? polarRadiusInput : (_getTicksOfAxis2 = (0, _ChartUtils.getTicksOfAxis)(radiusAxis, true)) === null || _getTicksOfAxis2 === void 0 ? void 0 : _getTicksOfAxis2.map(entry => entry.coordinate);
  return /*#__PURE__*/_react.default.createElement("g", {
    className: "recharts-polar-grid"
  }, /*#__PURE__*/_react.default.createElement(PolarAngles, _extends({
    cx: cx,
    cy: cy,
    innerRadius: innerRadius,
    outerRadius: outerRadius,
    gridType: gridType,
    radialLines: radialLines
  }, props, {
    polarAngles: polarAngles,
    polarRadius: polarRadius
  })), /*#__PURE__*/_react.default.createElement(ConcentricGridPath, _extends({
    cx: cx,
    cy: cy,
    innerRadius: innerRadius,
    outerRadius: outerRadius,
    gridType: gridType,
    radialLines: radialLines
  }, props, {
    polarAngles: polarAngles,
    polarRadius: polarRadius
  })));
};
exports.PolarGrid = PolarGrid;
PolarGrid.displayName = 'PolarGrid';