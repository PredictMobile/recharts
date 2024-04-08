"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAccessibilityLayer = exports.AccessibilityContextProvider = void 0;
const react_1 = require("react");
const AccessibilityContext = (0, react_1.createContext)(true);
exports.AccessibilityContextProvider = AccessibilityContext.Provider;
const useAccessibilityLayer = () => (0, react_1.useContext)(AccessibilityContext);
exports.useAccessibilityLayer = useAccessibilityLayer;
//# sourceMappingURL=accessibilityContext.js.map