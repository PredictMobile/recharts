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
exports.Label = void 0;
const react_1 = __importStar(require("react"));
const isNil_1 = __importDefault(require("lodash/isNil"));
const isFunction_1 = __importDefault(require("lodash/isFunction"));
const isObject_1 = __importDefault(require("lodash/isObject"));
const clsx_1 = __importDefault(require("clsx"));
const Text_1 = require("./Text");
const ReactUtils_1 = require("../util/ReactUtils");
const DataUtils_1 = require("../util/DataUtils");
const PolarUtils_1 = require("../util/PolarUtils");
const getLabel = (props) => {
    const { value, formatter } = props;
    const label = (0, isNil_1.default)(props.children) ? value : props.children;
    if ((0, isFunction_1.default)(formatter)) {
        return formatter(label);
    }
    return label;
};
const getDeltaAngle = (startAngle, endAngle) => {
    const sign = (0, DataUtils_1.mathSign)(endAngle - startAngle);
    const deltaAngle = Math.min(Math.abs(endAngle - startAngle), 360);
    return sign * deltaAngle;
};
const renderRadialLabel = (labelProps, label, attrs) => {
    const { position, viewBox, offset, className } = labelProps;
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, clockWise } = viewBox;
    const radius = (innerRadius + outerRadius) / 2;
    const deltaAngle = getDeltaAngle(startAngle, endAngle);
    const sign = deltaAngle >= 0 ? 1 : -1;
    let labelAngle, direction;
    if (position === 'insideStart') {
        labelAngle = startAngle + sign * offset;
        direction = clockWise;
    }
    else if (position === 'insideEnd') {
        labelAngle = endAngle - sign * offset;
        direction = !clockWise;
    }
    else if (position === 'end') {
        labelAngle = endAngle + sign * offset;
        direction = clockWise;
    }
    direction = deltaAngle <= 0 ? direction : !direction;
    const startPoint = (0, PolarUtils_1.polarToCartesian)(cx, cy, radius, labelAngle);
    const endPoint = (0, PolarUtils_1.polarToCartesian)(cx, cy, radius, labelAngle + (direction ? 1 : -1) * 359);
    const path = `M${startPoint.x},${startPoint.y}
    A${radius},${radius},0,1,${direction ? 0 : 1},
    ${endPoint.x},${endPoint.y}`;
    const id = (0, isNil_1.default)(labelProps.id) ? (0, DataUtils_1.uniqueId)('recharts-radial-line-') : labelProps.id;
    return (react_1.default.createElement("text", Object.assign({}, attrs, { dominantBaseline: "central", className: (0, clsx_1.default)('recharts-radial-bar-label', className) }),
        react_1.default.createElement("defs", null,
            react_1.default.createElement("path", { id: id, d: path })),
        react_1.default.createElement("textPath", { xlinkHref: `#${id}` }, label)));
};
const getAttrsOfPolarLabel = (props) => {
    const { viewBox, offset, position } = props;
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle } = viewBox;
    const midAngle = (startAngle + endAngle) / 2;
    if (position === 'outside') {
        const { x, y } = (0, PolarUtils_1.polarToCartesian)(cx, cy, outerRadius + offset, midAngle);
        return {
            x,
            y,
            textAnchor: x >= cx ? 'start' : 'end',
            verticalAnchor: 'middle',
        };
    }
    if (position === 'center') {
        return {
            x: cx,
            y: cy,
            textAnchor: 'middle',
            verticalAnchor: 'middle',
        };
    }
    if (position === 'centerTop') {
        return {
            x: cx,
            y: cy,
            textAnchor: 'middle',
            verticalAnchor: 'start',
        };
    }
    if (position === 'centerBottom') {
        return {
            x: cx,
            y: cy,
            textAnchor: 'middle',
            verticalAnchor: 'end',
        };
    }
    const r = (innerRadius + outerRadius) / 2;
    const { x, y } = (0, PolarUtils_1.polarToCartesian)(cx, cy, r, midAngle);
    return {
        x,
        y,
        textAnchor: 'middle',
        verticalAnchor: 'middle',
    };
};
const getAttrsOfCartesianLabel = (props) => {
    const { viewBox, parentViewBox, offset, position } = props;
    const { x, y, width, height } = viewBox;
    const verticalSign = height >= 0 ? 1 : -1;
    const verticalOffset = verticalSign * offset;
    const verticalEnd = verticalSign > 0 ? 'end' : 'start';
    const verticalStart = verticalSign > 0 ? 'start' : 'end';
    const horizontalSign = width >= 0 ? 1 : -1;
    const horizontalOffset = horizontalSign * offset;
    const horizontalEnd = horizontalSign > 0 ? 'end' : 'start';
    const horizontalStart = horizontalSign > 0 ? 'start' : 'end';
    if (position === 'top') {
        const attrs = {
            x: x + width / 2,
            y: y - verticalSign * offset,
            textAnchor: 'middle',
            verticalAnchor: verticalEnd,
        };
        return Object.assign(Object.assign({}, attrs), (parentViewBox
            ? {
                height: Math.max(y - parentViewBox.y, 0),
                width,
            }
            : {}));
    }
    if (position === 'bottom') {
        const attrs = {
            x: x + width / 2,
            y: y + height + verticalOffset,
            textAnchor: 'middle',
            verticalAnchor: verticalStart,
        };
        return Object.assign(Object.assign({}, attrs), (parentViewBox
            ? {
                height: Math.max(parentViewBox.y + parentViewBox.height - (y + height), 0),
                width,
            }
            : {}));
    }
    if (position === 'left') {
        const attrs = {
            x: x - horizontalOffset,
            y: y + height / 2,
            textAnchor: horizontalEnd,
            verticalAnchor: 'middle',
        };
        return Object.assign(Object.assign({}, attrs), (parentViewBox
            ? {
                width: Math.max(attrs.x - parentViewBox.x, 0),
                height,
            }
            : {}));
    }
    if (position === 'right') {
        const attrs = {
            x: x + width + horizontalOffset,
            y: y + height / 2,
            textAnchor: horizontalStart,
            verticalAnchor: 'middle',
        };
        return Object.assign(Object.assign({}, attrs), (parentViewBox
            ? {
                width: Math.max(parentViewBox.x + parentViewBox.width - attrs.x, 0),
                height,
            }
            : {}));
    }
    const sizeAttrs = parentViewBox ? { width, height } : {};
    if (position === 'insideLeft') {
        return Object.assign({ x: x + horizontalOffset, y: y + height / 2, textAnchor: horizontalStart, verticalAnchor: 'middle' }, sizeAttrs);
    }
    if (position === 'insideRight') {
        return Object.assign({ x: x + width - horizontalOffset, y: y + height / 2, textAnchor: horizontalEnd, verticalAnchor: 'middle' }, sizeAttrs);
    }
    if (position === 'insideTop') {
        return Object.assign({ x: x + width / 2, y: y + verticalOffset, textAnchor: 'middle', verticalAnchor: verticalStart }, sizeAttrs);
    }
    if (position === 'insideBottom') {
        return Object.assign({ x: x + width / 2, y: y + height - verticalOffset, textAnchor: 'middle', verticalAnchor: verticalEnd }, sizeAttrs);
    }
    if (position === 'insideTopLeft') {
        return Object.assign({ x: x + horizontalOffset, y: y + verticalOffset, textAnchor: horizontalStart, verticalAnchor: verticalStart }, sizeAttrs);
    }
    if (position === 'insideTopRight') {
        return Object.assign({ x: x + width - horizontalOffset, y: y + verticalOffset, textAnchor: horizontalEnd, verticalAnchor: verticalStart }, sizeAttrs);
    }
    if (position === 'insideBottomLeft') {
        return Object.assign({ x: x + horizontalOffset, y: y + height - verticalOffset, textAnchor: horizontalStart, verticalAnchor: verticalEnd }, sizeAttrs);
    }
    if (position === 'insideBottomRight') {
        return Object.assign({ x: x + width - horizontalOffset, y: y + height - verticalOffset, textAnchor: horizontalEnd, verticalAnchor: verticalEnd }, sizeAttrs);
    }
    if ((0, isObject_1.default)(position) &&
        ((0, DataUtils_1.isNumber)(position.x) || (0, DataUtils_1.isPercent)(position.x)) &&
        ((0, DataUtils_1.isNumber)(position.y) || (0, DataUtils_1.isPercent)(position.y))) {
        return Object.assign({ x: x + (0, DataUtils_1.getPercentValue)(position.x, width), y: y + (0, DataUtils_1.getPercentValue)(position.y, height), textAnchor: 'end', verticalAnchor: 'end' }, sizeAttrs);
    }
    return Object.assign({ x: x + width / 2, y: y + height / 2, textAnchor: 'middle', verticalAnchor: 'middle' }, sizeAttrs);
};
const isPolar = (viewBox) => 'cx' in viewBox && (0, DataUtils_1.isNumber)(viewBox.cx);
function Label(_a) {
    var { offset = 5 } = _a, restProps = __rest(_a, ["offset"]);
    const props = Object.assign({ offset }, restProps);
    const { viewBox, position, value, children, content, className = '', textBreakAll } = props;
    if (!viewBox || ((0, isNil_1.default)(value) && (0, isNil_1.default)(children) && !(0, react_1.isValidElement)(content) && !(0, isFunction_1.default)(content))) {
        return null;
    }
    if ((0, react_1.isValidElement)(content)) {
        return (0, react_1.cloneElement)(content, props);
    }
    let label;
    if ((0, isFunction_1.default)(content)) {
        label = (0, react_1.createElement)(content, props);
        if ((0, react_1.isValidElement)(label)) {
            return label;
        }
    }
    else {
        label = getLabel(props);
    }
    const isPolarLabel = isPolar(viewBox);
    const attrs = (0, ReactUtils_1.filterProps)(props, true);
    if (isPolarLabel && (position === 'insideStart' || position === 'insideEnd' || position === 'end')) {
        return renderRadialLabel(props, label, attrs);
    }
    const positionAttrs = isPolarLabel ? getAttrsOfPolarLabel(props) : getAttrsOfCartesianLabel(props);
    return (react_1.default.createElement(Text_1.Text, Object.assign({ className: (0, clsx_1.default)('recharts-label', className) }, attrs, positionAttrs, { breakAll: textBreakAll }), label));
}
exports.Label = Label;
Label.displayName = 'Label';
const parseViewBox = (props) => {
    const { cx, cy, angle, startAngle, endAngle, r, radius, innerRadius, outerRadius, x, y, top, left, width, height, clockWise, labelViewBox, } = props;
    if (labelViewBox) {
        return labelViewBox;
    }
    if ((0, DataUtils_1.isNumber)(width) && (0, DataUtils_1.isNumber)(height)) {
        if ((0, DataUtils_1.isNumber)(x) && (0, DataUtils_1.isNumber)(y)) {
            return { x, y, width, height };
        }
        if ((0, DataUtils_1.isNumber)(top) && (0, DataUtils_1.isNumber)(left)) {
            return { x: top, y: left, width, height };
        }
    }
    if ((0, DataUtils_1.isNumber)(x) && (0, DataUtils_1.isNumber)(y)) {
        return { x, y, width: 0, height: 0 };
    }
    if ((0, DataUtils_1.isNumber)(cx) && (0, DataUtils_1.isNumber)(cy)) {
        return {
            cx,
            cy,
            startAngle: startAngle || angle || 0,
            endAngle: endAngle || angle || 0,
            innerRadius: innerRadius || 0,
            outerRadius: outerRadius || radius || r || 0,
            clockWise,
        };
    }
    if (props.viewBox) {
        return props.viewBox;
    }
    return {};
};
const parseLabel = (label, viewBox) => {
    if (!label) {
        return null;
    }
    if (label === true) {
        return react_1.default.createElement(Label, { key: "label-implicit", viewBox: viewBox });
    }
    if ((0, DataUtils_1.isNumOrStr)(label)) {
        return react_1.default.createElement(Label, { key: "label-implicit", viewBox: viewBox, value: label });
    }
    if ((0, react_1.isValidElement)(label)) {
        if (label.type === Label) {
            return (0, react_1.cloneElement)(label, { key: 'label-implicit', viewBox });
        }
        return react_1.default.createElement(Label, { key: "label-implicit", content: label, viewBox: viewBox });
    }
    if ((0, isFunction_1.default)(label)) {
        return react_1.default.createElement(Label, { key: "label-implicit", content: label, viewBox: viewBox });
    }
    if ((0, isObject_1.default)(label)) {
        return react_1.default.createElement(Label, Object.assign({ viewBox: viewBox }, label, { key: "label-implicit" }));
    }
    return null;
};
const renderCallByParent = (parentProps, viewBox, checkPropsLabel = true) => {
    if (!parentProps || (!parentProps.children && checkPropsLabel && !parentProps.label)) {
        return null;
    }
    const { children } = parentProps;
    const parentViewBox = parseViewBox(parentProps);
    const explicitChildren = (0, ReactUtils_1.findAllByType)(children, Label).map((child, index) => {
        return (0, react_1.cloneElement)(child, {
            viewBox: viewBox || parentViewBox,
            key: `label-${index}`,
        });
    });
    if (!checkPropsLabel) {
        return explicitChildren;
    }
    const implicitLabel = parseLabel(parentProps.label, viewBox || parentViewBox);
    return [implicitLabel, ...explicitChildren];
};
Label.parseViewBox = parseViewBox;
Label.renderCallByParent = renderCallByParent;
//# sourceMappingURL=Label.js.map