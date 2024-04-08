"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDataIndex = exports.useChartData = exports.DataEndIndexContextProvider = exports.DataStartIndexContextProvider = exports.ChartDataContextProvider = void 0;
const react_1 = require("react");
const ChartDataContext = (0, react_1.createContext)(undefined);
const DataStartIndexContext = (0, react_1.createContext)(0);
const DataEndIndexContext = (0, react_1.createContext)(0);
exports.ChartDataContextProvider = ChartDataContext.Provider;
exports.DataStartIndexContextProvider = DataStartIndexContext.Provider;
exports.DataEndIndexContextProvider = DataEndIndexContext.Provider;
const useChartData = () => (0, react_1.useContext)(ChartDataContext);
exports.useChartData = useChartData;
const useDataIndex = () => {
    const startIndex = (0, react_1.useContext)(DataStartIndexContext);
    const endIndex = (0, react_1.useContext)(DataEndIndexContext);
    return { startIndex, endIndex };
};
exports.useDataIndex = useDataIndex;
//# sourceMappingURL=chartDataContext.js.map