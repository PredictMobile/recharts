"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sector = void 0;
const react_1 = __importDefault(require("react"));
const clsx_1 = __importDefault(require("clsx"));
const ReactUtils_1 = require("../util/ReactUtils");
const PolarUtils_1 = require("../util/PolarUtils");
const DataUtils_1 = require("../util/DataUtils");
const getDeltaAngle = (startAngle, endAngle) => {
    const sign = (0, DataUtils_1.mathSign)(endAngle - startAngle);
    const deltaAngle = Math.min(Math.abs(endAngle - startAngle), 359.999);
    return sign * deltaAngle;
};
const getTangentCircle = ({ cx, cy, radius, angle, sign, isExternal, cornerRadius, cornerIsExternal, }) => {
    const centerRadius = cornerRadius * (isExternal ? 1 : -1) + radius;
    const theta = Math.asin(cornerRadius / centerRadius) / PolarUtils_1.RADIAN;
    const centerAngle = cornerIsExternal ? angle : angle + sign * theta;
    const center = (0, PolarUtils_1.polarToCartesian)(cx, cy, centerRadius, centerAngle);
    const circleTangency = (0, PolarUtils_1.polarToCartesian)(cx, cy, radius, centerAngle);
    const lineTangencyAngle = cornerIsExternal ? angle - sign * theta : angle;
    const lineTangency = (0, PolarUtils_1.polarToCartesian)(cx, cy, centerRadius * Math.cos(theta * PolarUtils_1.RADIAN), lineTangencyAngle);
    return { center, circleTangency, lineTangency, theta };
};
const getSectorPath = ({ cx, cy, innerRadius, outerRadius, startAngle, endAngle }) => {
    const angle = getDeltaAngle(startAngle, endAngle);
    const tempEndAngle = startAngle + angle;
    const outerStartPoint = (0, PolarUtils_1.polarToCartesian)(cx, cy, outerRadius, startAngle);
    const outerEndPoint = (0, PolarUtils_1.polarToCartesian)(cx, cy, outerRadius, tempEndAngle);
    let path = `M ${outerStartPoint.x},${outerStartPoint.y}
    A ${outerRadius},${outerRadius},0,
    ${+(Math.abs(angle) > 180)},${+(startAngle > tempEndAngle)},
    ${outerEndPoint.x},${outerEndPoint.y}
  `;
    if (innerRadius > 0) {
        const innerStartPoint = (0, PolarUtils_1.polarToCartesian)(cx, cy, innerRadius, startAngle);
        const innerEndPoint = (0, PolarUtils_1.polarToCartesian)(cx, cy, innerRadius, tempEndAngle);
        path += `L ${innerEndPoint.x},${innerEndPoint.y}
            A ${innerRadius},${innerRadius},0,
            ${+(Math.abs(angle) > 180)},${+(startAngle <= tempEndAngle)},
            ${innerStartPoint.x},${innerStartPoint.y} Z`;
    }
    else {
        path += `L ${cx},${cy} Z`;
    }
    return path;
};
const getSectorWithCorner = ({ cx, cy, innerRadius, outerRadius, cornerRadius, forceCornerRadius, cornerIsExternal, startAngle, endAngle, }) => {
    const sign = (0, DataUtils_1.mathSign)(endAngle - startAngle);
    const { circleTangency: soct, lineTangency: solt, theta: sot, } = getTangentCircle({
        cx,
        cy,
        radius: outerRadius,
        angle: startAngle,
        sign,
        cornerRadius,
        cornerIsExternal,
    });
    const { circleTangency: eoct, lineTangency: eolt, theta: eot, } = getTangentCircle({
        cx,
        cy,
        radius: outerRadius,
        angle: endAngle,
        sign: -sign,
        cornerRadius,
        cornerIsExternal,
    });
    const outerArcAngle = cornerIsExternal
        ? Math.abs(startAngle - endAngle)
        : Math.abs(startAngle - endAngle) - sot - eot;
    if (outerArcAngle < 0) {
        if (forceCornerRadius) {
            return `M ${solt.x},${solt.y}
        a${cornerRadius},${cornerRadius},0,0,1,${cornerRadius * 2},0
        a${cornerRadius},${cornerRadius},0,0,1,${-cornerRadius * 2},0
      `;
        }
        return getSectorPath({
            cx,
            cy,
            innerRadius,
            outerRadius,
            startAngle,
            endAngle,
        });
    }
    let path = `M ${solt.x},${solt.y}
    A${cornerRadius},${cornerRadius},0,0,${+(sign < 0)},${soct.x},${soct.y}
    A${outerRadius},${outerRadius},0,${+(outerArcAngle > 180)},${+(sign < 0)},${eoct.x},${eoct.y}
    A${cornerRadius},${cornerRadius},0,0,${+(sign < 0)},${eolt.x},${eolt.y}
  `;
    if (innerRadius > 0) {
        const { circleTangency: sict, lineTangency: silt, theta: sit, } = getTangentCircle({
            cx,
            cy,
            radius: innerRadius,
            angle: startAngle,
            sign,
            isExternal: true,
            cornerRadius,
            cornerIsExternal,
        });
        const { circleTangency: eict, lineTangency: eilt, theta: eit, } = getTangentCircle({
            cx,
            cy,
            radius: innerRadius,
            angle: endAngle,
            sign: -sign,
            isExternal: true,
            cornerRadius,
            cornerIsExternal,
        });
        const innerArcAngle = cornerIsExternal
            ? Math.abs(startAngle - endAngle)
            : Math.abs(startAngle - endAngle) - sit - eit;
        if (innerArcAngle < 0 && cornerRadius === 0) {
            return `${path}L${cx},${cy}Z`;
        }
        path += `L${eilt.x},${eilt.y}
      A${cornerRadius},${cornerRadius},0,0,${+(sign < 0)},${eict.x},${eict.y}
      A${innerRadius},${innerRadius},0,${+(innerArcAngle > 180)},${+(sign > 0)},${sict.x},${sict.y}
      A${cornerRadius},${cornerRadius},0,0,${+(sign < 0)},${silt.x},${silt.y}Z`;
    }
    else {
        path += `L${cx},${cy}Z`;
    }
    return path;
};
const defaultProps = {
    cx: 0,
    cy: 0,
    innerRadius: 0,
    outerRadius: 0,
    startAngle: 0,
    endAngle: 0,
    cornerRadius: 0,
    forceCornerRadius: false,
    cornerIsExternal: false,
};
const Sector = sectorProps => {
    const props = Object.assign(Object.assign({}, defaultProps), sectorProps);
    const { cx, cy, innerRadius, outerRadius, cornerRadius, forceCornerRadius, cornerIsExternal, startAngle, endAngle, className, } = props;
    if (outerRadius < innerRadius || startAngle === endAngle) {
        return null;
    }
    const layerClass = (0, clsx_1.default)('recharts-sector', className);
    const deltaRadius = outerRadius - innerRadius;
    const cr = (0, DataUtils_1.getPercentValue)(cornerRadius, deltaRadius, 0, true);
    let path;
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
            endAngle,
        });
    }
    else {
        path = getSectorPath({ cx, cy, innerRadius, outerRadius, startAngle, endAngle });
    }
    return react_1.default.createElement("path", Object.assign({}, (0, ReactUtils_1.filterProps)(props, true), { className: layerClass, d: path, role: "img" }));
};
exports.Sector = Sector;
//# sourceMappingURL=Sector.js.map