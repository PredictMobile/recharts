"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ClipPath = ClipPath;
var _react = _interopRequireDefault(require("react"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function ClipPath(_ref) {
  var {
    clipPathId,
    offset
  } = _ref;
  var {
    left,
    top,
    height,
    width
  } = offset;
  return /*#__PURE__*/_react.default.createElement("defs", null, /*#__PURE__*/_react.default.createElement("clipPath", {
    id: clipPathId
  }, /*#__PURE__*/_react.default.createElement("rect", {
    x: left,
    y: top,
    height: height,
    width: width
  })));
}