"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePrefixStyle = void 0;
const PREFIX_LIST = ['Webkit', 'Moz', 'O', 'ms'];
const generatePrefixStyle = (name, value) => {
    if (!name) {
        return null;
    }
    const camelName = name.replace(/(\w)/, v => v.toUpperCase());
    const result = PREFIX_LIST.reduce((res, entry) => (Object.assign(Object.assign({}, res), { [entry + camelName]: value })), {});
    result[name] = value;
    return result;
};
exports.generatePrefixStyle = generatePrefixStyle;
//# sourceMappingURL=CssPrefixUtils.js.map