"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.minPointSizeCallback = exports.BarRectangle = void 0;
const react_1 = __importDefault(require("react"));
const tiny_invariant_1 = __importDefault(require("tiny-invariant"));
const ActiveShapeUtils_1 = require("./ActiveShapeUtils");
function typeguardBarRectangleProps(_a, props) {
    var { x: xProp, y: yProp } = _a, option = __rest(_a, ["x", "y"]);
    const xValue = `${xProp}`;
    const x = parseInt(xValue, 10);
    const yValue = `${yProp}`;
    const y = parseInt(yValue, 10);
    const heightValue = `${props.height || option.height}`;
    const height = parseInt(heightValue, 10);
    const widthValue = `${props.width || option.width}`;
    const width = parseInt(widthValue, 10);
    return Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, props), option), (x ? { x } : {})), (y ? { y } : {})), { height,
        width, name: props.name, radius: props.radius });
}
function BarRectangle(props) {
    return (react_1.default.createElement(ActiveShapeUtils_1.Shape, Object.assign({ shapeType: "rectangle", propTransformer: typeguardBarRectangleProps, activeClassName: "recharts-active-bar" }, props)));
}
exports.BarRectangle = BarRectangle;
const minPointSizeCallback = (minPointSize, defaultValue = 0) => (value, index) => {
    if (typeof minPointSize === 'number')
        return minPointSize;
    const isValueNumber = typeof value === 'number';
    if (isValueNumber) {
        return minPointSize(value, index);
    }
    (0, tiny_invariant_1.default)(isValueNumber, `minPointSize callback function received a value with type of ${typeof value}. Currently only numbers are supported.`);
    return defaultValue;
};
exports.minPointSizeCallback = minPointSizeCallback;
//# sourceMappingURL=BarUtils.js.map