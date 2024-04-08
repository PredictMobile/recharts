"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RadialBarChart = void 0;
const generateCategoricalChart_1 = require("./generateCategoricalChart");
const PolarAngleAxis_1 = require("../polar/PolarAngleAxis");
const PolarRadiusAxis_1 = require("../polar/PolarRadiusAxis");
const PolarUtils_1 = require("../util/PolarUtils");
const RadialBar_1 = require("../polar/RadialBar");
exports.RadialBarChart = (0, generateCategoricalChart_1.generateCategoricalChart)({
    chartName: 'RadialBarChart',
    GraphicalChild: RadialBar_1.RadialBar,
    defaultTooltipEventType: 'axis',
    validateTooltipEventTypes: ['axis', 'item'],
    axisComponents: [
        { axisType: 'angleAxis', AxisComp: PolarAngleAxis_1.PolarAngleAxis },
        { axisType: 'radiusAxis', AxisComp: PolarRadiusAxis_1.PolarRadiusAxis },
    ],
    formatAxisMap: PolarUtils_1.formatAxisMap,
    defaultProps: {
        layout: 'radial',
        startAngle: 0,
        endAngle: 360,
        cx: '50%',
        cy: '50%',
        innerRadius: 0,
        outerRadius: '80%',
    },
});
//# sourceMappingURL=RadialBarChart.js.map