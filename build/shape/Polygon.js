"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Polygon = void 0;
const react_1 = __importDefault(require("react"));
const clsx_1 = __importDefault(require("clsx"));
const ReactUtils_1 = require("../util/ReactUtils");
const isValidatePoint = (point) => {
    return point && point.x === +point.x && point.y === +point.y;
};
const getParsedPoints = (points = []) => {
    let segmentPoints = [[]];
    points.forEach(entry => {
        if (isValidatePoint(entry)) {
            segmentPoints[segmentPoints.length - 1].push(entry);
        }
        else if (segmentPoints[segmentPoints.length - 1].length > 0) {
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
const getSinglePolygonPath = (points, connectNulls) => {
    let segmentPoints = getParsedPoints(points);
    if (connectNulls) {
        segmentPoints = [
            segmentPoints.reduce((res, segPoints) => {
                return [...res, ...segPoints];
            }, []),
        ];
    }
    const polygonPath = segmentPoints
        .map(segPoints => {
        return segPoints.reduce((path, point, index) => {
            return `${path}${index === 0 ? 'M' : 'L'}${point.x},${point.y}`;
        }, '');
    })
        .join('');
    return segmentPoints.length === 1 ? `${polygonPath}Z` : polygonPath;
};
const getRanglePath = (points, baseLinePoints, connectNulls) => {
    const outerPath = getSinglePolygonPath(points, connectNulls);
    return `${outerPath.slice(-1) === 'Z' ? outerPath.slice(0, -1) : outerPath}L${getSinglePolygonPath(baseLinePoints.reverse(), connectNulls).slice(1)}`;
};
const Polygon = props => {
    const { points, className, baseLinePoints, connectNulls } = props, others = __rest(props, ["points", "className", "baseLinePoints", "connectNulls"]);
    if (!points || !points.length) {
        return null;
    }
    const layerClass = (0, clsx_1.default)('recharts-polygon', className);
    if (baseLinePoints && baseLinePoints.length) {
        const hasStroke = others.stroke && others.stroke !== 'none';
        const rangePath = getRanglePath(points, baseLinePoints, connectNulls);
        return (react_1.default.createElement("g", { className: layerClass },
            react_1.default.createElement("path", Object.assign({}, (0, ReactUtils_1.filterProps)(others, true), { fill: rangePath.slice(-1) === 'Z' ? others.fill : 'none', stroke: "none", d: rangePath })),
            hasStroke ? (react_1.default.createElement("path", Object.assign({}, (0, ReactUtils_1.filterProps)(others, true), { fill: "none", d: getSinglePolygonPath(points, connectNulls) }))) : null,
            hasStroke ? (react_1.default.createElement("path", Object.assign({}, (0, ReactUtils_1.filterProps)(others, true), { fill: "none", d: getSinglePolygonPath(baseLinePoints, connectNulls) }))) : null));
    }
    const singlePath = getSinglePolygonPath(points, connectNulls);
    return (react_1.default.createElement("path", Object.assign({}, (0, ReactUtils_1.filterProps)(others, true), { fill: singlePath.slice(-1) === 'Z' ? others.fill : 'none', className: layerClass, d: singlePath })));
};
exports.Polygon = Polygon;
//# sourceMappingURL=Polygon.js.map