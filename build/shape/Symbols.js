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
exports.Symbols = void 0;
const react_1 = __importDefault(require("react"));
const upperFirst_1 = __importDefault(require("lodash/upperFirst"));
const d3_shape_1 = require("victory-vendor/d3-shape");
const clsx_1 = __importDefault(require("clsx"));
const ReactUtils_1 = require("../util/ReactUtils");
const symbolFactories = {
    symbolCircle: d3_shape_1.symbolCircle,
    symbolCross: d3_shape_1.symbolCross,
    symbolDiamond: d3_shape_1.symbolDiamond,
    symbolSquare: d3_shape_1.symbolSquare,
    symbolStar: d3_shape_1.symbolStar,
    symbolTriangle: d3_shape_1.symbolTriangle,
    symbolWye: d3_shape_1.symbolWye,
};
const RADIAN = Math.PI / 180;
const getSymbolFactory = (type) => {
    const name = `symbol${(0, upperFirst_1.default)(type)}`;
    return symbolFactories[name] || d3_shape_1.symbolCircle;
};
const calculateAreaSize = (size, sizeType, type) => {
    if (sizeType === 'area') {
        return size;
    }
    switch (type) {
        case 'cross':
            return (5 * size * size) / 9;
        case 'diamond':
            return (0.5 * size * size) / Math.sqrt(3);
        case 'square':
            return size * size;
        case 'star': {
            const angle = 18 * RADIAN;
            return 1.25 * size * size * (Math.tan(angle) - Math.tan(angle * 2) * Math.pow(Math.tan(angle), 2));
        }
        case 'triangle':
            return (Math.sqrt(3) * size * size) / 4;
        case 'wye':
            return ((21 - 10 * Math.sqrt(3)) * size * size) / 8;
        default:
            return (Math.PI * size * size) / 4;
    }
};
const registerSymbol = (key, factory) => {
    symbolFactories[`symbol${(0, upperFirst_1.default)(key)}`] = factory;
};
const Symbols = (_a) => {
    var { type = 'circle', size = 64, sizeType = 'area' } = _a, rest = __rest(_a, ["type", "size", "sizeType"]);
    const props = Object.assign(Object.assign({}, rest), { type, size, sizeType });
    const getPath = () => {
        const symbolFactory = getSymbolFactory(type);
        const symbol = (0, d3_shape_1.symbol)().type(symbolFactory).size(calculateAreaSize(size, sizeType, type));
        return symbol();
    };
    const { className, cx, cy } = props;
    const filteredProps = (0, ReactUtils_1.filterProps)(props, true);
    if (cx === +cx && cy === +cy && size === +size) {
        return (react_1.default.createElement("path", Object.assign({}, filteredProps, { className: (0, clsx_1.default)('recharts-symbols', className), transform: `translate(${cx}, ${cy})`, d: getPath() })));
    }
    return null;
};
exports.Symbols = Symbols;
exports.Symbols.registerSymbol = registerSymbol;
//# sourceMappingURL=Symbols.js.map