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
exports.DefaultLegendContent = void 0;
const react_1 = __importStar(require("react"));
const isFunction_1 = __importDefault(require("lodash/isFunction"));
const clsx_1 = __importDefault(require("clsx"));
const LogUtils_1 = require("../util/LogUtils");
const Surface_1 = require("../container/Surface");
const Symbols_1 = require("../shape/Symbols");
const types_1 = require("../util/types");
const SIZE = 32;
class DefaultLegendContent extends react_1.PureComponent {
    renderIcon(data, iconType) {
        const { inactiveColor } = this.props;
        const halfSize = SIZE / 2;
        const sixthSize = SIZE / 6;
        const thirdSize = SIZE / 3;
        const color = data.inactive ? inactiveColor : data.color;
        const preferredIcon = iconType !== null && iconType !== void 0 ? iconType : data.type;
        if (preferredIcon === 'none') {
            return null;
        }
        if (preferredIcon === 'plainline') {
            return (react_1.default.createElement("line", { strokeWidth: 4, fill: "none", stroke: color, strokeDasharray: data.payload.strokeDasharray, x1: 0, y1: halfSize, x2: SIZE, y2: halfSize, className: "recharts-legend-icon" }));
        }
        if (preferredIcon === 'line') {
            return (react_1.default.createElement("path", { strokeWidth: 4, fill: "none", stroke: color, d: `M0,${halfSize}h${thirdSize}
            A${sixthSize},${sixthSize},0,1,1,${2 * thirdSize},${halfSize}
            H${SIZE}M${2 * thirdSize},${halfSize}
            A${sixthSize},${sixthSize},0,1,1,${thirdSize},${halfSize}`, className: "recharts-legend-icon" }));
        }
        if (preferredIcon === 'rect') {
            return (react_1.default.createElement("path", { stroke: "none", fill: color, d: `M0,${SIZE / 8}h${SIZE}v${(SIZE * 3) / 4}h${-SIZE}z`, className: "recharts-legend-icon" }));
        }
        if (react_1.default.isValidElement(data.legendIcon)) {
            const iconProps = Object.assign({}, data);
            delete iconProps.legendIcon;
            return react_1.default.cloneElement(data.legendIcon, iconProps);
        }
        return react_1.default.createElement(Symbols_1.Symbols, { fill: color, cx: halfSize, cy: halfSize, size: SIZE, sizeType: "diameter", type: preferredIcon });
    }
    renderItems() {
        const { payload, iconSize, layout, formatter, inactiveColor, iconType } = this.props;
        const viewBox = { x: 0, y: 0, width: SIZE, height: SIZE };
        const itemStyle = {
            display: layout === 'horizontal' ? 'inline-block' : 'block',
            marginRight: 10,
        };
        const svgStyle = { display: 'inline-block', verticalAlign: 'middle', marginRight: 4 };
        return payload.map((entry, i) => {
            const finalFormatter = entry.formatter || formatter;
            const className = (0, clsx_1.default)({
                'recharts-legend-item': true,
                [`legend-item-${i}`]: true,
                inactive: entry.inactive,
            });
            if (entry.type === 'none') {
                return null;
            }
            const entryValue = !(0, isFunction_1.default)(entry.value) ? entry.value : null;
            (0, LogUtils_1.warn)(!(0, isFunction_1.default)(entry.value), `The name property is also required when using a function for the dataKey of a chart's cartesian components. Ex: <Bar name="Name of my Data"/>`);
            const color = entry.inactive ? inactiveColor : entry.color;
            return (react_1.default.createElement("li", Object.assign({ className: className, style: itemStyle, key: `legend-item-${i}` }, (0, types_1.adaptEventsOfChild)(this.props, entry, i)),
                react_1.default.createElement(Surface_1.Surface, { width: iconSize, height: iconSize, viewBox: viewBox, style: svgStyle }, this.renderIcon(entry, iconType)),
                react_1.default.createElement("span", { className: "recharts-legend-item-text", style: { color } }, finalFormatter ? finalFormatter(entryValue, entry, i) : entryValue)));
        });
    }
    render() {
        const { payload, layout, align } = this.props;
        if (!payload || !payload.length) {
            return null;
        }
        const finalStyle = {
            padding: 0,
            margin: 0,
            textAlign: layout === 'horizontal' ? align : 'left',
        };
        return (react_1.default.createElement("ul", { className: "recharts-default-legend", style: finalStyle }, this.renderItems()));
    }
}
exports.DefaultLegendContent = DefaultLegendContent;
DefaultLegendContent.displayName = 'Legend';
DefaultLegendContent.defaultProps = {
    iconSize: 14,
    layout: 'horizontal',
    align: 'center',
    verticalAlign: 'middle',
    inactiveColor: '#ccc',
};
//# sourceMappingURL=DefaultLegendContent.js.map