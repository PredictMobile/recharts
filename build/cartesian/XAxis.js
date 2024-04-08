"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.XAxis = void 0;
const react_1 = __importDefault(require("react"));
const clsx_1 = __importDefault(require("clsx"));
const chartLayoutContext_1 = require("../context/chartLayoutContext");
const CartesianAxis_1 = require("./CartesianAxis");
const ChartUtils_1 = require("../util/ChartUtils");
const XAxis = ({ xAxisId }) => {
    const width = (0, chartLayoutContext_1.useChartWidth)();
    const height = (0, chartLayoutContext_1.useChartHeight)();
    const axisOptions = (0, chartLayoutContext_1.useXAxisOrThrow)(xAxisId);
    if (axisOptions == null) {
        return null;
    }
    return (react_1.default.createElement(CartesianAxis_1.CartesianAxis, Object.assign({}, axisOptions, { className: (0, clsx_1.default)(`recharts-${axisOptions.axisType} ${axisOptions.axisType}`, axisOptions.className), viewBox: { x: 0, y: 0, width, height }, ticksGenerator: (axis) => (0, ChartUtils_1.getTicksOfAxis)(axis, true) })));
};
exports.XAxis = XAxis;
exports.XAxis.displayName = 'XAxis';
exports.XAxis.defaultProps = {
    allowDecimals: true,
    hide: false,
    orientation: 'bottom',
    width: 0,
    height: 30,
    mirror: false,
    xAxisId: 0,
    tickCount: 5,
    type: 'category',
    padding: { left: 0, right: 0 },
    allowDataOverflow: false,
    scale: 'auto',
    reversed: false,
    allowDuplicatedCategory: true,
};
//# sourceMappingURL=XAxis.js.map