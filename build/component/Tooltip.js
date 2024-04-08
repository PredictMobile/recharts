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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tooltip = void 0;
const react_1 = __importStar(require("react"));
const DefaultTooltipContent_1 = require("./DefaultTooltipContent");
const TooltipBoundingBox_1 = require("./TooltipBoundingBox");
const Global_1 = require("../util/Global");
const getUniqPayload_1 = require("../util/payload/getUniqPayload");
const chartLayoutContext_1 = require("../context/chartLayoutContext");
const tooltipContext_1 = require("../context/tooltipContext");
const accessibilityContext_1 = require("../context/accessibilityContext");
const useGetBoundingClientRect_1 = require("../util/useGetBoundingClientRect");
function defaultUniqBy(entry) {
    return entry.dataKey;
}
function renderContent(content, props) {
    if (react_1.default.isValidElement(content)) {
        return react_1.default.cloneElement(content, props);
    }
    if (typeof content === 'function') {
        return react_1.default.createElement(content, props);
    }
    return react_1.default.createElement(DefaultTooltipContent_1.DefaultTooltipContent, Object.assign({}, props));
}
function TooltipInternal(props) {
    const { active: activeFromProps, allowEscapeViewBox, animationDuration, animationEasing, content, filterNull, isAnimationActive, offset, payloadUniqBy, position, reverseDirection, useTranslate3d, wrapperStyle, } = props;
    const viewBox = (0, chartLayoutContext_1.useViewBox)();
    const accessibilityLayer = (0, accessibilityContext_1.useAccessibilityLayer)();
    const { active: activeFromContext, payload, coordinate, label } = (0, tooltipContext_1.useTooltipContext)();
    const finalIsActive = activeFromProps !== null && activeFromProps !== void 0 ? activeFromProps : activeFromContext;
    const [lastBoundingBox, updateBoundingBox] = (0, useGetBoundingClientRect_1.useGetBoundingClientRect)(undefined, [payload, finalIsActive]);
    let finalPayload = payload !== null && payload !== void 0 ? payload : [];
    if (!finalIsActive) {
        finalPayload = [];
    }
    if (filterNull && finalPayload.length) {
        finalPayload = (0, getUniqPayload_1.getUniqPayload)(payload.filter(entry => entry.value != null && (entry.hide !== true || props.includeHidden)), payloadUniqBy, defaultUniqBy);
    }
    const hasPayload = finalPayload.length > 0;
    return (react_1.default.createElement(TooltipBoundingBox_1.TooltipBoundingBox, { allowEscapeViewBox: allowEscapeViewBox, animationDuration: animationDuration, animationEasing: animationEasing, isAnimationActive: isAnimationActive, active: finalIsActive, coordinate: coordinate, hasPayload: hasPayload, offset: offset, position: position, reverseDirection: reverseDirection, useTranslate3d: useTranslate3d, viewBox: viewBox, wrapperStyle: wrapperStyle, lastBoundingBox: lastBoundingBox, innerRef: updateBoundingBox }, renderContent(content, Object.assign(Object.assign({}, props), { payload: finalPayload, label, active: finalIsActive, coordinate,
        accessibilityLayer }))));
}
class Tooltip extends react_1.PureComponent {
    render() {
        return react_1.default.createElement(TooltipInternal, Object.assign({}, this.props));
    }
}
exports.Tooltip = Tooltip;
Tooltip.displayName = 'Tooltip';
Tooltip.defaultProps = {
    allowEscapeViewBox: { x: false, y: false },
    animationDuration: 400,
    animationEasing: 'ease',
    contentStyle: {},
    coordinate: { x: 0, y: 0 },
    cursor: true,
    cursorStyle: {},
    filterNull: true,
    isAnimationActive: !Global_1.Global.isSsr,
    itemStyle: {},
    labelStyle: {},
    offset: 10,
    reverseDirection: { x: false, y: false },
    separator: ' : ',
    trigger: 'hover',
    useTranslate3d: false,
    wrapperStyle: {},
};
//# sourceMappingURL=Tooltip.js.map