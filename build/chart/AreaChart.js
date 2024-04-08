"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AreaChart = void 0;
const generateCategoricalChart_1 = require("./generateCategoricalChart");
const Area_1 = require("../cartesian/Area");
const XAxis_1 = require("../cartesian/XAxis");
const YAxis_1 = require("../cartesian/YAxis");
const CartesianUtils_1 = require("../util/CartesianUtils");
exports.AreaChart = (0, generateCategoricalChart_1.generateCategoricalChart)({
    chartName: 'AreaChart',
    GraphicalChild: Area_1.Area,
    axisComponents: [
        { axisType: 'xAxis', AxisComp: XAxis_1.XAxis },
        { axisType: 'yAxis', AxisComp: YAxis_1.YAxis },
    ],
    formatAxisMap: CartesianUtils_1.formatAxisMap,
});
//# sourceMappingURL=AreaChart.js.map