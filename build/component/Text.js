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
exports.Text = void 0;
const react_1 = __importStar(require("react"));
const isNil_1 = __importDefault(require("lodash/isNil"));
const clsx_1 = __importDefault(require("clsx"));
const DataUtils_1 = require("../util/DataUtils");
const Global_1 = require("../util/Global");
const ReactUtils_1 = require("../util/ReactUtils");
const DOMUtils_1 = require("../util/DOMUtils");
const ReduceCSSCalc_1 = require("../util/ReduceCSSCalc");
const BREAKING_SPACES = /[ \f\n\r\t\v\u2028\u2029]+/;
const calculateWordWidths = ({ children, breakAll, style }) => {
    try {
        let words = [];
        if (!(0, isNil_1.default)(children)) {
            if (breakAll) {
                words = children.toString().split('');
            }
            else {
                words = children.toString().split(BREAKING_SPACES);
            }
        }
        const wordsWithComputedWidth = words.map(word => ({ word, width: (0, DOMUtils_1.getStringSize)(word, style).width }));
        const spaceWidth = breakAll ? 0 : (0, DOMUtils_1.getStringSize)('\u00A0', style).width;
        return { wordsWithComputedWidth, spaceWidth };
    }
    catch (e) {
        return null;
    }
};
const calculateWordsByLines = ({ maxLines, children, style, breakAll }, initialWordsWithComputedWith, spaceWidth, lineWidth, scaleToFit) => {
    const shouldLimitLines = (0, DataUtils_1.isNumber)(maxLines);
    const text = children;
    const calculate = (words = []) => words.reduce((result, { word, width }) => {
        const currentLine = result[result.length - 1];
        if (currentLine &&
            (lineWidth == null || scaleToFit || currentLine.width + width + spaceWidth < Number(lineWidth))) {
            currentLine.words.push(word);
            currentLine.width += width + spaceWidth;
        }
        else {
            const newLine = { words: [word], width };
            result.push(newLine);
        }
        return result;
    }, []);
    const originalResult = calculate(initialWordsWithComputedWith);
    const findLongestLine = (words) => words.reduce((a, b) => (a.width > b.width ? a : b));
    if (!shouldLimitLines) {
        return originalResult;
    }
    const suffix = '…';
    const checkOverflow = (index) => {
        const tempText = text.slice(0, index);
        const words = calculateWordWidths({
            breakAll,
            style,
            children: tempText + suffix,
        }).wordsWithComputedWidth;
        const result = calculate(words);
        const doesOverflow = result.length > maxLines || findLongestLine(result).width > Number(lineWidth);
        return [doesOverflow, result];
    };
    let start = 0;
    let end = text.length - 1;
    let iterations = 0;
    let trimmedResult;
    while (start <= end && iterations <= text.length - 1) {
        const middle = Math.floor((start + end) / 2);
        const prev = middle - 1;
        const [doesPrevOverflow, result] = checkOverflow(prev);
        const [doesMiddleOverflow] = checkOverflow(middle);
        if (!doesPrevOverflow && !doesMiddleOverflow) {
            start = middle + 1;
        }
        if (doesPrevOverflow && doesMiddleOverflow) {
            end = middle - 1;
        }
        if (!doesPrevOverflow && doesMiddleOverflow) {
            trimmedResult = result;
            break;
        }
        iterations++;
    }
    return trimmedResult || originalResult;
};
const getWordsWithoutCalculate = (children) => {
    const words = !(0, isNil_1.default)(children) ? children.toString().split(BREAKING_SPACES) : [];
    return [{ words }];
};
const getWordsByLines = ({ width, scaleToFit, children, style, breakAll, maxLines }) => {
    if ((width || scaleToFit) && !Global_1.Global.isSsr) {
        let wordsWithComputedWidth, spaceWidth;
        const wordWidths = calculateWordWidths({ breakAll, children, style });
        if (wordWidths) {
            const { wordsWithComputedWidth: wcw, spaceWidth: sw } = wordWidths;
            wordsWithComputedWidth = wcw;
            spaceWidth = sw;
        }
        else {
            return getWordsWithoutCalculate(children);
        }
        return calculateWordsByLines({ breakAll, children, maxLines, style }, wordsWithComputedWidth, spaceWidth, width, scaleToFit);
    }
    return getWordsWithoutCalculate(children);
};
const DEFAULT_FILL = '#808080';
const Text = (_a) => {
    var { x: propsX = 0, y: propsY = 0, lineHeight = '1em', capHeight = '0.71em', scaleToFit = false, textAnchor = 'start', verticalAnchor = 'end', fill = DEFAULT_FILL } = _a, props = __rest(_a, ["x", "y", "lineHeight", "capHeight", "scaleToFit", "textAnchor", "verticalAnchor", "fill"]);
    const wordsByLines = (0, react_1.useMemo)(() => {
        return getWordsByLines({
            breakAll: props.breakAll,
            children: props.children,
            maxLines: props.maxLines,
            scaleToFit,
            style: props.style,
            width: props.width,
        });
    }, [props.breakAll, props.children, props.maxLines, scaleToFit, props.style, props.width]);
    const { dx, dy, angle, className, breakAll } = props, textProps = __rest(props, ["dx", "dy", "angle", "className", "breakAll"]);
    if (!(0, DataUtils_1.isNumOrStr)(propsX) || !(0, DataUtils_1.isNumOrStr)(propsY)) {
        return null;
    }
    const x = propsX + ((0, DataUtils_1.isNumber)(dx) ? dx : 0);
    const y = propsY + ((0, DataUtils_1.isNumber)(dy) ? dy : 0);
    let startDy;
    switch (verticalAnchor) {
        case 'start':
            startDy = (0, ReduceCSSCalc_1.reduceCSSCalc)(`calc(${capHeight})`);
            break;
        case 'middle':
            startDy = (0, ReduceCSSCalc_1.reduceCSSCalc)(`calc(${(wordsByLines.length - 1) / 2} * -${lineHeight} + (${capHeight} / 2))`);
            break;
        default:
            startDy = (0, ReduceCSSCalc_1.reduceCSSCalc)(`calc(${wordsByLines.length - 1} * -${lineHeight})`);
            break;
    }
    const transforms = [];
    if (scaleToFit) {
        const lineWidth = wordsByLines[0].width;
        const { width } = props;
        transforms.push(`scale(${((0, DataUtils_1.isNumber)(width) ? width / lineWidth : 1) / lineWidth})`);
    }
    if (angle) {
        transforms.push(`rotate(${angle}, ${x}, ${y})`);
    }
    if (transforms.length) {
        textProps.transform = transforms.join(' ');
    }
    return (react_1.default.createElement("text", Object.assign({}, (0, ReactUtils_1.filterProps)(textProps, true), { x: x, y: y, className: (0, clsx_1.default)('recharts-text', className), textAnchor: textAnchor, fill: fill.includes('url') ? DEFAULT_FILL : fill }), wordsByLines.map((line, index) => {
        const words = line.words.join(breakAll ? '' : ' ');
        return (react_1.default.createElement("tspan", { x: x, dy: index === 0 ? startDy : lineHeight, key: words }, words));
    })));
};
exports.Text = Text;
//# sourceMappingURL=Text.js.map