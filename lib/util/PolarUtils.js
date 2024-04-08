"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.radianToDegree = exports.polarToCartesian = exports.inRangeOfSector = exports.getTickClassName = exports.getMaxRadius = exports.getAngleOfPoint = exports.formatAxisMap = exports.formatAngleOfSector = exports.distanceBetweenPoints = exports.degreeToRadian = exports.RADIAN = void 0;
var _isNil = _interopRequireDefault(require("lodash/isNil"));
var _react = require("react");
var _isFunction = _interopRequireDefault(require("lodash/isFunction"));
var _DataUtils = require("./DataUtils");
var _ChartUtils = require("./ChartUtils");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var RADIAN = exports.RADIAN = Math.PI / 180;
var degreeToRadian = angle => angle * Math.PI / 180;
exports.degreeToRadian = degreeToRadian;
var radianToDegree = angleInRadian => angleInRadian * 180 / Math.PI;
exports.radianToDegree = radianToDegree;
var polarToCartesian = (cx, cy, radius, angle) => ({
  x: cx + Math.cos(-RADIAN * angle) * radius,
  y: cy + Math.sin(-RADIAN * angle) * radius
});
exports.polarToCartesian = polarToCartesian;
var getMaxRadius = exports.getMaxRadius = function getMaxRadius(width, height) {
  var offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
  return Math.min(Math.abs(width - (offset.left || 0) - (offset.right || 0)), Math.abs(height - (offset.top || 0) - (offset.bottom || 0))) / 2;
};

/**
 * Calculate the scale function, position, width, height of axes
 * @param  {Object} props     Latest props
 * @param  {Object} axisMap   The configuration of axes
 * @param  {Object} offset    The offset of main part in the svg element
 * @param  {Object} axisType  The type of axes, radius-axis or angle-axis
 * @param  {String} chartName The name of chart
 * @return {Object} Configuration
 */
var formatAxisMap = (props, axisMap, offset, axisType, chartName) => {
  var {
    width,
    height
  } = props;
  var {
    startAngle,
    endAngle
  } = props;
  var cx = (0, _DataUtils.getPercentValue)(props.cx, width, width / 2);
  var cy = (0, _DataUtils.getPercentValue)(props.cy, height, height / 2);
  var maxRadius = getMaxRadius(width, height, offset);
  var innerRadius = (0, _DataUtils.getPercentValue)(props.innerRadius, maxRadius, 0);
  var outerRadius = (0, _DataUtils.getPercentValue)(props.outerRadius, maxRadius, maxRadius * 0.8);
  var ids = Object.keys(axisMap);
  return ids.reduce((result, id) => {
    var axis = axisMap[id];
    var {
      domain,
      reversed
    } = axis;
    var range;
    if ((0, _isNil.default)(axis.range)) {
      if (axisType === 'angleAxis') {
        range = [startAngle, endAngle];
      } else if (axisType === 'radiusAxis') {
        range = [innerRadius, outerRadius];
      }
      if (reversed) {
        range = [range[1], range[0]];
      }
    } else {
      ({
        range
      } = axis);
      [startAngle, endAngle] = range;
    }
    var {
      realScaleType,
      scale
    } = (0, _ChartUtils.parseScale)(axis, chartName);
    scale.domain(domain).range(range);
    (0, _ChartUtils.checkDomainOfScale)(scale);
    var ticks = (0, _ChartUtils.getTicksOfScale)(scale, _objectSpread(_objectSpread({}, axis), {}, {
      realScaleType
    }));
    var finalAxis = _objectSpread(_objectSpread(_objectSpread({}, axis), ticks), {}, {
      range,
      radius: outerRadius,
      realScaleType,
      scale,
      cx,
      cy,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle
    });
    return _objectSpread(_objectSpread({}, result), {}, {
      [id]: finalAxis
    });
  }, {});
};
exports.formatAxisMap = formatAxisMap;
var distanceBetweenPoints = (point, anotherPoint) => {
  var {
    x: x1,
    y: y1
  } = point;
  var {
    x: x2,
    y: y2
  } = anotherPoint;
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
};
exports.distanceBetweenPoints = distanceBetweenPoints;
var getAngleOfPoint = (_ref, _ref2) => {
  var {
    x,
    y
  } = _ref;
  var {
    cx,
    cy
  } = _ref2;
  var radius = distanceBetweenPoints({
    x,
    y
  }, {
    x: cx,
    y: cy
  });
  if (radius <= 0) {
    return {
      radius
    };
  }
  var cos = (x - cx) / radius;
  var angleInRadian = Math.acos(cos);
  if (y > cy) {
    angleInRadian = 2 * Math.PI - angleInRadian;
  }
  return {
    radius,
    angle: radianToDegree(angleInRadian),
    angleInRadian
  };
};
exports.getAngleOfPoint = getAngleOfPoint;
var formatAngleOfSector = _ref3 => {
  var {
    startAngle,
    endAngle
  } = _ref3;
  var startCnt = Math.floor(startAngle / 360);
  var endCnt = Math.floor(endAngle / 360);
  var min = Math.min(startCnt, endCnt);
  return {
    startAngle: startAngle - min * 360,
    endAngle: endAngle - min * 360
  };
};
exports.formatAngleOfSector = formatAngleOfSector;
var reverseFormatAngleOfSetor = (angle, _ref4) => {
  var {
    startAngle,
    endAngle
  } = _ref4;
  var startCnt = Math.floor(startAngle / 360);
  var endCnt = Math.floor(endAngle / 360);
  var min = Math.min(startCnt, endCnt);
  return angle + min * 360;
};
var inRangeOfSector = (_ref5, sector) => {
  var {
    x,
    y
  } = _ref5;
  var {
    radius,
    angle
  } = getAngleOfPoint({
    x,
    y
  }, sector);
  var {
    innerRadius,
    outerRadius
  } = sector;
  if (radius < innerRadius || radius > outerRadius) {
    // @ts-expect-error usages of this method expect it to always return RangeObj, not boolean
    return false;
  }
  if (radius === 0) {
    // @ts-expect-error usages of this method expect it to always return RangeObj, not boolean
    return true;
  }
  var {
    startAngle,
    endAngle
  } = formatAngleOfSector(sector);
  var formatAngle = angle;
  var inRange;
  if (startAngle <= endAngle) {
    while (formatAngle > endAngle) {
      formatAngle -= 360;
    }
    while (formatAngle < startAngle) {
      formatAngle += 360;
    }
    inRange = formatAngle >= startAngle && formatAngle <= endAngle;
  } else {
    while (formatAngle > startAngle) {
      formatAngle -= 360;
    }
    while (formatAngle < endAngle) {
      formatAngle += 360;
    }
    inRange = formatAngle >= endAngle && formatAngle <= startAngle;
  }
  if (inRange) {
    return _objectSpread(_objectSpread({}, sector), {}, {
      radius,
      angle: reverseFormatAngleOfSetor(formatAngle, sector)
    });
  }
  return null;
};
exports.inRangeOfSector = inRangeOfSector;
var getTickClassName = tick => ! /*#__PURE__*/(0, _react.isValidElement)(tick) && !(0, _isFunction.default)(tick) && typeof tick !== 'boolean' ? tick.className : '';
exports.getTickClassName = getTickClassName;