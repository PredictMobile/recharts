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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLegendPayloadDispatch = exports.useLegendPayload = exports.LegendPayloadProvider = void 0;
const react_1 = __importStar(require("react"));
const LegendPayloadContext = (0, react_1.createContext)([]);
const LegendPayloadDispatchContext = (0, react_1.createContext)({
    addSupplier: () => { },
    removeSupplier: () => { },
});
const LegendPayloadProvider = ({ children }) => {
    const [payload, setPayload] = (0, react_1.useState)([]);
    const addSupplier = (0, react_1.useCallback)((payloadSupplier) => setPayload(prev => [...prev, payloadSupplier]), []);
    const removeSupplier = (0, react_1.useCallback)((payloadSupplier) => setPayload(prev => prev.filter(p => p !== payloadSupplier)), []);
    return (react_1.default.createElement(LegendPayloadDispatchContext.Provider, { value: { addSupplier, removeSupplier } },
        react_1.default.createElement(LegendPayloadContext.Provider, { value: payload }, children)));
};
exports.LegendPayloadProvider = LegendPayloadProvider;
function useLegendPayload() {
    const allSuppliers = (0, react_1.useContext)(LegendPayloadContext);
    return allSuppliers.flatMap((supplier) => supplier());
}
exports.useLegendPayload = useLegendPayload;
function useLegendPayloadDispatch(computeLegendPayload, input) {
    const { addSupplier, removeSupplier } = (0, react_1.useContext)(LegendPayloadDispatchContext);
    (0, react_1.useEffect)(() => {
        const supplier = () => computeLegendPayload(input);
        addSupplier(supplier);
        return () => {
            removeSupplier(supplier);
        };
    }, [input, addSupplier, removeSupplier, computeLegendPayload]);
    return null;
}
exports.useLegendPayloadDispatch = useLegendPayloadDispatch;
//# sourceMappingURL=legendPayloadContext.js.map