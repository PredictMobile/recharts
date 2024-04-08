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
exports.Trapezoid = void 0;
const react_1 = __importStar(require("react"));
const clsx_1 = __importDefault(require("clsx"));
const react_smooth_1 = __importDefault(require("react-smooth"));
const ReactUtils_1 = require("../util/ReactUtils");
const getTrapezoidPath = (x, y, upperWidth, lowerWidth, height) => {
    const widthGap = upperWidth - lowerWidth;
    let path;
    path = `M ${x},${y}`;
    path += `L ${x + upperWidth},${y}`;
    path += `L ${x + upperWidth - widthGap / 2},${y + height}`;
    path += `L ${x + upperWidth - widthGap / 2 - lowerWidth},${y + height}`;
    path += `L ${x},${y} Z`;
    return path;
};
const defaultProps = {
    x: 0,
    y: 0,
    upperWidth: 0,
    lowerWidth: 0,
    height: 0,
    isUpdateAnimationActive: false,
    animationBegin: 0,
    animationDuration: 1500,
    animationEasing: 'ease',
};
const Trapezoid = props => {
    const trapezoidProps = Object.assign(Object.assign({}, defaultProps), props);
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
    const { x, y, upperWidth, lowerWidth, height, className } = trapezoidProps;
    const { animationEasing, animationDuration, animationBegin, isUpdateAnimationActive } = trapezoidProps;
    if (x !== +x ||
        y !== +y ||
        upperWidth !== +upperWidth ||
        lowerWidth !== +lowerWidth ||
        height !== +height ||
        (upperWidth === 0 && lowerWidth === 0) ||
        height === 0) {
        return null;
    }
    const layerClass = (0, clsx_1.default)('recharts-trapezoid', className);
    if (!isUpdateAnimationActive) {
        return (react_1.default.createElement("g", null,
            react_1.default.createElement("path", Object.assign({}, (0, ReactUtils_1.filterProps)(trapezoidProps, true), { className: layerClass, d: getTrapezoidPath(x, y, upperWidth, lowerWidth, height) }))));
    }
    return (react_1.default.createElement(react_smooth_1.default, { canBegin: totalLength > 0, from: { upperWidth: 0, lowerWidth: 0, height, x, y }, to: { upperWidth, lowerWidth, height, x, y }, duration: animationDuration, animationEasing: animationEasing, isActive: isUpdateAnimationActive }, ({ upperWidth: currUpperWidth, lowerWidth: currLowerWidth, height: currHeight, x: currX, y: currY, }) => (react_1.default.createElement(react_smooth_1.default, { canBegin: totalLength > 0, from: `0px ${totalLength === -1 ? 1 : totalLength}px`, to: `${totalLength}px 0px`, attributeName: "strokeDasharray", begin: animationBegin, duration: animationDuration, easing: animationEasing },
        react_1.default.createElement("path", Object.assign({}, (0, ReactUtils_1.filterProps)(trapezoidProps, true), { className: layerClass, d: getTrapezoidPath(currX, currY, currUpperWidth, currLowerWidth, currHeight), ref: pathRef }))))));
};
exports.Trapezoid = Trapezoid;
//# sourceMappingURL=Trapezoid.js.map