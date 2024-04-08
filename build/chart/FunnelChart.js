"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FunnelChart = void 0;
const generateCategoricalChart_1 = require("./generateCategoricalChart");
const Funnel_1 = require("../numberAxis/Funnel");
exports.FunnelChart = (0, generateCategoricalChart_1.generateCategoricalChart)({
    chartName: 'FunnelChart',
    GraphicalChild: Funnel_1.Funnel,
    validateTooltipEventTypes: ['item'],
    defaultTooltipEventType: 'item',
    axisComponents: [],
    defaultProps: {
        layout: 'centric',
    },
});
//# sourceMappingURL=FunnelChart.js.map