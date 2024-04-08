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
exports.LabelList = void 0;
const react_1 = __importStar(require("react"));
const isNil_1 = __importDefault(require("lodash/isNil"));
const isObject_1 = __importDefault(require("lodash/isObject"));
const isFunction_1 = __importDefault(require("lodash/isFunction"));
const last_1 = __importDefault(require("lodash/last"));
const Label_1 = require("./Label");
const Layer_1 = require("../container/Layer");
const ReactUtils_1 = require("../util/ReactUtils");
const ChartUtils_1 = require("../util/ChartUtils");
const defaultAccessor = (entry) => (Array.isArray(entry.value) ? (0, last_1.default)(entry.value) : entry.value);
function LabelList(_a) {
    var { valueAccessor = defaultAccessor } = _a, restProps = __rest(_a, ["valueAccessor"]);
    const { data, dataKey, clockWise, id, textBreakAll } = restProps, others = __rest(restProps, ["data", "dataKey", "clockWise", "id", "textBreakAll"]);
    if (!data || !data.length) {
        return null;
    }
    return (react_1.default.createElement(Layer_1.Layer, { className: "recharts-label-list" }, data.map((entry, index) => {
        const value = (0, isNil_1.default)(dataKey) ? valueAccessor(entry, index) : (0, ChartUtils_1.getValueByDataKey)(entry && entry.payload, dataKey);
        const idProps = (0, isNil_1.default)(id) ? {} : { id: `${id}-${index}` };
        return (react_1.default.createElement(Label_1.Label, Object.assign({}, (0, ReactUtils_1.filterProps)(entry, true), others, idProps, { parentViewBox: entry.parentViewBox, value: value, textBreakAll: textBreakAll, viewBox: Label_1.Label.parseViewBox((0, isNil_1.default)(clockWise) ? entry : Object.assign(Object.assign({}, entry), { clockWise })), key: `label-${index}`, index: index })));
    })));
}
exports.LabelList = LabelList;
LabelList.displayName = 'LabelList';
function parseLabelList(label, data) {
    if (!label) {
        return null;
    }
    if (label === true) {
        return react_1.default.createElement(LabelList, { key: "labelList-implicit", data: data });
    }
    if (react_1.default.isValidElement(label) || (0, isFunction_1.default)(label)) {
        return react_1.default.createElement(LabelList, { key: "labelList-implicit", data: data, content: label });
    }
    if ((0, isObject_1.default)(label)) {
        return react_1.default.createElement(LabelList, Object.assign({ data: data }, label, { key: "labelList-implicit" }));
    }
    return null;
}
function renderCallByParent(parentProps, data, checkPropsLabel = true) {
    if (!parentProps || (!parentProps.children && checkPropsLabel && !parentProps.label)) {
        return null;
    }
    const { children } = parentProps;
    const explicitChildren = (0, ReactUtils_1.findAllByType)(children, LabelList).map((child, index) => (0, react_1.cloneElement)(child, {
        data,
        key: `labelList-${index}`,
    }));
    if (!checkPropsLabel) {
        return explicitChildren;
    }
    const implicitLabelList = parseLabelList(parentProps.label, data);
    return [implicitLabelList, ...explicitChildren];
}
LabelList.renderCallByParent = renderCallByParent;
//# sourceMappingURL=LabelList.js.map