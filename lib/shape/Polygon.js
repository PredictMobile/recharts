"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Polygon = void 0;
var _react = _interopRequireDefault(require("react"));
var _clsx = _interopRequireDefault(require("clsx"));
var _ReactUtils = require("../util/ReactUtils");
var _excluded = ["points", "className", "baseLinePoints", "connectNulls"];
/**
 * @fileOverview Polygon
 */
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
var isValidatePoint = point => {
  return point && point.x === +point.x && point.y === +point.y;
};
var getParsedPoints = function getParsedPoints() {
  var points = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var segmentPoints = [[]];
  points.forEach(entry => {
    if (isValidatePoint(entry)) {
      segmentPoints[segmentPoints.length - 1].push(entry);
    } else if (segmentPoints[segmentPoints.length - 1].length > 0) {
      // add another path
      segmentPoints.push([]);
    }
  });
  if (isValidatePoint(points[0])) {
    segmentPoints[segmentPoints.length - 1].push(points[0]);
  }
  if (segmentPoints[segmentPoints.length - 1].length <= 0) {
    segmentPoints = segmentPoints.slice(0, -1);
  }
  return segmentPoints;
};
var getSinglePolygonPath = (points, connectNulls) => {
  var segmentPoints = getParsedPoints(points);
  if (connectNulls) {
    segmentPoints = [segmentPoints.reduce((res, segPoints) => {
      return [...res, ...segPoints];
    }, [])];
  }
  var polygonPath = segmentPoints.map(segPoints => {
    return segPoints.reduce((path, point, index) => {
      return "".concat(path).concat(index === 0 ? 'M' : 'L').concat(point.x, ",").concat(point.y);
    }, '');
  }).join('');
  return segmentPoints.length === 1 ? "".concat(polygonPath, "Z") : polygonPath;
};
var getRanglePath = (points, baseLinePoints, connectNulls) => {
  var outerPath = getSinglePolygonPath(points, connectNulls);
  return "".concat(outerPath.slice(-1) === 'Z' ? outerPath.slice(0, -1) : outerPath, "L").concat(getSinglePolygonPath(baseLinePoints.reverse(), connectNulls).slice(1));
};
var Polygon = props => {
  var {
      points,
      className,
      baseLinePoints,
      connectNulls
    } = props,
    others = _objectWithoutProperties(props, _excluded);
  if (!points || !points.length) {
    return null;
  }
  var layerClass = (0, _clsx.default)('recharts-polygon', className);
  if (baseLinePoints && baseLinePoints.length) {
    var hasStroke = others.stroke && others.stroke !== 'none';
    var rangePath = getRanglePath(points, baseLinePoints, connectNulls);
    return /*#__PURE__*/_react.default.createElement("g", {
      className: layerClass
    }, /*#__PURE__*/_react.default.createElement("path", _extends({}, (0, _ReactUtils.filterProps)(others, true), {
      fill: rangePath.slice(-1) === 'Z' ? others.fill : 'none',
      stroke: "none",
      d: rangePath
    })), hasStroke ? /*#__PURE__*/_react.default.createElement("path", _extends({}, (0, _ReactUtils.filterProps)(others, true), {
      fill: "none",
      d: getSinglePolygonPath(points, connectNulls)
    })) : null, hasStroke ? /*#__PURE__*/_react.default.createElement("path", _extends({}, (0, _ReactUtils.filterProps)(others, true), {
      fill: "none",
      d: getSinglePolygonPath(baseLinePoints, connectNulls)
    })) : null);
  }
  var singlePath = getSinglePolygonPath(points, connectNulls);
  return /*#__PURE__*/_react.default.createElement("path", _extends({}, (0, _ReactUtils.filterProps)(others, true), {
    fill: singlePath.slice(-1) === 'Z' ? others.fill : 'none',
    className: layerClass,
    d: singlePath
  }));
};
exports.Polygon = Polygon;