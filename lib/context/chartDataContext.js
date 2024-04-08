"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useDataIndex = exports.useChartData = exports.DataStartIndexContextProvider = exports.DataEndIndexContextProvider = exports.ChartDataContextProvider = void 0;
var _react = require("react");
var ChartDataContext = /*#__PURE__*/(0, _react.createContext)(undefined);
var DataStartIndexContext = /*#__PURE__*/(0, _react.createContext)(0);
var DataEndIndexContext = /*#__PURE__*/(0, _react.createContext)(0);
var ChartDataContextProvider = exports.ChartDataContextProvider = ChartDataContext.Provider;
var DataStartIndexContextProvider = exports.DataStartIndexContextProvider = DataStartIndexContext.Provider;
var DataEndIndexContextProvider = exports.DataEndIndexContextProvider = DataEndIndexContext.Provider;

/**
 * "data" is the data of the chart - it has no type because this part of recharts is very flexible.
 * Basically it's an array of "something" and then there's the dataKey property in various places
 * that's meant to pull other things away from the data.
 *
 * Some charts have `data` defined on the chart root, and they will return the array through this hook.
 * For example: <ComposedChart data={data} />.
 *
 * Other charts, such as Pie, have data defined on individual graphical elements.
 * These charts will return `undefined` through this hook, and you need to read the data from children.
 * For example: <PieChart><Pie data={data} />
 *
 * Some charts also allow setting both - data on the parent, and data on the children at the same time!
 *
 * @return data array for some charts and undefined for other
 */
var useChartData = () => (0, _react.useContext)(ChartDataContext);

/**
 * startIndex and endIndex are data boundaries, set through Brush.
 *
 * @return object with startIndex and endIndex
 */
exports.useChartData = useChartData;
var useDataIndex = () => {
  var startIndex = (0, _react.useContext)(DataStartIndexContext);
  var endIndex = (0, _react.useContext)(DataEndIndexContext);
  return {
    startIndex,
    endIndex
  };
};
exports.useDataIndex = useDataIndex;