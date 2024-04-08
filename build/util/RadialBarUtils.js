"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RadialBarSector = exports.typeGuardSectorProps = exports.parseCornerRadius = void 0;
const react_1 = __importDefault(require("react"));
const ActiveShapeUtils_1 = require("./ActiveShapeUtils");
function parseCornerRadius(cornerRadius) {
    if (typeof cornerRadius === 'string') {
        return parseInt(cornerRadius, 10);
    }
    return cornerRadius;
}
exports.parseCornerRadius = parseCornerRadius;
function typeGuardSectorProps(option, props) {
    const cxValue = `${props.cx || option.cx}`;
    const cx = Number(cxValue);
    const cyValue = `${props.cy || option.cy}`;
    const cy = Number(cyValue);
    return Object.assign(Object.assign(Object.assign({}, props), option), { cx,
        cy });
}
exports.typeGuardSectorProps = typeGuardSectorProps;
function RadialBarSector(props) {
    return react_1.default.createElement(ActiveShapeUtils_1.Shape, Object.assign({ shapeType: "sector", propTransformer: typeGuardSectorProps }, props));
}
exports.RadialBarSector = RadialBarSector;
//# sourceMappingURL=RadialBarUtils.js.map