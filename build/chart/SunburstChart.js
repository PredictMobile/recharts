"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SunburstChart = void 0;
const react_1 = __importStar(require("react"));
const d3_scale_1 = require("victory-vendor/d3-scale");
const clsx_1 = __importDefault(require("clsx"));
const Surface_1 = require("../container/Surface");
const Layer_1 = require("../container/Layer");
const Sector_1 = require("../shape/Sector");
const Text_1 = require("../component/Text");
const PolarUtils_1 = require("../util/PolarUtils");
const chartLayoutContext_1 = require("../context/chartLayoutContext");
const tooltipContext_1 = require("../context/tooltipContext");
const defaultTextProps = {
    fontWeight: 'bold',
    paintOrder: 'stroke fill',
    fontSize: '.75rem',
    stroke: '#FFF',
    fill: 'black',
    pointerEvents: 'none',
};
function getMaxDepthOf(node) {
    if (!node.children || node.children.length === 0)
        return 1;
    const childDepths = node.children.map(d => getMaxDepthOf(d));
    return 1 + Math.max(...childDepths);
}
const SunburstChart = ({ className, data, children, width, height, padding = 2, dataKey = 'value', ringPadding = 2, innerRadius = 50, fill = '#333', stroke = '#FFF', textOptions = defaultTextProps, outerRadius = Math.min(width, height) / 2, cx = width / 2, cy = height / 2, startAngle = 0, endAngle = 360, onClick, onMouseEnter, onMouseLeave, }) => {
    const [isTooltipActive, setIsTooltipActive] = (0, react_1.useState)(false);
    const [activeNode, setActiveNode] = (0, react_1.useState)(null);
    const rScale = (0, d3_scale_1.scaleLinear)([0, data[dataKey]], [0, endAngle]);
    const treeDepth = getMaxDepthOf(data);
    const thickness = (outerRadius - innerRadius) / treeDepth;
    const sectors = [];
    const positions = new Map([]);
    function handleMouseEnter(node, e) {
        if (onMouseEnter)
            onMouseEnter(node, e);
        setActiveNode(node);
        setIsTooltipActive(true);
    }
    function handleMouseLeave(node, e) {
        if (onMouseLeave)
            onMouseLeave(node, e);
        setActiveNode(null);
        setIsTooltipActive(false);
    }
    function handleClick(node) {
        if (onClick)
            onClick(node);
    }
    function drawArcs(childNodes, options) {
        const { radius, innerR, initialAngle, childColor } = options;
        let currentAngle = initialAngle;
        if (!childNodes)
            return;
        childNodes.forEach(d => {
            var _a, _b;
            const arcLength = rScale(d[dataKey]);
            const start = currentAngle;
            const fillColor = (_b = (_a = d === null || d === void 0 ? void 0 : d.fill) !== null && _a !== void 0 ? _a : childColor) !== null && _b !== void 0 ? _b : fill;
            const { x: textX, y: textY } = (0, PolarUtils_1.polarToCartesian)(0, 0, innerR + radius / 2, -(start + arcLength - arcLength / 2));
            currentAngle += arcLength;
            sectors.push(react_1.default.createElement("g", { "aria-label": d.name, tabIndex: 0 },
                react_1.default.createElement(Sector_1.Sector, { onClick: () => handleClick(d), onMouseEnter: e => handleMouseEnter(d, e), onMouseLeave: e => handleMouseLeave(d, e), fill: fillColor, stroke: stroke, strokeWidth: padding, startAngle: start, endAngle: start + arcLength, innerRadius: innerR, outerRadius: innerR + radius, cx: cx, cy: cy }),
                react_1.default.createElement(Text_1.Text, Object.assign({}, textOptions, { alignmentBaseline: "middle", textAnchor: "middle", x: textX + cx, y: cy - textY }), d[dataKey])));
            const { x: tooltipX, y: tooltipY } = (0, PolarUtils_1.polarToCartesian)(cx, cy, innerR + radius / 2, start);
            positions.set(d.name, { x: tooltipX, y: tooltipY });
            return drawArcs(d.children, {
                radius,
                innerR: innerR + radius + ringPadding,
                initialAngle: start,
                childColor: fillColor,
            });
        });
    }
    drawArcs(data.children, { radius: thickness, innerR: innerRadius, initialAngle: startAngle });
    const layerClass = (0, clsx_1.default)('recharts-sunburst', className);
    function getTooltipContext() {
        if (activeNode == null) {
            return tooltipContext_1.doNotDisplayTooltip;
        }
        return {
            coordinate: positions.get(activeNode.name),
            payload: [activeNode],
            active: isTooltipActive,
        };
    }
    const viewBox = { x: 0, y: 0, width, height };
    return (react_1.default.createElement(chartLayoutContext_1.ViewBoxContext.Provider, { value: viewBox },
        react_1.default.createElement(tooltipContext_1.TooltipContextProvider, { value: getTooltipContext() },
            react_1.default.createElement("div", { className: (0, clsx_1.default)('recharts-wrapper', className), style: { position: 'relative', width, height }, role: "region" },
                react_1.default.createElement(Surface_1.Surface, { width: width, height: height },
                    react_1.default.createElement(Layer_1.Layer, { className: layerClass }, sectors),
                    children)))));
};
exports.SunburstChart = SunburstChart;
//# sourceMappingURL=SunburstChart.js.map