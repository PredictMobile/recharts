"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.YAxis = void 0;
const react_1 = __importDefault(require("react"));
const clsx_1 = __importDefault(require("clsx"));
const chartLayoutContext_1 = require("../context/chartLayoutContext");
const CartesianAxis_1 = require("./CartesianAxis");
const ChartUtils_1 = require("../util/ChartUtils");
const YAxis = ({ yAxisId }) => {
    const width = (0, chartLayoutContext_1.useChartWidth)();
    const height = (0, chartLayoutContext_1.useChartHeight)();
    const axisOptions = (0, chartLayoutContext_1.useYAxisOrThrow)(yAxisId);
    if (axisOptions == null) {
        return null;
    }
    return (react_1.default.createElement(CartesianAxis_1.CartesianAxis, Object.assign({}, axisOptions, { className: (0, clsx_1.default)(`recharts-${axisOptions.axisType} ${axisOptions.axisType}`, axisOptions.className), viewBox: { x: 0, y: 0, width, height }, ticksGenerator: (axis) => (0, ChartUtils_1.getTicksOfAxis)(axis, true) })));
};
exports.YAxis = YAxis;
exports.YAxis.displayName = 'YAxis';
exports.YAxis.defaultProps = {
    allowDuplicatedCategory: true,
    allowDecimals: true,
    hide: false,
    orientation: 'left',
    width: 60,
    height: 0,
    mirror: false,
    yAxisId: 0,
    tickCount: 5,
    type: 'number',
    padding: { top: 0, bottom: 0 },
    allowDataOverflow: false,
    scale: 'auto',
    reversed: false,
};
//# sourceMappingURL=YAxis.js.map