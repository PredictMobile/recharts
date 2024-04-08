"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLegendProps = void 0;
const Legend_1 = require("../component/Legend");
const getLegendProps = ({ legendItem, legendWidth, }) => {
    return Object.assign(Object.assign({}, legendItem.props), Legend_1.Legend.getWidthOrHeight(legendItem.props.layout, legendItem.props.height, legendItem.props.width, legendWidth));
};
exports.getLegendProps = getLegendProps;
//# sourceMappingURL=getLegendProps.js.map