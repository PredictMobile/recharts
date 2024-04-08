"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RadarChart = void 0;
const generateCategoricalChart_1 = require("./generateCategoricalChart");
const Radar_1 = require("../polar/Radar");
const PolarAngleAxis_1 = require("../polar/PolarAngleAxis");
const PolarRadiusAxis_1 = require("../polar/PolarRadiusAxis");
const PolarUtils_1 = require("../util/PolarUtils");
exports.RadarChart = (0, generateCategoricalChart_1.generateCategoricalChart)({
    chartName: 'RadarChart',
    GraphicalChild: Radar_1.Radar,
    axisComponents: [
        { axisType: 'angleAxis', AxisComp: PolarAngleAxis_1.PolarAngleAxis },
        { axisType: 'radiusAxis', AxisComp: PolarRadiusAxis_1.PolarRadiusAxis },
    ],
    formatAxisMap: PolarUtils_1.formatAxisMap,
    defaultProps: {
        layout: 'centric',
        startAngle: 90,
        endAngle: -270,
        cx: '50%',
        cy: '50%',
        innerRadius: 0,
        outerRadius: '80%',
    },
});
//# sourceMappingURL=RadarChart.js.map