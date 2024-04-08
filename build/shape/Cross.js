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
exports.Cross = void 0;
const react_1 = __importDefault(require("react"));
const clsx_1 = __importDefault(require("clsx"));
const DataUtils_1 = require("../util/DataUtils");
const ReactUtils_1 = require("../util/ReactUtils");
const getPath = (x, y, width, height, top, left) => {
    return `M${x},${top}v${height}M${left},${y}h${width}`;
};
const Cross = (_a) => {
    var { x = 0, y = 0, top = 0, left = 0, width = 0, height = 0, className } = _a, rest = __rest(_a, ["x", "y", "top", "left", "width", "height", "className"]);
    const props = Object.assign({ x, y, top, left, width, height }, rest);
    if (!(0, DataUtils_1.isNumber)(x) || !(0, DataUtils_1.isNumber)(y) || !(0, DataUtils_1.isNumber)(width) || !(0, DataUtils_1.isNumber)(height) || !(0, DataUtils_1.isNumber)(top) || !(0, DataUtils_1.isNumber)(left)) {
        return null;
    }
    return (react_1.default.createElement("path", Object.assign({}, (0, ReactUtils_1.filterProps)(props, true), { className: (0, clsx_1.default)('recharts-cross', className), d: getPath(x, y, width, height, top, left) })));
};
exports.Cross = Cross;
//# sourceMappingURL=Cross.js.map