"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScatterChart = void 0;
const generateCategoricalChart_1 = require("./generateCategoricalChart");
const Scatter_1 = require("../cartesian/Scatter");
const XAxis_1 = require("../cartesian/XAxis");
const YAxis_1 = require("../cartesian/YAxis");
const ZAxis_1 = require("../cartesian/ZAxis");
const CartesianUtils_1 = require("../util/CartesianUtils");
exports.ScatterChart = (0, generateCategoricalChart_1.generateCategoricalChart)({
    chartName: 'ScatterChart',
    GraphicalChild: Scatter_1.Scatter,
    defaultTooltipEventType: 'item',
    validateTooltipEventTypes: ['item'],
    axisComponents: [
        { axisType: 'xAxis', AxisComp: XAxis_1.XAxis },
        { axisType: 'yAxis', AxisComp: YAxis_1.YAxis },
        { axisType: 'zAxis', AxisComp: ZAxis_1.ZAxis },
    ],
    formatAxisMap: CartesianUtils_1.formatAxisMap,
});
//# sourceMappingURL=ScatterChart.js.map