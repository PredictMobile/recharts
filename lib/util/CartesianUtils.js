"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAngledRectangleWidth = exports.formatAxisMap = exports.createLabeledScales = exports.ScaleHelper = void 0;
exports.normalizeAngle = normalizeAngle;
exports.rectWithPoints = exports.rectWithCoords = void 0;
var _mapValues = _interopRequireDefault(require("lodash/mapValues"));
var _every = _interopRequireDefault(require("lodash/every"));
var _ChartUtils = require("./ChartUtils");
var _ReactUtils = require("./ReactUtils");
var _DataUtils = require("./DataUtils");
var _Bar = require("../cartesian/Bar");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * Calculate the scale function, position, width, height of axes
 * @param  {Object} props     Latest props
 * @param  {Object} axisMap   The configuration of axes
 * @param  {Object} offset    The offset of main part in the svg element
 * @param  {String} axisType  The type of axes, x-axis or y-axis
 * @param  {String} chartName The name of chart
 * @return {Object} Configuration
 */
var formatAxisMap = (props, axisMap, offset, axisType, chartName) => {
  var {
    width,
    height,
    layout,
    children
  } = props;
  var ids = Object.keys(axisMap);
  var steps = {
    left: offset.left,
    leftMirror: offset.left,
    right: width - offset.right,
    rightMirror: width - offset.right,
    top: offset.top,
    topMirror: offset.top,
    bottom: height - offset.bottom,
    bottomMirror: height - offset.bottom
  };
  var hasBar = !!(0, _ReactUtils.findChildByType)(children, _Bar.Bar);
  return ids.reduce((result, id) => {
    var axis = axisMap[id];
    var {
      orientation,
      domain,
      padding = {},
      mirror,
      reversed
    } = axis;
    var offsetKey = "".concat(orientation).concat(mirror ? 'Mirror' : '');
    var calculatedPadding, range, x, y, needSpace;
    if (axis.type === 'number' && (axis.padding === 'gap' || axis.padding === 'no-gap')) {
      var diff = domain[1] - domain[0];
      var smallestDistanceBetweenValues = Infinity;
      var sortedValues = axis.categoricalDomain.sort();
      sortedValues.forEach((value, index) => {
        if (index > 0) {
          smallestDistanceBetweenValues = Math.min((value || 0) - (sortedValues[index - 1] || 0), smallestDistanceBetweenValues);
        }
      });
      if (Number.isFinite(smallestDistanceBetweenValues)) {
        var smallestDistanceInPercent = smallestDistanceBetweenValues / diff;
        var rangeWidth = axis.layout === 'vertical' ? offset.height : offset.width;
        if (axis.padding === 'gap') {
          calculatedPadding = smallestDistanceInPercent * rangeWidth / 2;
        }
        if (axis.padding === 'no-gap') {
          var gap = (0, _DataUtils.getPercentValue)(props.barCategoryGap, smallestDistanceInPercent * rangeWidth);
          var halfBand = smallestDistanceInPercent * rangeWidth / 2;
          calculatedPadding = halfBand - gap - (halfBand - gap) / rangeWidth * gap;
        }
      }
    }
    if (axisType === 'xAxis') {
      range = [offset.left + (padding.left || 0) + (calculatedPadding || 0), offset.left + offset.width - (padding.right || 0) - (calculatedPadding || 0)];
    } else if (axisType === 'yAxis') {
      range = layout === 'horizontal' ? [offset.top + offset.height - (padding.bottom || 0), offset.top + (padding.top || 0)] : [offset.top + (padding.top || 0) + (calculatedPadding || 0), offset.top + offset.height - (padding.bottom || 0) - (calculatedPadding || 0)];
    } else {
      ({
        range
      } = axis);
    }
    if (reversed) {
      range = [range[1], range[0]];
    }
    var {
      scale,
      realScaleType
    } = (0, _ChartUtils.parseScale)(axis, chartName, hasBar);
    scale.domain(domain).range(range);
    (0, _ChartUtils.checkDomainOfScale)(scale);
    var ticks = (0, _ChartUtils.getTicksOfScale)(scale, _objectSpread(_objectSpread({}, axis), {}, {
      realScaleType
    }));
    if (axisType === 'xAxis') {
      needSpace = orientation === 'top' && !mirror || orientation === 'bottom' && mirror;
      x = offset.left;
      y = steps[offsetKey] - needSpace * axis.height;
    } else if (axisType === 'yAxis') {
      needSpace = orientation === 'left' && !mirror || orientation === 'right' && mirror;
      x = steps[offsetKey] - needSpace * axis.width;
      y = offset.top;
    }
    var finalAxis = _objectSpread(_objectSpread(_objectSpread({}, axis), ticks), {}, {
      realScaleType,
      x,
      y,
      scale,
      width: axisType === 'xAxis' ? offset.width : axis.width,
      height: axisType === 'yAxis' ? offset.height : axis.height
    });
    finalAxis.bandSize = (0, _ChartUtils.getBandSizeOfAxis)(finalAxis, ticks);
    if (!axis.hide && axisType === 'xAxis') {
      steps[offsetKey] += (needSpace ? -1 : 1) * finalAxis.height;
    } else if (!axis.hide) {
      steps[offsetKey] += (needSpace ? -1 : 1) * finalAxis.width;
    }
    return _objectSpread(_objectSpread({}, result), {}, {
      [id]: finalAxis
    });
  }, {});
};
exports.formatAxisMap = formatAxisMap;
var rectWithPoints = (_ref, _ref2) => {
  var {
    x: x1,
    y: y1
  } = _ref;
  var {
    x: x2,
    y: y2
  } = _ref2;
  return {
    x: Math.min(x1, x2),
    y: Math.min(y1, y2),
    width: Math.abs(x2 - x1),
    height: Math.abs(y2 - y1)
  };
};

/**
 * Compute the x, y, width, and height of a box from two reference points.
 * @param  {Object} coords     x1, x2, y1, and y2
 * @return {Object} object
 */
exports.rectWithPoints = rectWithPoints;
var rectWithCoords = _ref3 => {
  var {
    x1,
    y1,
    x2,
    y2
  } = _ref3;
  return rectWithPoints({
    x: x1,
    y: y1
  }, {
    x: x2,
    y: y2
  });
};
exports.rectWithCoords = rectWithCoords;
class ScaleHelper {
  static create(obj) {
    return new ScaleHelper(obj);
  }
  constructor(scale) {
    this.scale = scale;
  }
  get domain() {
    return this.scale.domain;
  }
  get range() {
    return this.scale.range;
  }
  get rangeMin() {
    return this.range()[0];
  }
  get rangeMax() {
    return this.range()[1];
  }
  get bandwidth() {
    return this.scale.bandwidth;
  }
  apply(value) {
    var {
      bandAware,
      position
    } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    if (value === undefined) {
      return undefined;
    }
    if (position) {
      switch (position) {
        case 'start':
          {
            return this.scale(value);
          }
        case 'middle':
          {
            var offset = this.bandwidth ? this.bandwidth() / 2 : 0;
            return this.scale(value) + offset;
          }
        case 'end':
          {
            var _offset = this.bandwidth ? this.bandwidth() : 0;
            return this.scale(value) + _offset;
          }
        default:
          {
            return this.scale(value);
          }
      }
    }
    if (bandAware) {
      var _offset2 = this.bandwidth ? this.bandwidth() / 2 : 0;
      return this.scale(value) + _offset2;
    }
    return this.scale(value);
  }
  isInRange(value) {
    var range = this.range();
    var first = range[0];
    var last = range[range.length - 1];
    return first <= last ? value >= first && value <= last : value >= last && value <= first;
  }
}
exports.ScaleHelper = ScaleHelper;
_defineProperty(ScaleHelper, "EPS", 1e-4);
var createLabeledScales = options => {
  var scales = Object.keys(options).reduce((res, key) => _objectSpread(_objectSpread({}, res), {}, {
    [key]: ScaleHelper.create(options[key])
  }), {});
  return _objectSpread(_objectSpread({}, scales), {}, {
    apply(coord) {
      var {
        bandAware,
        position
      } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return (0, _mapValues.default)(coord, (value, label) => scales[label].apply(value, {
        bandAware,
        position
      }));
    },
    isInRange(coord) {
      return (0, _every.default)(coord, (value, label) => scales[label].isInRange(value));
    }
  });
};

/** Normalizes the angle so that 0 <= angle < 180.
 * @param {number} angle Angle in degrees.
 * @return {number} the normalized angle with a value of at least 0 and never greater or equal to 180. */
exports.createLabeledScales = createLabeledScales;
function normalizeAngle(angle) {
  return (angle % 180 + 180) % 180;
}

/** Calculates the width of the largest horizontal line that fits inside a rectangle that is displayed at an angle.
 * @param {Object} size Width and height of the text in a horizontal position.
 * @param {number} angle Angle in degrees in which the text is displayed.
 * @return {number} The width of the largest horizontal line that fits inside a rectangle that is displayed at an angle.
 */
var getAngledRectangleWidth = exports.getAngledRectangleWidth = function getAngledRectangleWidth(_ref4) {
  var {
    width,
    height
  } = _ref4;
  var angle = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  // Ensure angle is >= 0 && < 180
  var normalizedAngle = normalizeAngle(angle);
  var angleRadians = normalizedAngle * Math.PI / 180;

  /* Depending on the height and width of the rectangle, we may need to use different formulas to calculate the angled
   * width. This threshold defines when each formula should kick in. */
  var angleThreshold = Math.atan(height / width);
  var angledWidth = angleRadians > angleThreshold && angleRadians < Math.PI - angleThreshold ? height / Math.sin(angleRadians) : width / Math.cos(angleRadians);
  return Math.abs(angledWidth);
};