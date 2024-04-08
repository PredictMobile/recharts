"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useYAxisWithFiniteDomainOrRandom = exports.useYAxisOrThrow = exports.useXAxisOrThrow = exports.useViewBox = exports.useUpdateId = exports.useOffset = exports.useMaybeYAxis = exports.useMaybeXAxis = exports.useMaybePolarRadiusAxis = exports.useMaybePolarAngleAxis = exports.useMargin = exports.useClipPathId = exports.useChartWidth = exports.useChartHeight = exports.useArbitraryYAxis = exports.useArbitraryXAxis = exports.useArbitraryPolarRadiusAxis = exports.useArbitraryPolarAngleAxis = exports.YAxisContext = exports.XAxisContext = exports.ViewBoxContext = exports.PolarRadiusAxisContext = exports.PolarAngleAxisContext = exports.OffsetContext = exports.MarginContext = exports.ClipPathIdContext = exports.ChartWidthContext = exports.ChartLayoutContextProvider = exports.ChartHeightContext = void 0;
var _react = _interopRequireWildcard(require("react"));
var _tinyInvariant = _interopRequireDefault(require("tiny-invariant"));
var _find = _interopRequireDefault(require("lodash/find"));
var _every = _interopRequireDefault(require("lodash/every"));
var _calculateViewBox = require("../util/calculateViewBox");
var _DataUtils = require("../util/DataUtils");
var _legendPayloadContext = require("./legendPayloadContext");
var _tooltipContext = require("./tooltipContext");
var _chartDataContext = require("./chartDataContext");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
var XAxisContext = exports.XAxisContext = /*#__PURE__*/(0, _react.createContext)(undefined);
var YAxisContext = exports.YAxisContext = /*#__PURE__*/(0, _react.createContext)(undefined);
var PolarAngleAxisContext = exports.PolarAngleAxisContext = /*#__PURE__*/(0, _react.createContext)(undefined);
var PolarRadiusAxisContext = exports.PolarRadiusAxisContext = /*#__PURE__*/(0, _react.createContext)(undefined);
var ViewBoxContext = exports.ViewBoxContext = /*#__PURE__*/(0, _react.createContext)(undefined);
var OffsetContext = exports.OffsetContext = /*#__PURE__*/(0, _react.createContext)({});
var ClipPathIdContext = exports.ClipPathIdContext = /*#__PURE__*/(0, _react.createContext)(undefined);
var ChartHeightContext = exports.ChartHeightContext = /*#__PURE__*/(0, _react.createContext)(0);
var ChartWidthContext = exports.ChartWidthContext = /*#__PURE__*/(0, _react.createContext)(0);
var MarginContext = exports.MarginContext = /*#__PURE__*/(0, _react.createContext)({
  top: 5,
  right: 5,
  bottom: 5,
  left: 5
});

// is the updateId necessary? Can we do without? Perhaps hook dependencies are better than explicit updateId.
var UpdateIdContext = /*#__PURE__*/(0, _react.createContext)(0);
/**
 * Will add all the properties required to render all individual Recharts components into a React Context.
 *
 * If you want to read these properties, see the collection of hooks exported from this file.
 *
 * @param {object} props CategoricalChartState, plus children
 * @returns React Context Provider
 */
var ChartLayoutContextProvider = props => {
  var {
    state: {
      xAxisMap,
      yAxisMap,
      angleAxisMap,
      radiusAxisMap,
      offset,
      activeLabel,
      activePayload,
      isTooltipActive,
      activeCoordinate,
      dataStartIndex,
      dataEndIndex,
      updateId,
      activeTooltipIndex
    },
    clipPathId,
    children,
    width,
    height,
    margin
  } = props;

  /**
   * Perhaps we should compute this property when reading? Let's see what is more often used
   */
  var viewBox = (0, _calculateViewBox.calculateViewBox)(offset);
  var tooltipContextValue = {
    label: activeLabel,
    payload: activePayload,
    coordinate: activeCoordinate,
    active: isTooltipActive,
    index: activeTooltipIndex
  };

  /*
   * This pretends to be a single context but actually is split into multiple smaller ones.
   * Why?
   * Because one React Context only allows to set one value.
   * But we need to set multiple values.
   * If we do that with one context, then we force re-render on components that might not even be interested
   * in the part of the state that has changed.
   *
   * By splitting into smaller contexts, we allow each components to be optimized and only re-render when its dependencies change.
   *
   * To actually achieve the optimal re-render, it is necessary to use React.memo().
   * See the test file for details.
   */
  return /*#__PURE__*/_react.default.createElement(UpdateIdContext.Provider, {
    value: updateId
  }, /*#__PURE__*/_react.default.createElement(_chartDataContext.DataStartIndexContextProvider, {
    value: dataStartIndex
  }, /*#__PURE__*/_react.default.createElement(_chartDataContext.DataEndIndexContextProvider, {
    value: dataEndIndex
  }, /*#__PURE__*/_react.default.createElement(MarginContext.Provider, {
    value: margin
  }, /*#__PURE__*/_react.default.createElement(_legendPayloadContext.LegendPayloadProvider, null, /*#__PURE__*/_react.default.createElement(XAxisContext.Provider, {
    value: xAxisMap
  }, /*#__PURE__*/_react.default.createElement(YAxisContext.Provider, {
    value: yAxisMap
  }, /*#__PURE__*/_react.default.createElement(PolarAngleAxisContext.Provider, {
    value: angleAxisMap
  }, /*#__PURE__*/_react.default.createElement(PolarRadiusAxisContext.Provider, {
    value: radiusAxisMap
  }, /*#__PURE__*/_react.default.createElement(OffsetContext.Provider, {
    value: offset
  }, /*#__PURE__*/_react.default.createElement(ViewBoxContext.Provider, {
    value: viewBox
  }, /*#__PURE__*/_react.default.createElement(ClipPathIdContext.Provider, {
    value: clipPathId
  }, /*#__PURE__*/_react.default.createElement(ChartHeightContext.Provider, {
    value: height
  }, /*#__PURE__*/_react.default.createElement(ChartWidthContext.Provider, {
    value: width
  }, /*#__PURE__*/_react.default.createElement(_tooltipContext.TooltipContextProvider, {
    value: tooltipContextValue
  }, children)))))))))))))));
};
exports.ChartLayoutContextProvider = ChartLayoutContextProvider;
var useClipPathId = () => {
  return (0, _react.useContext)(ClipPathIdContext);
};
exports.useClipPathId = useClipPathId;
function getKeysForDebug(object) {
  var keys = Object.keys(object);
  if (keys.length === 0) {
    return 'There are no available ids.';
  }
  return "Available ids are: ".concat(keys, ".");
}

/**
 * This either finds and returns Axis by the specified ID, or throws an exception if an axis with this ID does not exist.
 *
 * @param xAxisId identifier of the axis - it's either autogenerated ('0'), or passed via `id` prop as <XAxis id='foo' />
 * @returns axis configuration object
 * @throws Error if no axis with this ID exists
 */
var useXAxisOrThrow = xAxisId => {
  var xAxisMap = (0, _react.useContext)(XAxisContext);
  !(xAxisMap != null) ? process.env.NODE_ENV !== "production" ? (0, _tinyInvariant.default)(false, 'Could not find Recharts context; are you sure this is rendered inside a Recharts wrapper component?') : (0, _tinyInvariant.default)(false) : void 0;
  var xAxis = xAxisMap[xAxisId];
  !(xAxis != null) ? process.env.NODE_ENV !== "production" ? (0, _tinyInvariant.default)(false, "Could not find xAxis by id \"".concat(xAxisId, "\" [").concat(typeof xAxisId, "]. ").concat(getKeysForDebug(xAxisMap))) : (0, _tinyInvariant.default)(false) : void 0;
  return xAxis;
};

/**
 * This either finds and returns Axis by the specified ID, or returns undefined if an axis with this ID does not exist.
 *
 * @param xAxisId identifier of the axis - it's either autogenerated ('0'), or passed via `id` prop as <XAxis id='foo' />
 * @returns axis configuration object, or undefined
 */
exports.useXAxisOrThrow = useXAxisOrThrow;
var useMaybeXAxis = xAxisId => {
  var xAxisMap = (0, _react.useContext)(XAxisContext);
  return xAxisMap === null || xAxisMap === void 0 ? void 0 : xAxisMap[xAxisId];
};

/**
 * This will find an arbitrary first XAxis. If there's exactly one it always returns that one
 * - but if there are multiple then it can return any of those.
 *
 * If you want specific XAxis out of multiple then prefer using useXAxisOrThrow
 *
 * @returns X axisOptions, or undefined - if there are no X axes
 */
exports.useMaybeXAxis = useMaybeXAxis;
var useArbitraryXAxis = () => {
  var xAxisMap = (0, _react.useContext)(XAxisContext);
  return (0, _DataUtils.getAnyElementOfObject)(xAxisMap);
};

/**
 * This will find an arbitrary first YAxis. If there's exactly one it always returns that one
 * - but if there are multiple then it can return any of those.
 *
 * If you want specific YAxis out of multiple then prefer using useYAxisOrThrow
 *
 * @returns Y axisOptions, or undefined - if there are no Y axes
 */
exports.useArbitraryXAxis = useArbitraryXAxis;
var useArbitraryYAxis = () => {
  var yAxisMap = (0, _react.useContext)(YAxisContext);
  return (0, _DataUtils.getAnyElementOfObject)(yAxisMap);
};

/**
 * This hooks will:
 * 1st attempt to find an YAxis that has all elements in its domain finite
 * If no such axis exists, it will return an arbitrary YAxis
 * if there are no Y axes then it returns undefined
 *
 * @returns Either Y axisOptions, or undefined if there are no Y axes
 */
exports.useArbitraryYAxis = useArbitraryYAxis;
var useYAxisWithFiniteDomainOrRandom = () => {
  var yAxisMap = (0, _react.useContext)(YAxisContext);
  var yAxisWithFiniteDomain = (0, _find.default)(yAxisMap, axis => (0, _every.default)(axis.domain, Number.isFinite));
  return yAxisWithFiniteDomain || (0, _DataUtils.getAnyElementOfObject)(yAxisMap);
};

/**
 * This either finds and returns Axis by the specified ID, or throws an exception if an axis with this ID does not exist.
 *
 * @param yAxisId identifier of the axis - it's either autogenerated ('0'), or passed via `id` prop as <YAxis id='foo' />
 * @returns axis configuration object
 * @throws Error if no axis with this ID exists
 */
exports.useYAxisWithFiniteDomainOrRandom = useYAxisWithFiniteDomainOrRandom;
var useYAxisOrThrow = yAxisId => {
  var yAxisMap = (0, _react.useContext)(YAxisContext);
  !(yAxisMap != null) ? process.env.NODE_ENV !== "production" ? (0, _tinyInvariant.default)(false, 'Could not find Recharts context; are you sure this is rendered inside a Recharts wrapper component?') : (0, _tinyInvariant.default)(false) : void 0;
  var yAxis = yAxisMap[yAxisId];
  !(yAxis != null) ? process.env.NODE_ENV !== "production" ? (0, _tinyInvariant.default)(false, "Could not find yAxis by id \"".concat(yAxisId, "\" [").concat(typeof yAxisId, "]. ").concat(getKeysForDebug(yAxisMap))) : (0, _tinyInvariant.default)(false) : void 0;
  return yAxis;
};

/**
 * This either finds and returns Axis by the specified ID, or returns undefined if an axis with this ID does not exist.
 *
 * @param yAxisId identifier of the axis - it's either autogenerated ('0'), or passed via `id` prop as <YAxis id='foo' />
 * @returns axis configuration object, or undefined
 */
exports.useYAxisOrThrow = useYAxisOrThrow;
var useMaybeYAxis = yAxisId => {
  var yAxisMap = (0, _react.useContext)(YAxisContext);
  return yAxisMap === null || yAxisMap === void 0 ? void 0 : yAxisMap[yAxisId];
};

/**
 * This either finds and returns Axis by the specified ID, or returns undefined if an axis with this ID does not exist.
 *
 * @param axisId identifier of the axis - it's either autogenerated ('0'), or passed via `id` prop as <PolarAngleAxis id='foo' />
 * @returns axis configuration object, or undefined
 */
exports.useMaybeYAxis = useMaybeYAxis;
var useMaybePolarAngleAxis = axisId => {
  var polarAngleAxisMap = (0, _react.useContext)(PolarAngleAxisContext);
  return polarAngleAxisMap === null || polarAngleAxisMap === void 0 ? void 0 : polarAngleAxisMap[axisId];
};

/**
 * This will find an arbitrary first PolarAngleAxis. If there's exactly one it always returns that one
 * - but if there are multiple then it can return any of those.
 *
 * @returns polarAngle axisOptions, or undefined - if there are no PolarAngleAxes
 */
exports.useMaybePolarAngleAxis = useMaybePolarAngleAxis;
var useArbitraryPolarAngleAxis = () => {
  var polarAngleAxisMap = (0, _react.useContext)(PolarAngleAxisContext);
  return (0, _DataUtils.getAnyElementOfObject)(polarAngleAxisMap);
};

/**
 * This either finds and returns Axis by the specified ID, or returns undefined if an axis with this ID does not exist.
 *
 * @param axisId identifier of the axis - it's either autogenerated ('0'), or passed via `id` prop as <PolarRadiusAxis id='foo' />
 * @returns axis configuration object, or undefined
 */
exports.useArbitraryPolarAngleAxis = useArbitraryPolarAngleAxis;
var useMaybePolarRadiusAxis = axisId => {
  var polarRadiusAxisMap = (0, _react.useContext)(PolarRadiusAxisContext);
  return polarRadiusAxisMap === null || polarRadiusAxisMap === void 0 ? void 0 : polarRadiusAxisMap[axisId];
};

/**
 * This will find an arbitrary first PolarRadiusAxis . If there's exactly one it always returns that one
 * - but if there are multiple then it can return any of those.
 *
 * @returns polarAngle axisOptions, or undefined - if there are no PolarRadiusAxes
 */
exports.useMaybePolarRadiusAxis = useMaybePolarRadiusAxis;
var useArbitraryPolarRadiusAxis = () => {
  var polarRadiusAxisMap = (0, _react.useContext)(PolarRadiusAxisContext);
  return (0, _DataUtils.getAnyElementOfObject)(polarRadiusAxisMap);
};
exports.useArbitraryPolarRadiusAxis = useArbitraryPolarRadiusAxis;
var useViewBox = () => {
  return (0, _react.useContext)(ViewBoxContext);
};
exports.useViewBox = useViewBox;
var useOffset = () => {
  return (0, _react.useContext)(OffsetContext);
};
exports.useOffset = useOffset;
var useChartWidth = () => {
  return (0, _react.useContext)(ChartWidthContext);
};
exports.useChartWidth = useChartWidth;
var useChartHeight = () => {
  return (0, _react.useContext)(ChartHeightContext);
};
exports.useChartHeight = useChartHeight;
var useMargin = () => {
  return (0, _react.useContext)(MarginContext);
};
exports.useMargin = useMargin;
var useUpdateId = () => "brush-".concat((0, _react.useContext)(UpdateIdContext));
exports.useUpdateId = useUpdateId;