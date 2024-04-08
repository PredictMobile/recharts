"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUpdateId = exports.useMargin = exports.useChartHeight = exports.useChartWidth = exports.useOffset = exports.useViewBox = exports.useArbitraryPolarRadiusAxis = exports.useMaybePolarRadiusAxis = exports.useArbitraryPolarAngleAxis = exports.useMaybePolarAngleAxis = exports.useMaybeYAxis = exports.useYAxisOrThrow = exports.useYAxisWithFiniteDomainOrRandom = exports.useArbitraryYAxis = exports.useArbitraryXAxis = exports.useMaybeXAxis = exports.useXAxisOrThrow = exports.useClipPathId = exports.ChartLayoutContextProvider = exports.MarginContext = exports.ChartWidthContext = exports.ChartHeightContext = exports.ClipPathIdContext = exports.OffsetContext = exports.ViewBoxContext = exports.PolarRadiusAxisContext = exports.PolarAngleAxisContext = exports.YAxisContext = exports.XAxisContext = void 0;
const react_1 = __importStar(require("react"));
const tiny_invariant_1 = __importDefault(require("tiny-invariant"));
const find_1 = __importDefault(require("lodash/find"));
const every_1 = __importDefault(require("lodash/every"));
const calculateViewBox_1 = require("../util/calculateViewBox");
const DataUtils_1 = require("../util/DataUtils");
const legendPayloadContext_1 = require("./legendPayloadContext");
const tooltipContext_1 = require("./tooltipContext");
const chartDataContext_1 = require("./chartDataContext");
exports.XAxisContext = (0, react_1.createContext)(undefined);
exports.YAxisContext = (0, react_1.createContext)(undefined);
exports.PolarAngleAxisContext = (0, react_1.createContext)(undefined);
exports.PolarRadiusAxisContext = (0, react_1.createContext)(undefined);
exports.ViewBoxContext = (0, react_1.createContext)(undefined);
exports.OffsetContext = (0, react_1.createContext)({});
exports.ClipPathIdContext = (0, react_1.createContext)(undefined);
exports.ChartHeightContext = (0, react_1.createContext)(0);
exports.ChartWidthContext = (0, react_1.createContext)(0);
exports.MarginContext = (0, react_1.createContext)({ top: 5, right: 5, bottom: 5, left: 5 });
const UpdateIdContext = (0, react_1.createContext)(0);
const ChartLayoutContextProvider = (props) => {
    const { state: { xAxisMap, yAxisMap, angleAxisMap, radiusAxisMap, offset, activeLabel, activePayload, isTooltipActive, activeCoordinate, dataStartIndex, dataEndIndex, updateId, activeTooltipIndex, }, clipPathId, children, width, height, margin, } = props;
    const viewBox = (0, calculateViewBox_1.calculateViewBox)(offset);
    const tooltipContextValue = {
        label: activeLabel,
        payload: activePayload,
        coordinate: activeCoordinate,
        active: isTooltipActive,
        index: activeTooltipIndex,
    };
    return (react_1.default.createElement(UpdateIdContext.Provider, { value: updateId },
        react_1.default.createElement(chartDataContext_1.DataStartIndexContextProvider, { value: dataStartIndex },
            react_1.default.createElement(chartDataContext_1.DataEndIndexContextProvider, { value: dataEndIndex },
                react_1.default.createElement(exports.MarginContext.Provider, { value: margin },
                    react_1.default.createElement(legendPayloadContext_1.LegendPayloadProvider, null,
                        react_1.default.createElement(exports.XAxisContext.Provider, { value: xAxisMap },
                            react_1.default.createElement(exports.YAxisContext.Provider, { value: yAxisMap },
                                react_1.default.createElement(exports.PolarAngleAxisContext.Provider, { value: angleAxisMap },
                                    react_1.default.createElement(exports.PolarRadiusAxisContext.Provider, { value: radiusAxisMap },
                                        react_1.default.createElement(exports.OffsetContext.Provider, { value: offset },
                                            react_1.default.createElement(exports.ViewBoxContext.Provider, { value: viewBox },
                                                react_1.default.createElement(exports.ClipPathIdContext.Provider, { value: clipPathId },
                                                    react_1.default.createElement(exports.ChartHeightContext.Provider, { value: height },
                                                        react_1.default.createElement(exports.ChartWidthContext.Provider, { value: width },
                                                            react_1.default.createElement(tooltipContext_1.TooltipContextProvider, { value: tooltipContextValue }, children))))))))))))))));
};
exports.ChartLayoutContextProvider = ChartLayoutContextProvider;
const useClipPathId = () => {
    return (0, react_1.useContext)(exports.ClipPathIdContext);
};
exports.useClipPathId = useClipPathId;
function getKeysForDebug(object) {
    const keys = Object.keys(object);
    if (keys.length === 0) {
        return 'There are no available ids.';
    }
    return `Available ids are: ${keys}.`;
}
const useXAxisOrThrow = (xAxisId) => {
    const xAxisMap = (0, react_1.useContext)(exports.XAxisContext);
    (0, tiny_invariant_1.default)(xAxisMap != null, 'Could not find Recharts context; are you sure this is rendered inside a Recharts wrapper component?');
    const xAxis = xAxisMap[xAxisId];
    (0, tiny_invariant_1.default)(xAxis != null, `Could not find xAxis by id "${xAxisId}" [${typeof xAxisId}]. ${getKeysForDebug(xAxisMap)}`);
    return xAxis;
};
exports.useXAxisOrThrow = useXAxisOrThrow;
const useMaybeXAxis = (xAxisId) => {
    const xAxisMap = (0, react_1.useContext)(exports.XAxisContext);
    return xAxisMap === null || xAxisMap === void 0 ? void 0 : xAxisMap[xAxisId];
};
exports.useMaybeXAxis = useMaybeXAxis;
const useArbitraryXAxis = () => {
    const xAxisMap = (0, react_1.useContext)(exports.XAxisContext);
    return (0, DataUtils_1.getAnyElementOfObject)(xAxisMap);
};
exports.useArbitraryXAxis = useArbitraryXAxis;
const useArbitraryYAxis = () => {
    const yAxisMap = (0, react_1.useContext)(exports.YAxisContext);
    return (0, DataUtils_1.getAnyElementOfObject)(yAxisMap);
};
exports.useArbitraryYAxis = useArbitraryYAxis;
const useYAxisWithFiniteDomainOrRandom = () => {
    const yAxisMap = (0, react_1.useContext)(exports.YAxisContext);
    const yAxisWithFiniteDomain = (0, find_1.default)(yAxisMap, axis => (0, every_1.default)(axis.domain, Number.isFinite));
    return yAxisWithFiniteDomain || (0, DataUtils_1.getAnyElementOfObject)(yAxisMap);
};
exports.useYAxisWithFiniteDomainOrRandom = useYAxisWithFiniteDomainOrRandom;
const useYAxisOrThrow = (yAxisId) => {
    const yAxisMap = (0, react_1.useContext)(exports.YAxisContext);
    (0, tiny_invariant_1.default)(yAxisMap != null, 'Could not find Recharts context; are you sure this is rendered inside a Recharts wrapper component?');
    const yAxis = yAxisMap[yAxisId];
    (0, tiny_invariant_1.default)(yAxis != null, `Could not find yAxis by id "${yAxisId}" [${typeof yAxisId}]. ${getKeysForDebug(yAxisMap)}`);
    return yAxis;
};
exports.useYAxisOrThrow = useYAxisOrThrow;
const useMaybeYAxis = (yAxisId) => {
    const yAxisMap = (0, react_1.useContext)(exports.YAxisContext);
    return yAxisMap === null || yAxisMap === void 0 ? void 0 : yAxisMap[yAxisId];
};
exports.useMaybeYAxis = useMaybeYAxis;
const useMaybePolarAngleAxis = (axisId) => {
    const polarAngleAxisMap = (0, react_1.useContext)(exports.PolarAngleAxisContext);
    return polarAngleAxisMap === null || polarAngleAxisMap === void 0 ? void 0 : polarAngleAxisMap[axisId];
};
exports.useMaybePolarAngleAxis = useMaybePolarAngleAxis;
const useArbitraryPolarAngleAxis = () => {
    const polarAngleAxisMap = (0, react_1.useContext)(exports.PolarAngleAxisContext);
    return (0, DataUtils_1.getAnyElementOfObject)(polarAngleAxisMap);
};
exports.useArbitraryPolarAngleAxis = useArbitraryPolarAngleAxis;
const useMaybePolarRadiusAxis = (axisId) => {
    const polarRadiusAxisMap = (0, react_1.useContext)(exports.PolarRadiusAxisContext);
    return polarRadiusAxisMap === null || polarRadiusAxisMap === void 0 ? void 0 : polarRadiusAxisMap[axisId];
};
exports.useMaybePolarRadiusAxis = useMaybePolarRadiusAxis;
const useArbitraryPolarRadiusAxis = () => {
    const polarRadiusAxisMap = (0, react_1.useContext)(exports.PolarRadiusAxisContext);
    return (0, DataUtils_1.getAnyElementOfObject)(polarRadiusAxisMap);
};
exports.useArbitraryPolarRadiusAxis = useArbitraryPolarRadiusAxis;
const useViewBox = () => {
    return (0, react_1.useContext)(exports.ViewBoxContext);
};
exports.useViewBox = useViewBox;
const useOffset = () => {
    return (0, react_1.useContext)(exports.OffsetContext);
};
exports.useOffset = useOffset;
const useChartWidth = () => {
    return (0, react_1.useContext)(exports.ChartWidthContext);
};
exports.useChartWidth = useChartWidth;
const useChartHeight = () => {
    return (0, react_1.useContext)(exports.ChartHeightContext);
};
exports.useChartHeight = useChartHeight;
const useMargin = () => {
    return (0, react_1.useContext)(exports.MarginContext);
};
exports.useMargin = useMargin;
const useUpdateId = () => `brush-${(0, react_1.useContext)(UpdateIdContext)}`;
exports.useUpdateId = useUpdateId;
//# sourceMappingURL=chartLayoutContext.js.map