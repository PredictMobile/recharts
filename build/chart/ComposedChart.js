"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComposedChart = void 0;
const generateCategoricalChart_1 = require("./generateCategoricalChart");
const Area_1 = require("../cartesian/Area");
const Bar_1 = require("../cartesian/Bar");
const Line_1 = require("../cartesian/Line");
const Scatter_1 = require("../cartesian/Scatter");
const XAxis_1 = require("../cartesian/XAxis");
const YAxis_1 = require("../cartesian/YAxis");
const ZAxis_1 = require("../cartesian/ZAxis");
const CartesianUtils_1 = require("../util/CartesianUtils");
exports.ComposedChart = (0, generateCategoricalChart_1.generateCategoricalChart)({
    chartName: 'ComposedChart',
    GraphicalChild: [Line_1.Line, Area_1.Area, Bar_1.Bar, Scatter_1.Scatter],
    axisComponents: [
        { axisType: 'xAxis', AxisComp: XAxis_1.XAxis },
        { axisType: 'yAxis', AxisComp: YAxis_1.YAxis },
        { axisType: 'zAxis', AxisComp: ZAxis_1.ZAxis },
    ],
    formatAxisMap: CartesianUtils_1.formatAxisMap,
});
//# sourceMappingURL=ComposedChart.js.map