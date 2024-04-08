"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUniqPayload = void 0;
const uniqBy_1 = __importDefault(require("lodash/uniqBy"));
const isFunction_1 = __importDefault(require("lodash/isFunction"));
function getUniqPayload(payload, option, defaultUniqBy) {
    if (option === true) {
        return (0, uniqBy_1.default)(payload, defaultUniqBy);
    }
    if ((0, isFunction_1.default)(option)) {
        return (0, uniqBy_1.default)(payload, option);
    }
    return payload;
}
exports.getUniqPayload = getUniqPayload;
//# sourceMappingURL=getUniqPayload.js.map