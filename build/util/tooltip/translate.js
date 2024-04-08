"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTooltipTranslate = exports.getTransformStyle = exports.getTooltipTranslateXY = exports.getTooltipCSSClassName = void 0;
const clsx_1 = __importDefault(require("clsx"));
const DataUtils_1 = require("../DataUtils");
const CSS_CLASS_PREFIX = 'recharts-tooltip-wrapper';
const TOOLTIP_HIDDEN = { visibility: 'hidden' };
function getTooltipCSSClassName({ coordinate, translateX, translateY, }) {
    return (0, clsx_1.default)(CSS_CLASS_PREFIX, {
        [`${CSS_CLASS_PREFIX}-right`]: (0, DataUtils_1.isNumber)(translateX) && coordinate && (0, DataUtils_1.isNumber)(coordinate.x) && translateX >= coordinate.x,
        [`${CSS_CLASS_PREFIX}-left`]: (0, DataUtils_1.isNumber)(translateX) && coordinate && (0, DataUtils_1.isNumber)(coordinate.x) && translateX < coordinate.x,
        [`${CSS_CLASS_PREFIX}-bottom`]: (0, DataUtils_1.isNumber)(translateY) && coordinate && (0, DataUtils_1.isNumber)(coordinate.y) && translateY >= coordinate.y,
        [`${CSS_CLASS_PREFIX}-top`]: (0, DataUtils_1.isNumber)(translateY) && coordinate && (0, DataUtils_1.isNumber)(coordinate.y) && translateY < coordinate.y,
    });
}
exports.getTooltipCSSClassName = getTooltipCSSClassName;
function getTooltipTranslateXY({ allowEscapeViewBox, coordinate, key, offsetTopLeft, position, reverseDirection, tooltipDimension, viewBox, viewBoxDimension, }) {
    if (position && (0, DataUtils_1.isNumber)(position[key])) {
        return position[key];
    }
    const negative = coordinate[key] - tooltipDimension - offsetTopLeft;
    const positive = coordinate[key] + offsetTopLeft;
    if (allowEscapeViewBox[key]) {
        return reverseDirection[key] ? negative : positive;
    }
    if (reverseDirection[key]) {
        const tooltipBoundary = negative;
        const viewBoxBoundary = viewBox[key];
        if (tooltipBoundary < viewBoxBoundary) {
            return Math.max(positive, viewBox[key]);
        }
        return Math.max(negative, viewBox[key]);
    }
    const tooltipBoundary = positive + tooltipDimension;
    const viewBoxBoundary = viewBox[key] + viewBoxDimension;
    if (tooltipBoundary > viewBoxBoundary) {
        return Math.max(negative, viewBox[key]);
    }
    return Math.max(positive, viewBox[key]);
}
exports.getTooltipTranslateXY = getTooltipTranslateXY;
function getTransformStyle({ translateX, translateY, useTranslate3d, }) {
    return {
        transform: useTranslate3d
            ? `translate3d(${translateX}px, ${translateY}px, 0)`
            : `translate(${translateX}px, ${translateY}px)`,
    };
}
exports.getTransformStyle = getTransformStyle;
function getTooltipTranslate({ allowEscapeViewBox, coordinate, offsetTopLeft, position, reverseDirection, tooltipBox, useTranslate3d, viewBox, }) {
    let cssProperties, translateX, translateY;
    if (tooltipBox.height > 0 && tooltipBox.width > 0 && coordinate) {
        translateX = getTooltipTranslateXY({
            allowEscapeViewBox,
            coordinate,
            key: 'x',
            offsetTopLeft,
            position,
            reverseDirection,
            tooltipDimension: tooltipBox.width,
            viewBox,
            viewBoxDimension: viewBox.width,
        });
        translateY = getTooltipTranslateXY({
            allowEscapeViewBox,
            coordinate,
            key: 'y',
            offsetTopLeft,
            position,
            reverseDirection,
            tooltipDimension: tooltipBox.height,
            viewBox,
            viewBoxDimension: viewBox.height,
        });
        cssProperties = getTransformStyle({
            translateX,
            translateY,
            useTranslate3d,
        });
    }
    else {
        cssProperties = TOOLTIP_HIDDEN;
    }
    return {
        cssProperties,
        cssClasses: getTooltipCSSClassName({
            translateX,
            translateY,
            coordinate,
        }),
    };
}
exports.getTooltipTranslate = getTooltipTranslate;
//# sourceMappingURL=translate.js.map