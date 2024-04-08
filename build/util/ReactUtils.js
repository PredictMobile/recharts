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
exports.parseChildIndex = exports.getReactEventByType = exports.renderByOrder = exports.isChildrenEqual = exports.filterProps = exports.isValidSpreadableProp = exports.isDotProps = exports.validateWidthHeight = exports.findChildByType = exports.findAllByType = exports.toArray = exports.getDisplayName = exports.SCALE_TYPES = void 0;
const get_1 = __importDefault(require("lodash/get"));
const isNil_1 = __importDefault(require("lodash/isNil"));
const isString_1 = __importDefault(require("lodash/isString"));
const isFunction_1 = __importDefault(require("lodash/isFunction"));
const isObject_1 = __importDefault(require("lodash/isObject"));
const react_1 = require("react");
const react_is_1 = require("react-is");
const DataUtils_1 = require("./DataUtils");
const ShallowEqual_1 = require("./ShallowEqual");
const types_1 = require("./types");
const REACT_BROWSER_EVENT_MAP = {
    click: 'onClick',
    mousedown: 'onMouseDown',
    mouseup: 'onMouseUp',
    mouseover: 'onMouseOver',
    mousemove: 'onMouseMove',
    mouseout: 'onMouseOut',
    mouseenter: 'onMouseEnter',
    mouseleave: 'onMouseLeave',
    touchcancel: 'onTouchCancel',
    touchend: 'onTouchEnd',
    touchmove: 'onTouchMove',
    touchstart: 'onTouchStart',
};
exports.SCALE_TYPES = [
    'auto',
    'linear',
    'pow',
    'sqrt',
    'log',
    'identity',
    'time',
    'band',
    'point',
    'ordinal',
    'quantile',
    'quantize',
    'utc',
    'sequential',
    'threshold',
];
const getDisplayName = (Comp) => {
    if (typeof Comp === 'string') {
        return Comp;
    }
    if (!Comp) {
        return '';
    }
    return Comp.displayName || Comp.name || 'Component';
};
exports.getDisplayName = getDisplayName;
let lastChildren = null;
let lastResult = null;
const toArray = (children) => {
    if (children === lastChildren && Array.isArray(lastResult)) {
        return lastResult;
    }
    let result = [];
    react_1.Children.forEach(children, child => {
        if ((0, isNil_1.default)(child))
            return;
        if ((0, react_is_1.isFragment)(child)) {
            result = result.concat((0, exports.toArray)(child.props.children));
        }
        else {
            result.push(child);
        }
    });
    lastResult = result;
    lastChildren = children;
    return result;
};
exports.toArray = toArray;
function findAllByType(children, type) {
    const result = [];
    let types = [];
    if (Array.isArray(type)) {
        types = type.map(t => (0, exports.getDisplayName)(t));
    }
    else {
        types = [(0, exports.getDisplayName)(type)];
    }
    (0, exports.toArray)(children).forEach(child => {
        const childType = (0, get_1.default)(child, 'type.displayName') || (0, get_1.default)(child, 'type.name');
        if (types.indexOf(childType) !== -1) {
            result.push(child);
        }
    });
    return result;
}
exports.findAllByType = findAllByType;
function findChildByType(children, type) {
    const result = findAllByType(children, type);
    return result && result[0];
}
exports.findChildByType = findChildByType;
const validateWidthHeight = (el) => {
    if (!el || !el.props) {
        return false;
    }
    const { width, height } = el.props;
    if (!(0, DataUtils_1.isNumber)(width) || width <= 0 || !(0, DataUtils_1.isNumber)(height) || height <= 0) {
        return false;
    }
    return true;
};
exports.validateWidthHeight = validateWidthHeight;
const SVG_TAGS = [
    'a',
    'altGlyph',
    'altGlyphDef',
    'altGlyphItem',
    'animate',
    'animateColor',
    'animateMotion',
    'animateTransform',
    'circle',
    'clipPath',
    'color-profile',
    'cursor',
    'defs',
    'desc',
    'ellipse',
    'feBlend',
    'feColormatrix',
    'feComponentTransfer',
    'feComposite',
    'feConvolveMatrix',
    'feDiffuseLighting',
    'feDisplacementMap',
    'feDistantLight',
    'feFlood',
    'feFuncA',
    'feFuncB',
    'feFuncG',
    'feFuncR',
    'feGaussianBlur',
    'feImage',
    'feMerge',
    'feMergeNode',
    'feMorphology',
    'feOffset',
    'fePointLight',
    'feSpecularLighting',
    'feSpotLight',
    'feTile',
    'feTurbulence',
    'filter',
    'font',
    'font-face',
    'font-face-format',
    'font-face-name',
    'font-face-url',
    'foreignObject',
    'g',
    'glyph',
    'glyphRef',
    'hkern',
    'image',
    'line',
    'lineGradient',
    'marker',
    'mask',
    'metadata',
    'missing-glyph',
    'mpath',
    'path',
    'pattern',
    'polygon',
    'polyline',
    'radialGradient',
    'rect',
    'script',
    'set',
    'stop',
    'style',
    'svg',
    'switch',
    'symbol',
    'text',
    'textPath',
    'title',
    'tref',
    'tspan',
    'use',
    'view',
    'vkern',
];
const isSvgElement = (child) => child && child.type && (0, isString_1.default)(child.type) && SVG_TAGS.indexOf(child.type) >= 0;
const isDotProps = (dot) => dot && typeof dot === 'object' && 'cx' in dot && 'cy' in dot && 'r' in dot;
exports.isDotProps = isDotProps;
const isValidSpreadableProp = (property, key, includeEvents, svgElementType) => {
    var _a;
    const matchingElementTypeKeys = (_a = types_1.FilteredElementKeyMap === null || types_1.FilteredElementKeyMap === void 0 ? void 0 : types_1.FilteredElementKeyMap[svgElementType]) !== null && _a !== void 0 ? _a : [];
    return ((!(0, isFunction_1.default)(property) &&
        ((svgElementType && matchingElementTypeKeys.includes(key)) || types_1.SVGElementPropKeys.includes(key))) ||
        (includeEvents && types_1.EventKeys.includes(key)));
};
exports.isValidSpreadableProp = isValidSpreadableProp;
const filterProps = (props, includeEvents, svgElementType) => {
    if (!props || typeof props === 'function' || typeof props === 'boolean') {
        return null;
    }
    let inputProps = props;
    if ((0, react_1.isValidElement)(props)) {
        inputProps = props.props;
    }
    if (!(0, isObject_1.default)(inputProps)) {
        return null;
    }
    const out = {};
    Object.keys(inputProps).forEach(key => {
        if ((0, exports.isValidSpreadableProp)(inputProps === null || inputProps === void 0 ? void 0 : inputProps[key], key, includeEvents, svgElementType)) {
            out[key] = inputProps[key];
        }
    });
    return out;
};
exports.filterProps = filterProps;
const isChildrenEqual = (nextChildren, prevChildren) => {
    if (nextChildren === prevChildren) {
        return true;
    }
    const count = react_1.Children.count(nextChildren);
    if (count !== react_1.Children.count(prevChildren)) {
        return false;
    }
    if (count === 0) {
        return true;
    }
    if (count === 1) {
        return isSingleChildEqual(Array.isArray(nextChildren) ? nextChildren[0] : nextChildren, Array.isArray(prevChildren) ? prevChildren[0] : prevChildren);
    }
    for (let i = 0; i < count; i++) {
        const nextChild = nextChildren[i];
        const prevChild = prevChildren[i];
        if (Array.isArray(nextChild) || Array.isArray(prevChild)) {
            if (!(0, exports.isChildrenEqual)(nextChild, prevChild)) {
                return false;
            }
        }
        else if (!isSingleChildEqual(nextChild, prevChild)) {
            return false;
        }
    }
    return true;
};
exports.isChildrenEqual = isChildrenEqual;
const isSingleChildEqual = (nextChild, prevChild) => {
    if ((0, isNil_1.default)(nextChild) && (0, isNil_1.default)(prevChild)) {
        return true;
    }
    if (!(0, isNil_1.default)(nextChild) && !(0, isNil_1.default)(prevChild)) {
        const _a = nextChild.props || {}, { children: nextChildren } = _a, nextProps = __rest(_a, ["children"]);
        const _b = prevChild.props || {}, { children: prevChildren } = _b, prevProps = __rest(_b, ["children"]);
        if (nextChildren && prevChildren) {
            return (0, ShallowEqual_1.shallowEqual)(nextProps, prevProps) && (0, exports.isChildrenEqual)(nextChildren, prevChildren);
        }
        if (!nextChildren && !prevChildren) {
            return (0, ShallowEqual_1.shallowEqual)(nextProps, prevProps);
        }
        return false;
    }
    return false;
};
const renderByOrder = (children, renderMap) => {
    const elements = [];
    const record = {};
    (0, exports.toArray)(children).forEach((child, index) => {
        if (isSvgElement(child)) {
            elements.push(child);
        }
        else if (child) {
            const displayName = (0, exports.getDisplayName)(child.type);
            const { handler, once } = renderMap[displayName] || {};
            if (handler && (!once || !record[displayName])) {
                const results = handler(child, displayName, index);
                elements.push(results);
                record[displayName] = true;
            }
        }
    });
    return elements;
};
exports.renderByOrder = renderByOrder;
const getReactEventByType = (e) => {
    const type = e && e.type;
    if (type && REACT_BROWSER_EVENT_MAP[type]) {
        return REACT_BROWSER_EVENT_MAP[type];
    }
    return null;
};
exports.getReactEventByType = getReactEventByType;
const parseChildIndex = (child, children) => {
    return (0, exports.toArray)(children).indexOf(child);
};
exports.parseChildIndex = parseChildIndex;
//# sourceMappingURL=ReactUtils.js.map