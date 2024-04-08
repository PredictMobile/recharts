"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ErrorBar = ErrorBar;
var _react = _interopRequireDefault(require("react"));
var _tinyInvariant = _interopRequireDefault(require("tiny-invariant"));
var _reactSmooth = _interopRequireDefault(require("react-smooth"));
var _Layer = require("../container/Layer");
var _ReactUtils = require("../util/ReactUtils");
var _excluded = ["offset", "layout", "width", "dataKey", "data", "dataPointFormatter", "xAxis", "yAxis", "isAnimationActive", "animationBegin", "animationDuration", "animationEasing"];
/**
 * @fileOverview Render a group of error bar
 */
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
function ErrorBar(props) {
  var {
      offset,
      layout,
      width,
      dataKey,
      data,
      dataPointFormatter,
      xAxis,
      yAxis,
      isAnimationActive,
      animationBegin,
      animationDuration,
      animationEasing
    } = props,
    others = _objectWithoutProperties(props, _excluded);
  var svgProps = (0, _ReactUtils.filterProps)(others, false);
  !!(props.direction === 'x' && xAxis.type !== 'number') ? process.env.NODE_ENV !== "production" ? (0, _tinyInvariant.default)(false, 'ErrorBar requires Axis type property to be "number".') : (0, _tinyInvariant.default)(false) : void 0;
  var errorBars = data.map(entry => {
    var {
      x,
      y,
      value,
      errorVal
    } = dataPointFormatter(entry, dataKey);
    if (!errorVal) {
      return null;
    }
    var lineCoordinates = [];
    var lowBound, highBound;
    if (Array.isArray(errorVal)) {
      [lowBound, highBound] = errorVal;
    } else {
      lowBound = highBound = errorVal;
    }
    if (layout === 'vertical') {
      // error bar for horizontal charts, the y is fixed, x is a range value
      var {
        scale
      } = xAxis;
      var yMid = y + offset;
      var yMin = yMid + width;
      var yMax = yMid - width;
      var xMin = scale(value - lowBound);
      var xMax = scale(value + highBound);

      // the right line of |--|
      lineCoordinates.push({
        x1: xMax,
        y1: yMin,
        x2: xMax,
        y2: yMax
      });
      // the middle line of |--|
      lineCoordinates.push({
        x1: xMin,
        y1: yMid,
        x2: xMax,
        y2: yMid
      });
      // the left line of |--|
      lineCoordinates.push({
        x1: xMin,
        y1: yMin,
        x2: xMin,
        y2: yMax
      });
    } else if (layout === 'horizontal') {
      // error bar for horizontal charts, the x is fixed, y is a range value
      var {
        scale: _scale
      } = yAxis;
      var xMid = x + offset;
      var _xMin = xMid - width;
      var _xMax = xMid + width;
      var _yMin = _scale(value - lowBound);
      var _yMax = _scale(value + highBound);

      // the top line
      lineCoordinates.push({
        x1: _xMin,
        y1: _yMax,
        x2: _xMax,
        y2: _yMax
      });
      // the middle line
      lineCoordinates.push({
        x1: xMid,
        y1: _yMin,
        x2: xMid,
        y2: _yMax
      });
      // the bottom line
      lineCoordinates.push({
        x1: _xMin,
        y1: _yMin,
        x2: _xMax,
        y2: _yMin
      });
    }
    return /*#__PURE__*/_react.default.createElement(_Layer.Layer, _extends({
      className: "recharts-errorBar",
      key: "bar-".concat(lineCoordinates.map(c => "".concat(c.x1, "-").concat(c.x2, "-").concat(c.y1, "-").concat(c.y2)))
    }, svgProps), lineCoordinates.map(coordinates => {
      var lineStyle = isAnimationActive ? {
        transformOrigin: "".concat(coordinates.x1 - 5, "px")
      } : undefined;
      return /*#__PURE__*/_react.default.createElement(_reactSmooth.default, {
        from: "scale(0, 1)",
        to: "scale(1, 1)",
        attributeName: "transform",
        begin: animationBegin,
        easing: animationEasing,
        isActive: isAnimationActive,
        duration: animationDuration,
        key: "line-".concat(coordinates.x1, "-").concat(coordinates.x2, "-").concat(coordinates.y1, "-").concat(coordinates.y2)
      }, /*#__PURE__*/_react.default.createElement("line", _extends({}, coordinates, {
        style: lineStyle
      })));
    }));
  });
  return /*#__PURE__*/_react.default.createElement(_Layer.Layer, {
    className: "recharts-errorBars"
  }, errorBars);
}
ErrorBar.defaultProps = {
  stroke: 'black',
  strokeWidth: 1.5,
  width: 5,
  offset: 0,
  layout: 'horizontal',
  isAnimationActive: true,
  animationBegin: 0,
  animationDuration: 200,
  animationEasing: 'ease-in-out'
};
ErrorBar.displayName = 'ErrorBar';