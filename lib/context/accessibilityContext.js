"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useAccessibilityLayer = exports.AccessibilityContextProvider = void 0;
var _react = require("react");
var AccessibilityContext = /*#__PURE__*/(0, _react.createContext)(true);
var AccessibilityContextProvider = exports.AccessibilityContextProvider = AccessibilityContext.Provider;
var useAccessibilityLayer = () => (0, _react.useContext)(AccessibilityContext);
exports.useAccessibilityLayer = useAccessibilityLayer;