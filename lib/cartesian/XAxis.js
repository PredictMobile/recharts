"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.XAxis = void 0;
var _react = _interopRequireDefault(require("react"));
var _clsx = _interopRequireDefault(require("clsx"));
var _chartLayoutContext = require("../context/chartLayoutContext");
var _CartesianAxis = require("./CartesianAxis");
var _ChartUtils = require("../util/ChartUtils");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); } /**
 * @fileOverview X Axis
 */
/** Define of XAxis props */

var XAxis = _ref => {
  var {
    xAxisId
  } = _ref;
  var width = (0, _chartLayoutContext.useChartWidth)();
  var height = (0, _chartLayoutContext.useChartHeight)();
  var axisOptions = (0, _chartLayoutContext.useXAxisOrThrow)(xAxisId);
  if (axisOptions == null) {
    return null;
  }
  return (
    /*#__PURE__*/
    // @ts-expect-error the axisOptions type is not exactly what CartesianAxis is expecting.
    _react.default.createElement(_CartesianAxis.CartesianAxis, _extends({}, axisOptions, {
      className: (0, _clsx.default)("recharts-".concat(axisOptions.axisType, " ").concat(axisOptions.axisType), axisOptions.className),
      viewBox: {
        x: 0,
        y: 0,
        width,
        height
      },
      ticksGenerator: axis => (0, _ChartUtils.getTicksOfAxis)(axis, true)
    }))
  );
};
exports.XAxis = XAxis;
XAxis.displayName = 'XAxis';
XAxis.defaultProps = {
  allowDecimals: true,
  hide: false,
  orientation: 'bottom',
  width: 0,
  height: 30,
  mirror: false,
  xAxisId: 0,
  tickCount: 5,
  type: 'category',
  padding: {
    left: 0,
    right: 0
  },
  allowDataOverflow: false,
  scale: 'auto',
  reversed: false,
  allowDuplicatedCategory: true
};