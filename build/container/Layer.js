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
exports.Layer = void 0;
const react_1 = __importDefault(require("react"));
const clsx_1 = __importDefault(require("clsx"));
const ReactUtils_1 = require("../util/ReactUtils");
exports.Layer = react_1.default.forwardRef((props, ref) => {
    const { children, className } = props, others = __rest(props, ["children", "className"]);
    const layerClass = (0, clsx_1.default)('recharts-layer', className);
    return (react_1.default.createElement("g", Object.assign({ className: layerClass }, (0, ReactUtils_1.filterProps)(others, true), { ref: ref }), children));
});
//# sourceMappingURL=Layer.js.map