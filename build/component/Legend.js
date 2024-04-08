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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Legend = void 0;
const react_1 = __importStar(require("react"));
const DefaultLegendContent_1 = require("./DefaultLegendContent");
const DataUtils_1 = require("../util/DataUtils");
const getUniqPayload_1 = require("../util/payload/getUniqPayload");
const legendPayloadContext_1 = require("../context/legendPayloadContext");
const useGetBoundingClientRect_1 = require("../util/useGetBoundingClientRect");
const chartLayoutContext_1 = require("../context/chartLayoutContext");
const legendBoundingBoxContext_1 = require("../context/legendBoundingBoxContext");
function defaultUniqBy(entry) {
    return entry.value;
}
function LegendContent(props) {
    const { contextPayload } = props, otherProps = __rest(props, ["contextPayload"]);
    const finalPayload = (0, getUniqPayload_1.getUniqPayload)(contextPayload, props.payloadUniqBy, defaultUniqBy);
    const contentProps = Object.assign(Object.assign({}, otherProps), { payload: finalPayload });
    if (react_1.default.isValidElement(props.content)) {
        return react_1.default.cloneElement(props.content, contentProps);
    }
    if (typeof props.content === 'function') {
        return react_1.default.createElement(props.content, contentProps);
    }
    const { ref } = contentProps, propsWithoutRef = __rest(contentProps, ["ref"]);
    return react_1.default.createElement(DefaultLegendContent_1.DefaultLegendContent, Object.assign({}, propsWithoutRef));
}
function getDefaultPosition(style, props, margin, chartWidth, chartHeight, box) {
    const { layout, align, verticalAlign } = props;
    let hPos, vPos;
    if (!style ||
        ((style.left === undefined || style.left === null) && (style.right === undefined || style.right === null))) {
        if (align === 'center' && layout === 'vertical') {
            hPos = { left: ((chartWidth || 0) - box.width) / 2 };
        }
        else {
            hPos = align === 'right' ? { right: (margin && margin.right) || 0 } : { left: (margin && margin.left) || 0 };
        }
    }
    if (!style ||
        ((style.top === undefined || style.top === null) && (style.bottom === undefined || style.bottom === null))) {
        if (verticalAlign === 'middle') {
            vPos = { top: ((chartHeight || 0) - box.height) / 2 };
        }
        else {
            vPos =
                verticalAlign === 'bottom' ? { bottom: (margin && margin.bottom) || 0 } : { top: (margin && margin.top) || 0 };
        }
    }
    return Object.assign(Object.assign({}, hPos), vPos);
}
function LegendWrapper(props) {
    const contextPayload = (0, legendPayloadContext_1.useLegendPayload)();
    const margin = (0, chartLayoutContext_1.useMargin)();
    const { width: widthFromProps, height: heightFromProps, wrapperStyle } = props;
    const onBBoxUpdate = (0, react_1.useContext)(legendBoundingBoxContext_1.LegendBoundingBoxContext);
    const [lastBoundingBox, updateBoundingBox] = (0, useGetBoundingClientRect_1.useGetBoundingClientRect)(onBBoxUpdate, [contextPayload]);
    const chartWidth = (0, chartLayoutContext_1.useChartWidth)();
    const chartHeight = (0, chartLayoutContext_1.useChartHeight)();
    const maxWidth = chartWidth - (margin.left || 0) - (margin.right || 0);
    const widthOrHeight = Legend.getWidthOrHeight(props.layout, heightFromProps, widthFromProps, maxWidth);
    const outerStyle = Object.assign(Object.assign({ position: 'absolute', width: (widthOrHeight === null || widthOrHeight === void 0 ? void 0 : widthOrHeight.width) || widthFromProps || 'auto', height: (widthOrHeight === null || widthOrHeight === void 0 ? void 0 : widthOrHeight.height) || heightFromProps || 'auto' }, getDefaultPosition(wrapperStyle, props, margin, chartWidth, chartHeight, lastBoundingBox)), wrapperStyle);
    return (react_1.default.createElement("div", { className: "recharts-legend-wrapper", style: outerStyle, ref: updateBoundingBox },
        react_1.default.createElement(LegendContent, Object.assign({}, props, widthOrHeight, { margin: margin, onBBoxUpdate: onBBoxUpdate, chartWidth: chartWidth, chartHeight: chartHeight, contextPayload: contextPayload }))));
}
class Legend extends react_1.PureComponent {
    static getWidthOrHeight(layout, height, width, maxWidth) {
        if (layout === 'vertical' && (0, DataUtils_1.isNumber)(height)) {
            return {
                height,
            };
        }
        if (layout === 'horizontal') {
            return {
                width: width || maxWidth,
            };
        }
        return null;
    }
    render() {
        return (react_1.default.createElement("foreignObject", { x: "0", y: "0", width: "100%", height: "100%" },
            react_1.default.createElement(LegendWrapper, Object.assign({}, this.props))));
    }
}
exports.Legend = Legend;
Legend.displayName = 'Legend';
Legend.defaultProps = {
    iconSize: 14,
    layout: 'horizontal',
    align: 'center',
    verticalAlign: 'bottom',
};
//# sourceMappingURL=Legend.js.map