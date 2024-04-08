"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateViewBox = void 0;
const memoize_1 = __importDefault(require("lodash/memoize"));
exports.calculateViewBox = (0, memoize_1.default)((offset) => {
    return {
        x: offset.left,
        y: offset.top,
        width: offset.width,
        height: offset.height,
    };
}, offset => ['l', offset.left, 't', offset.top, 'w', offset.width, 'h', offset.height].join(''));
//# sourceMappingURL=calculateViewBox.js.map