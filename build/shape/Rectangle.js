"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rectangle = exports.isInRectangle = void 0;
const react_1 = __importStar(require("react"));
const clsx_1 = __importDefault(require("clsx"));
const react_smooth_1 = __importDefault(require("react-smooth"));
const ReactUtils_1 = require("../util/ReactUtils");
const getRectanglePath = (x, y, width, height, radius) => {
    const maxRadius = Math.min(Math.abs(width) / 2, Math.abs(height) / 2);
    const ySign = height >= 0 ? 1 : -1;
    const xSign = width >= 0 ? 1 : -1;
    const clockWise = (height >= 0 && width >= 0) || (height < 0 && width < 0) ? 1 : 0;
    let path;
    if (maxRadius > 0 && radius instanceof Array) {
        const newRadius = [0, 0, 0, 0];
        for (let i = 0, len = 4; i < len; i++) {
            newRadius[i] = radius[i] > maxRadius ? maxRadius : radius[i];
        }
        path = `M${x},${y + ySign * newRadius[0]}`;
        if (newRadius[0] > 0) {
            path += `A ${newRadius[0]},${newRadius[0]},0,0,${clockWise},${x + xSign * newRadius[0]},${y}`;
        }
        path += `L ${x + width - xSign * newRadius[1]},${y}`;
        if (newRadius[1] > 0) {
            path += `A ${newRadius[1]},${newRadius[1]},0,0,${clockWise},
        ${x + width},${y + ySign * newRadius[1]}`;
        }
        path += `L ${x + width},${y + height - ySign * newRadius[2]}`;
        if (newRadius[2] > 0) {
            path += `A ${newRadius[2]},${newRadius[2]},0,0,${clockWise},
        ${x + width - xSign * newRadius[2]},${y + height}`;
        }
        path += `L ${x + xSign * newRadius[3]},${y + height}`;
        if (newRadius[3] > 0) {
            path += `A ${newRadius[3]},${newRadius[3]},0,0,${clockWise},
        ${x},${y + height - ySign * newRadius[3]}`;
        }
        path += 'Z';
    }
    else if (maxRadius > 0 && radius === +radius && radius > 0) {
        const newRadius = Math.min(maxRadius, radius);
        path = `M ${x},${y + ySign * newRadius}
            A ${newRadius},${newRadius},0,0,${clockWise},${x + xSign * newRadius},${y}
            L ${x + width - xSign * newRadius},${y}
            A ${newRadius},${newRadius},0,0,${clockWise},${x + width},${y + ySign * newRadius}
            L ${x + width},${y + height - ySign * newRadius}
            A ${newRadius},${newRadius},0,0,${clockWise},${x + width - xSign * newRadius},${y + height}
            L ${x + xSign * newRadius},${y + height}
            A ${newRadius},${newRadius},0,0,${clockWise},${x},${y + height - ySign * newRadius} Z`;
    }
    else {
        path = `M ${x},${y} h ${width} v ${height} h ${-width} Z`;
    }
    return path;
};
const isInRectangle = (point, rect) => {
    if (!point || !rect) {
        return false;
    }
    const { x: px, y: py } = point;
    const { x, y, width, height } = rect;
    if (Math.abs(width) > 0 && Math.abs(height) > 0) {
        const minX = Math.min(x, x + width);
        const maxX = Math.max(x, x + width);
        const minY = Math.min(y, y + height);
        const maxY = Math.max(y, y + height);
        return px >= minX && px <= maxX && py >= minY && py <= maxY;
    }
    return false;
};
exports.isInRectangle = isInRectangle;
const defaultProps = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    radius: 0,
    isAnimationActive: false,
    isUpdateAnimationActive: false,
    animationBegin: 0,
    animationDuration: 1500,
    animationEasing: 'ease',
};
const Rectangle = rectangleProps => {
    const props = Object.assign(Object.assign({}, defaultProps), rectangleProps);
    const pathRef = (0, react_1.useRef)();
    const [totalLength, setTotalLength] = (0, react_1.useState)(-1);
    (0, react_1.useEffect)(() => {
        if (pathRef.current && pathRef.current.getTotalLength) {
            try {
                const pathTotalLength = pathRef.current.getTotalLength();
                if (pathTotalLength) {
                    setTotalLength(pathTotalLength);
                }
            }
            catch (err) {
            }
        }
    }, []);
    const { x, y, width, height, radius, className } = props;
    const { animationEasing, animationDuration, animationBegin, isAnimationActive, isUpdateAnimationActive } = props;
    if (x !== +x || y !== +y || width !== +width || height !== +height || width === 0 || height === 0) {
        return null;
    }
    const layerClass = (0, clsx_1.default)('recharts-rectangle', className);
    if (!isUpdateAnimationActive) {
        return (react_1.default.createElement("path", Object.assign({}, (0, ReactUtils_1.filterProps)(props, true), { className: layerClass, d: getRectanglePath(x, y, width, height, radius) })));
    }
    return (react_1.default.createElement(react_smooth_1.default, { canBegin: totalLength > 0, from: { width, height, x, y }, to: { width, height, x, y }, duration: animationDuration, animationEasing: animationEasing, isActive: isUpdateAnimationActive }, ({ width: currWidth, height: currHeight, x: currX, y: currY }) => (react_1.default.createElement(react_smooth_1.default, { canBegin: totalLength > 0, from: `0px ${totalLength === -1 ? 1 : totalLength}px`, to: `${totalLength}px 0px`, attributeName: "strokeDasharray", begin: animationBegin, duration: animationDuration, isActive: isAnimationActive, easing: animationEasing },
        react_1.default.createElement("path", Object.assign({}, (0, ReactUtils_1.filterProps)(props, true), { className: layerClass, d: getRectanglePath(currX, currY, currWidth, currHeight, radius), ref: pathRef }))))));
};
exports.Rectangle = Rectangle;
//# sourceMappingURL=Rectangle.js.map