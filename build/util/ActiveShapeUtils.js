"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.getActiveShapeIndexForTooltip = exports.compareScatter = exports.comparePie = exports.compareFunnel = exports.isScatter = exports.isPie = exports.isFunnel = exports.Shape = exports.getPropsFromShapeOption = void 0;
const react_1 = __importStar(require("react"));
const isFunction_1 = __importDefault(require("lodash/isFunction"));
const isPlainObject_1 = __importDefault(require("lodash/isPlainObject"));
const isBoolean_1 = __importDefault(require("lodash/isBoolean"));
const isEqual_1 = __importDefault(require("lodash/isEqual"));
const Rectangle_1 = require("../shape/Rectangle");
const Trapezoid_1 = require("../shape/Trapezoid");
const Sector_1 = require("../shape/Sector");
const Layer_1 = require("../container/Layer");
const Symbols_1 = require("../shape/Symbols");
function defaultPropTransformer(option, props) {
    return Object.assign(Object.assign({}, props), option);
}
function isSymbolsProps(shapeType, _elementProps) {
    return shapeType === 'symbols';
}
function ShapeSelector({ shapeType, elementProps, }) {
    switch (shapeType) {
        case 'rectangle':
            return react_1.default.createElement(Rectangle_1.Rectangle, Object.assign({}, elementProps));
        case 'trapezoid':
            return react_1.default.createElement(Trapezoid_1.Trapezoid, Object.assign({}, elementProps));
        case 'sector':
            return react_1.default.createElement(Sector_1.Sector, Object.assign({}, elementProps));
        case 'symbols':
            if (isSymbolsProps(shapeType, elementProps)) {
                return react_1.default.createElement(Symbols_1.Symbols, Object.assign({}, elementProps));
            }
            break;
        default:
            return null;
    }
}
function getPropsFromShapeOption(option) {
    if ((0, react_1.isValidElement)(option)) {
        return option.props;
    }
    return option;
}
exports.getPropsFromShapeOption = getPropsFromShapeOption;
function Shape(_a) {
    var { option, shapeType, propTransformer = defaultPropTransformer, activeClassName = 'recharts-active-shape', isActive } = _a, props = __rest(_a, ["option", "shapeType", "propTransformer", "activeClassName", "isActive"]);
    let shape;
    if ((0, react_1.isValidElement)(option)) {
        shape = (0, react_1.cloneElement)(option, Object.assign(Object.assign({}, props), getPropsFromShapeOption(option)));
    }
    else if ((0, isFunction_1.default)(option)) {
        shape = option(props);
    }
    else if ((0, isPlainObject_1.default)(option) && !(0, isBoolean_1.default)(option)) {
        const nextProps = propTransformer(option, props);
        shape = react_1.default.createElement(ShapeSelector, { shapeType: shapeType, elementProps: nextProps });
    }
    else {
        const elementProps = props;
        shape = react_1.default.createElement(ShapeSelector, { shapeType: shapeType, elementProps: elementProps });
    }
    if (isActive) {
        return react_1.default.createElement(Layer_1.Layer, { className: activeClassName }, shape);
    }
    return shape;
}
exports.Shape = Shape;
function isFunnel(graphicalItem, _item) {
    return _item != null && 'trapezoids' in graphicalItem.props;
}
exports.isFunnel = isFunnel;
function isPie(graphicalItem, _item) {
    return _item != null && 'sectors' in graphicalItem.props;
}
exports.isPie = isPie;
function isScatter(graphicalItem, _item) {
    return _item != null && 'points' in graphicalItem.props;
}
exports.isScatter = isScatter;
function compareFunnel(shapeData, activeTooltipItem) {
    var _a, _b;
    const xMatches = shapeData.x === ((_a = activeTooltipItem === null || activeTooltipItem === void 0 ? void 0 : activeTooltipItem.labelViewBox) === null || _a === void 0 ? void 0 : _a.x) || shapeData.x === activeTooltipItem.x;
    const yMatches = shapeData.y === ((_b = activeTooltipItem === null || activeTooltipItem === void 0 ? void 0 : activeTooltipItem.labelViewBox) === null || _b === void 0 ? void 0 : _b.y) || shapeData.y === activeTooltipItem.y;
    return xMatches && yMatches;
}
exports.compareFunnel = compareFunnel;
function comparePie(shapeData, activeTooltipItem) {
    const startAngleMatches = shapeData.endAngle === activeTooltipItem.endAngle;
    const endAngleMatches = shapeData.startAngle === activeTooltipItem.startAngle;
    return startAngleMatches && endAngleMatches;
}
exports.comparePie = comparePie;
function compareScatter(shapeData, activeTooltipItem) {
    const xMatches = shapeData.x === activeTooltipItem.x;
    const yMatches = shapeData.y === activeTooltipItem.y;
    const zMatches = shapeData.z === activeTooltipItem.z;
    return xMatches && yMatches && zMatches;
}
exports.compareScatter = compareScatter;
function getComparisonFn(graphicalItem, activeItem) {
    let comparison;
    if (isFunnel(graphicalItem, activeItem)) {
        comparison = compareFunnel;
    }
    else if (isPie(graphicalItem, activeItem)) {
        comparison = comparePie;
    }
    else if (isScatter(graphicalItem, activeItem)) {
        comparison = compareScatter;
    }
    return comparison;
}
function getShapeDataKey(graphicalItem, activeItem) {
    let shapeKey;
    if (isFunnel(graphicalItem, activeItem)) {
        shapeKey = 'trapezoids';
    }
    else if (isPie(graphicalItem, activeItem)) {
        shapeKey = 'sectors';
    }
    else if (isScatter(graphicalItem, activeItem)) {
        shapeKey = 'points';
    }
    return shapeKey;
}
function getActiveShapeTooltipPayload(graphicalItem, activeItem) {
    var _a, _b, _c, _d, _e, _f;
    if (isFunnel(graphicalItem, activeItem)) {
        return (_c = (_b = (_a = activeItem.tooltipPayload) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.payload) === null || _c === void 0 ? void 0 : _c.payload;
    }
    if (isPie(graphicalItem, activeItem)) {
        return (_f = (_e = (_d = activeItem.tooltipPayload) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.payload) === null || _f === void 0 ? void 0 : _f.payload;
    }
    if (isScatter(graphicalItem, activeItem)) {
        return activeItem.payload;
    }
    return {};
}
function getActiveShapeIndexForTooltip({ activeTooltipItem, graphicalItem, itemData, }) {
    const shapeKey = getShapeDataKey(graphicalItem, activeTooltipItem);
    const tooltipPayload = getActiveShapeTooltipPayload(graphicalItem, activeTooltipItem);
    const activeItemMatches = itemData.filter((datum, dataIndex) => {
        const valuesMatch = (0, isEqual_1.default)(tooltipPayload, datum);
        const mouseCoordinateMatches = graphicalItem.props[shapeKey].filter((shapeData) => {
            const comparison = getComparisonFn(graphicalItem, activeTooltipItem);
            return comparison(shapeData, activeTooltipItem);
        });
        const indexOfMouseCoordinates = graphicalItem.props[shapeKey].indexOf(mouseCoordinateMatches[mouseCoordinateMatches.length - 1]);
        const coordinatesMatch = dataIndex === indexOfMouseCoordinates;
        return valuesMatch && coordinatesMatch;
    });
    const activeIndex = itemData.indexOf(activeItemMatches[activeItemMatches.length - 1]);
    return activeIndex;
}
exports.getActiveShapeIndexForTooltip = getActiveShapeIndexForTooltip;
//# sourceMappingURL=ActiveShapeUtils.js.map