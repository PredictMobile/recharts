"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClipPath = void 0;
const react_1 = __importDefault(require("react"));
function ClipPath({ clipPathId, offset }) {
    const { left, top, height, width } = offset;
    return (react_1.default.createElement("defs", null,
        react_1.default.createElement("clipPath", { id: clipPathId },
            react_1.default.createElement("rect", { x: left, y: top, height: height, width: width }))));
}
exports.ClipPath = ClipPath;
//# sourceMappingURL=ClipPath.js.map