"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LineChart = void 0;
const generateCategoricalChart_1 = require("./generateCategoricalChart");
const Line_1 = require("../cartesian/Line");
const XAxis_1 = require("../cartesian/XAxis");
const YAxis_1 = require("../cartesian/YAxis");
const CartesianUtils_1 = require("../util/CartesianUtils");
exports.LineChart = (0, generateCategoricalChart_1.generateCategoricalChart)({
    chartName: 'LineChart',
    GraphicalChild: Line_1.Line,
    axisComponents: [
        { axisType: 'xAxis', AxisComp: XAxis_1.XAxis },
        { axisType: 'yAxis', AxisComp: YAxis_1.YAxis },
    ],
    formatAxisMap: CartesianUtils_1.formatAxisMap,
});
//# sourceMappingURL=LineChart.js.map