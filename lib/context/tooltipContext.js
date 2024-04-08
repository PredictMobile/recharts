"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useTooltipContext = exports.doNotDisplayTooltip = exports.TooltipContextProvider = void 0;
var _react = require("react");
var doNotDisplayTooltip = exports.doNotDisplayTooltip = {
  label: '',
  payload: [],
  coordinate: {
    x: 0,
    y: 0
  },
  active: false,
  index: 0
};
var TooltipContext = /*#__PURE__*/(0, _react.createContext)(doNotDisplayTooltip);
var TooltipContextProvider = exports.TooltipContextProvider = TooltipContext.Provider;
var useTooltipContext = () => (0, _react.useContext)(TooltipContext);
exports.useTooltipContext = useTooltipContext;