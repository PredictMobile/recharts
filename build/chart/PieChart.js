"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PieChart = void 0;
const generateCategoricalChart_1 = require("./generateCategoricalChart");
const PolarAngleAxis_1 = require("../polar/PolarAngleAxis");
const PolarRadiusAxis_1 = require("../polar/PolarRadiusAxis");
const PolarUtils_1 = require("../util/PolarUtils");
const Pie_1 = require("../polar/Pie");
exports.PieChart = (0, generateCategoricalChart_1.generateCategoricalChart)({
    chartName: 'PieChart',
    GraphicalChild: Pie_1.Pie,
    validateTooltipEventTypes: ['item'],
    defaultTooltipEventType: 'item',
    axisComponents: [
        { axisType: 'angleAxis', AxisComp: PolarAngleAxis_1.PolarAngleAxis },
        { axisType: 'radiusAxis', AxisComp: PolarRadiusAxis_1.PolarRadiusAxis },
    ],
    formatAxisMap: PolarUtils_1.formatAxisMap,
    defaultProps: {
        layout: 'centric',
        startAngle: 0,
        endAngle: 360,
        cx: '50%',
        cy: '50%',
        innerRadius: 0,
        outerRadius: '80%',
    },
});
//# sourceMappingURL=PieChart.js.map