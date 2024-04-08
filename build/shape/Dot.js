"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dot = void 0;
const react_1 = __importDefault(require("react"));
const clsx_1 = __importDefault(require("clsx"));
const types_1 = require("../util/types");
const ReactUtils_1 = require("../util/ReactUtils");
const Dot = props => {
    const { cx, cy, r, className } = props;
    const layerClass = (0, clsx_1.default)('recharts-dot', className);
    if (cx === +cx && cy === +cy && r === +r) {
        return (react_1.default.createElement("circle", Object.assign({}, (0, ReactUtils_1.filterProps)(props, false), (0, types_1.adaptEventHandlers)(props), { className: layerClass, cx: cx, cy: cy, r: r })));
    }
    return null;
};
exports.Dot = Dot;
//# sourceMappingURL=Dot.js.map