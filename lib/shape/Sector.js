"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Sector = void 0;
var _react = _interopRequireDefault(require("react"));
var _clsx = _interopRequireDefault(require("clsx"));
var _ReactUtils = require("../util/ReactUtils");
var _PolarUtils = require("../util/PolarUtils");
var _DataUtils = require("../util/DataUtils");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * @fileOverview Sector
 */
var getDeltaAngle = (startAngle, endAngle) => {
  var sign = (0, _DataUtils.mathSign)(endAngle - startAngle);
  var deltaAngle = Math.min(Math.abs(endAngle - startAngle), 359.999);
  return sign * deltaAngle;
};
var getTangentCircle = _ref => {
  var {
    cx,
    cy,
    radius,
    angle,
    sign,
    isExternal,
    cornerRadius,
    cornerIsExternal
  } = _ref;
  var centerRadius = cornerRadius * (isExternal ? 1 : -1) + radius;
  var theta = Math.asin(cornerRadius / centerRadius) / _PolarUtils.RADIAN;
  var centerAngle = cornerIsExternal ? angle : angle + sign * theta;
  var center = (0, _PolarUtils.polarToCartesian)(cx, cy, centerRadius, centerAngle);
  // The coordinate of point which is tangent to the circle
  var circleTangency = (0, _PolarUtils.polarToCartesian)(cx, cy, radius, centerAngle);
  // The coordinate of point which is tangent to the radius line
  var lineTangencyAngle = cornerIsExternal ? angle - sign * theta : angle;
  var lineTangency = (0, _PolarUtils.polarToCartesian)(cx, cy, centerRadius * Math.cos(theta * _PolarUtils.RADIAN), lineTangencyAngle);
  return {
    center,
    circleTangency,
    lineTangency,
    theta
  };
};
var getSectorPath = _ref2 => {
  var {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle
  } = _ref2;
  var angle = getDeltaAngle(startAngle, endAngle);

  // When the angle of sector equals to 360, star point and end point coincide
  var tempEndAngle = startAngle + angle;
  var outerStartPoint = (0, _PolarUtils.polarToCartesian)(cx, cy, outerRadius, startAngle);
  var outerEndPoint = (0, _PolarUtils.polarToCartesian)(cx, cy, outerRadius, tempEndAngle);
  var path = "M ".concat(outerStartPoint.x, ",").concat(outerStartPoint.y, "\n    A ").concat(outerRadius, ",").concat(outerRadius, ",0,\n    ").concat(+(Math.abs(angle) > 180), ",").concat(+(startAngle > tempEndAngle), ",\n    ").concat(outerEndPoint.x, ",").concat(outerEndPoint.y, "\n  ");
  if (innerRadius > 0) {
    var innerStartPoint = (0, _PolarUtils.polarToCartesian)(cx, cy, innerRadius, startAngle);
    var innerEndPoint = (0, _PolarUtils.polarToCartesian)(cx, cy, innerRadius, tempEndAngle);
    path += "L ".concat(innerEndPoint.x, ",").concat(innerEndPoint.y, "\n            A ").concat(innerRadius, ",").concat(innerRadius, ",0,\n            ").concat(+(Math.abs(angle) > 180), ",").concat(+(startAngle <= tempEndAngle), ",\n            ").concat(innerStartPoint.x, ",").concat(innerStartPoint.y, " Z");
  } else {
    path += "L ".concat(cx, ",").concat(cy, " Z");
  }
  return path;
};
var getSectorWithCorner = _ref3 => {
  var {
    cx,
    cy,
    innerRadius,
    outerRadius,
    cornerRadius,
    forceCornerRadius,
    cornerIsExternal,
    startAngle,
    endAngle
  } = _ref3;
  var sign = (0, _DataUtils.mathSign)(endAngle - startAngle);
  var {
    circleTangency: soct,
    lineTangency: solt,
    theta: sot
  } = getTangentCircle({
    cx,
    cy,
    radius: outerRadius,
    angle: startAngle,
    sign,
    cornerRadius,
    cornerIsExternal
  });
  var {
    circleTangency: eoct,
    lineTangency: eolt,
    theta: eot
  } = getTangentCircle({
    cx,
    cy,
    radius: outerRadius,
    angle: endAngle,
    sign: -sign,
    cornerRadius,
    cornerIsExternal
  });
  var outerArcAngle = cornerIsExternal ? Math.abs(startAngle - endAngle) : Math.abs(startAngle - endAngle) - sot - eot;
  if (outerArcAngle < 0) {
    if (forceCornerRadius) {
      return "M ".concat(solt.x, ",").concat(solt.y, "\n        a").concat(cornerRadius, ",").concat(cornerRadius, ",0,0,1,").concat(cornerRadius * 2, ",0\n        a").concat(cornerRadius, ",").concat(cornerRadius, ",0,0,1,").concat(-cornerRadius * 2, ",0\n      ");
    }
    return getSectorPath({
      cx,
      cy,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle
    });
  }
  var path = "M ".concat(solt.x, ",").concat(solt.y, "\n    A").concat(cornerRadius, ",").concat(cornerRadius, ",0,0,").concat(+(sign < 0), ",").concat(soct.x, ",").concat(soct.y, "\n    A").concat(outerRadius, ",").concat(outerRadius, ",0,").concat(+(outerArcAngle > 180), ",").concat(+(sign < 0), ",").concat(eoct.x, ",").concat(eoct.y, "\n    A").concat(cornerRadius, ",").concat(cornerRadius, ",0,0,").concat(+(sign < 0), ",").concat(eolt.x, ",").concat(eolt.y, "\n  ");
  if (innerRadius > 0) {
    var {
      circleTangency: sict,
      lineTangency: silt,
      theta: sit
    } = getTangentCircle({
      cx,
      cy,
      radius: innerRadius,
      angle: startAngle,
      sign,
      isExternal: true,
      cornerRadius,
      cornerIsExternal
    });
    var {
      circleTangency: eict,
      lineTangency: eilt,
      theta: eit
    } = getTangentCircle({
      cx,
      cy,
      radius: innerRadius,
      angle: endAngle,
      sign: -sign,
      isExternal: true,
      cornerRadius,
      cornerIsExternal
    });
    var innerArcAngle = cornerIsExternal ? Math.abs(startAngle - endAngle) : Math.abs(startAngle - endAngle) - sit - eit;
    if (innerArcAngle < 0 && cornerRadius === 0) {
      return "".concat(path, "L").concat(cx, ",").concat(cy, "Z");
    }
    path += "L".concat(eilt.x, ",").concat(eilt.y, "\n      A").concat(cornerRadius, ",").concat(cornerRadius, ",0,0,").concat(+(sign < 0), ",").concat(eict.x, ",").concat(eict.y, "\n      A").concat(innerRadius, ",").concat(innerRadius, ",0,").concat(+(innerArcAngle > 180), ",").concat(+(sign > 0), ",").concat(sict.x, ",").concat(sict.y, "\n      A").concat(cornerRadius, ",").concat(cornerRadius, ",0,0,").concat(+(sign < 0), ",").concat(silt.x, ",").concat(silt.y, "Z");
  } else {
    path += "L".concat(cx, ",").concat(cy, "Z");
  }
  return path;
};
var defaultProps = {
  cx: 0,
  cy: 0,
  innerRadius: 0,
  outerRadius: 0,
  startAngle: 0,
  endAngle: 0,
  cornerRadius: 0,
  forceCornerRadius: false,
  cornerIsExternal: false
};
var Sector = sectorProps => {
  var props = _objectSpread(_objectSpread({}, defaultProps), sectorProps);
  var {
    cx,
    cy,
    innerRadius,
    outerRadius,
    cornerRadius,
    forceCornerRadius,
    cornerIsExternal,
    startAngle,
    endAngle,
    className
  } = props;
  if (outerRadius < innerRadius || startAngle === endAngle) {
    return null;
  }
  var layerClass = (0, _clsx.default)('recharts-sector', className);
  var deltaRadius = outerRadius - innerRadius;
  var cr = (0, _DataUtils.getPercentValue)(cornerRadius, deltaRadius, 0, true);
  var path;
  if (cr > 0 && Math.abs(startAngle - endAngle) < 360) {
    path = getSectorWithCorner({
      cx,
      cy,
      innerRadius,
      outerRadius,
      cornerRadius: Math.min(cr, deltaRadius / 2),
      forceCornerRadius,
      cornerIsExternal,
      startAngle,
      endAngle
    });
  } else {
    path = getSectorPath({
      cx,
      cy,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle
    });
  }
  return /*#__PURE__*/_react.default.createElement("path", _extends({}, (0, _ReactUtils.filterProps)(props, true), {
    className: layerClass,
    d: path,
    role: "img"
  }));
};
exports.Sector = Sector;