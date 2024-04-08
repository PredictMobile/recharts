"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reduceCSSCalc = exports.safeEvaluateExpression = void 0;
const MULTIPLY_OR_DIVIDE_REGEX = /(-?\d+(?:\.\d+)?[a-zA-Z%]*)([*/])(-?\d+(?:\.\d+)?[a-zA-Z%]*)/;
const ADD_OR_SUBTRACT_REGEX = /(-?\d+(?:\.\d+)?[a-zA-Z%]*)([+-])(-?\d+(?:\.\d+)?[a-zA-Z%]*)/;
const CSS_LENGTH_UNIT_REGEX = /^px|cm|vh|vw|em|rem|%|mm|in|pt|pc|ex|ch|vmin|vmax|Q$/;
const NUM_SPLIT_REGEX = /(-?\d+(?:\.\d+)?)([a-zA-Z%]+)?/;
const CONVERSION_RATES = {
    cm: 96 / 2.54,
    mm: 96 / 25.4,
    pt: 96 / 72,
    pc: 96 / 6,
    in: 96,
    Q: 96 / (2.54 * 40),
    px: 1,
};
const FIXED_CSS_LENGTH_UNITS = Object.keys(CONVERSION_RATES);
const STR_NAN = 'NaN';
function convertToPx(value, unit) {
    return value * CONVERSION_RATES[unit];
}
class DecimalCSS {
    static parse(str) {
        var _a;
        const [, numStr, unit] = (_a = NUM_SPLIT_REGEX.exec(str)) !== null && _a !== void 0 ? _a : [];
        return new DecimalCSS(parseFloat(numStr), unit !== null && unit !== void 0 ? unit : '');
    }
    constructor(num, unit) {
        this.num = num;
        this.unit = unit;
        this.num = num;
        this.unit = unit;
        if (Number.isNaN(num)) {
            this.unit = '';
        }
        if (unit !== '' && !CSS_LENGTH_UNIT_REGEX.test(unit)) {
            this.num = NaN;
            this.unit = '';
        }
        if (FIXED_CSS_LENGTH_UNITS.includes(unit)) {
            this.num = convertToPx(num, unit);
            this.unit = 'px';
        }
    }
    add(other) {
        if (this.unit !== other.unit) {
            return new DecimalCSS(NaN, '');
        }
        return new DecimalCSS(this.num + other.num, this.unit);
    }
    subtract(other) {
        if (this.unit !== other.unit) {
            return new DecimalCSS(NaN, '');
        }
        return new DecimalCSS(this.num - other.num, this.unit);
    }
    multiply(other) {
        if (this.unit !== '' && other.unit !== '' && this.unit !== other.unit) {
            return new DecimalCSS(NaN, '');
        }
        return new DecimalCSS(this.num * other.num, this.unit || other.unit);
    }
    divide(other) {
        if (this.unit !== '' && other.unit !== '' && this.unit !== other.unit) {
            return new DecimalCSS(NaN, '');
        }
        return new DecimalCSS(this.num / other.num, this.unit || other.unit);
    }
    toString() {
        return `${this.num}${this.unit}`;
    }
    isNaN() {
        return Number.isNaN(this.num);
    }
}
function calculateArithmetic(expr) {
    var _a, _b;
    if (expr.includes(STR_NAN)) {
        return STR_NAN;
    }
    let newExpr = expr;
    while (newExpr.includes('*') || newExpr.includes('/')) {
        const [, leftOperand, operator, rightOperand] = (_a = MULTIPLY_OR_DIVIDE_REGEX.exec(newExpr)) !== null && _a !== void 0 ? _a : [];
        const lTs = DecimalCSS.parse(leftOperand !== null && leftOperand !== void 0 ? leftOperand : '');
        const rTs = DecimalCSS.parse(rightOperand !== null && rightOperand !== void 0 ? rightOperand : '');
        const result = operator === '*' ? lTs.multiply(rTs) : lTs.divide(rTs);
        if (result.isNaN()) {
            return STR_NAN;
        }
        newExpr = newExpr.replace(MULTIPLY_OR_DIVIDE_REGEX, result.toString());
    }
    while (newExpr.includes('+') || /.-\d+(?:\.\d+)?/.test(newExpr)) {
        const [, leftOperand, operator, rightOperand] = (_b = ADD_OR_SUBTRACT_REGEX.exec(newExpr)) !== null && _b !== void 0 ? _b : [];
        const lTs = DecimalCSS.parse(leftOperand !== null && leftOperand !== void 0 ? leftOperand : '');
        const rTs = DecimalCSS.parse(rightOperand !== null && rightOperand !== void 0 ? rightOperand : '');
        const result = operator === '+' ? lTs.add(rTs) : lTs.subtract(rTs);
        if (result.isNaN()) {
            return STR_NAN;
        }
        newExpr = newExpr.replace(ADD_OR_SUBTRACT_REGEX, result.toString());
    }
    return newExpr;
}
const PARENTHESES_REGEX = /\(([^()]*)\)/;
function calculateParentheses(expr) {
    let newExpr = expr;
    while (newExpr.includes('(')) {
        const [, parentheticalExpression] = PARENTHESES_REGEX.exec(newExpr);
        newExpr = newExpr.replace(PARENTHESES_REGEX, calculateArithmetic(parentheticalExpression));
    }
    return newExpr;
}
function evaluateExpression(expression) {
    let newExpr = expression.replace(/\s+/g, '');
    newExpr = calculateParentheses(newExpr);
    newExpr = calculateArithmetic(newExpr);
    return newExpr;
}
function safeEvaluateExpression(expression) {
    try {
        return evaluateExpression(expression);
    }
    catch (e) {
        return STR_NAN;
    }
}
exports.safeEvaluateExpression = safeEvaluateExpression;
function reduceCSSCalc(expression) {
    const result = safeEvaluateExpression(expression.slice(5, -1));
    if (result === STR_NAN) {
        return '';
    }
    return result;
}
exports.reduceCSSCalc = reduceCSSCalc;
//# sourceMappingURL=ReduceCSSCalc.js.map