"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FunnelTrapezoid = exports.typeGuardTrapezoidProps = void 0;
const react_1 = __importDefault(require("react"));
const ActiveShapeUtils_1 = require("./ActiveShapeUtils");
function typeGuardTrapezoidProps(option, props) {
    const xValue = `${props.x || option.x}`;
    const x = parseInt(xValue, 10);
    const yValue = `${props.y || option.y}`;
    const y = parseInt(yValue, 10);
    const heightValue = `${(props === null || props === void 0 ? void 0 : props.height) || (option === null || option === void 0 ? void 0 : option.height)}`;
    const height = parseInt(heightValue, 10);
    return Object.assign(Object.assign(Object.assign({}, props), (0, ActiveShapeUtils_1.getPropsFromShapeOption)(option)), { height,
        x,
        y });
}
exports.typeGuardTrapezoidProps = typeGuardTrapezoidProps;
function FunnelTrapezoid(props) {
    return react_1.default.createElement(ActiveShapeUtils_1.Shape, Object.assign({ shapeType: "trapezoid", propTransformer: typeGuardTrapezoidProps }, props));
}
exports.FunnelTrapezoid = FunnelTrapezoid;
//# sourceMappingURL=FunnelUtils.js.map