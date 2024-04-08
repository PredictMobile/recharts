"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultTooltipContent = void 0;
const react_1 = __importDefault(require("react"));
const sortBy_1 = __importDefault(require("lodash/sortBy"));
const isNil_1 = __importDefault(require("lodash/isNil"));
const clsx_1 = __importDefault(require("clsx"));
const DataUtils_1 = require("../util/DataUtils");
function defaultFormatter(value) {
    return Array.isArray(value) && (0, DataUtils_1.isNumOrStr)(value[0]) && (0, DataUtils_1.isNumOrStr)(value[1]) ? value.join(' ~ ') : value;
}
const DefaultTooltipContent = (props) => {
    const { separator = ' : ', contentStyle = {}, itemStyle = {}, labelStyle = {}, payload, formatter, itemSorter, wrapperClassName, labelClassName, label, labelFormatter, accessibilityLayer = false, } = props;
    const renderContent = () => {
        if (payload && payload.length) {
            const listStyle = { padding: 0, margin: 0 };
            const items = (itemSorter ? (0, sortBy_1.default)(payload, itemSorter) : payload).map((entry, i) => {
                if (entry.type === 'none') {
                    return null;
                }
                const finalItemStyle = Object.assign({ display: 'block', paddingTop: 4, paddingBottom: 4, color: entry.color || '#000' }, itemStyle);
                const finalFormatter = entry.formatter || formatter || defaultFormatter;
                const { value, name } = entry;
                let finalValue = value;
                let finalName = name;
                if (finalFormatter && finalValue != null && finalName != null) {
                    const formatted = finalFormatter(value, name, entry, i, payload);
                    if (Array.isArray(formatted)) {
                        [finalValue, finalName] = formatted;
                    }
                    else {
                        finalValue = formatted;
                    }
                }
                return (react_1.default.createElement("li", { className: "recharts-tooltip-item", key: `tooltip-item-${i}`, style: finalItemStyle },
                    (0, DataUtils_1.isNumOrStr)(finalName) ? react_1.default.createElement("span", { className: "recharts-tooltip-item-name" }, finalName) : null,
                    (0, DataUtils_1.isNumOrStr)(finalName) ? react_1.default.createElement("span", { className: "recharts-tooltip-item-separator" }, separator) : null,
                    react_1.default.createElement("span", { className: "recharts-tooltip-item-value" }, finalValue),
                    react_1.default.createElement("span", { className: "recharts-tooltip-item-unit" }, entry.unit || '')));
            });
            return (react_1.default.createElement("ul", { className: "recharts-tooltip-item-list", style: listStyle }, items));
        }
        return null;
    };
    const finalStyle = Object.assign({ margin: 0, padding: 10, backgroundColor: '#fff', border: '1px solid #ccc', whiteSpace: 'nowrap' }, contentStyle);
    const finalLabelStyle = Object.assign({ margin: 0 }, labelStyle);
    const hasLabel = !(0, isNil_1.default)(label);
    let finalLabel = hasLabel ? label : '';
    const wrapperCN = (0, clsx_1.default)('recharts-default-tooltip', wrapperClassName);
    const labelCN = (0, clsx_1.default)('recharts-tooltip-label', labelClassName);
    if (hasLabel && labelFormatter && payload !== undefined && payload !== null) {
        finalLabel = labelFormatter(label, payload);
    }
    const accessibilityAttributes = accessibilityLayer
        ? {
            role: 'status',
            'aria-live': 'assertive',
        }
        : {};
    return (react_1.default.createElement("div", Object.assign({ className: wrapperCN, style: finalStyle }, accessibilityAttributes),
        react_1.default.createElement("p", { className: labelCN, style: finalLabelStyle }, react_1.default.isValidElement(finalLabel) ? finalLabel : `${finalLabel}`),
        renderContent()));
};
exports.DefaultTooltipContent = DefaultTooltipContent;
//# sourceMappingURL=DefaultTooltipContent.js.map