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
exports.ScatterSymbol = void 0;
const react_1 = __importDefault(require("react"));
const Symbols_1 = require("../shape/Symbols");
const ActiveShapeUtils_1 = require("./ActiveShapeUtils");
function ScatterSymbol(_a) {
    var { option, isActive } = _a, props = __rest(_a, ["option", "isActive"]);
    if (typeof option === 'string') {
        return react_1.default.createElement(ActiveShapeUtils_1.Shape, Object.assign({ option: react_1.default.createElement(Symbols_1.Symbols, Object.assign({ type: option }, props)), isActive: isActive, shapeType: "symbols" }, props));
    }
    return react_1.default.createElement(ActiveShapeUtils_1.Shape, Object.assign({ option: option, isActive: isActive, shapeType: "symbols" }, props));
}
exports.ScatterSymbol = ScatterSymbol;
//# sourceMappingURL=ScatterUtils.js.map