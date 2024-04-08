"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTooltipContext = exports.TooltipContextProvider = exports.doNotDisplayTooltip = void 0;
const react_1 = require("react");
exports.doNotDisplayTooltip = {
    label: '',
    payload: [],
    coordinate: { x: 0, y: 0 },
    active: false,
    index: 0,
};
const TooltipContext = (0, react_1.createContext)(exports.doNotDisplayTooltip);
exports.TooltipContextProvider = TooltipContext.Provider;
const useTooltipContext = () => (0, react_1.useContext)(TooltipContext);
exports.useTooltipContext = useTooltipContext;
//# sourceMappingURL=tooltipContext.js.map