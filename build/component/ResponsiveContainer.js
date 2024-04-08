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
exports.ResponsiveContainer = void 0;
const clsx_1 = __importDefault(require("clsx"));
const react_1 = __importStar(require("react"));
const throttle_1 = __importDefault(require("lodash/throttle"));
const react_is_1 = require("react-is");
const DataUtils_1 = require("../util/DataUtils");
const LogUtils_1 = require("../util/LogUtils");
const ReactUtils_1 = require("../util/ReactUtils");
exports.ResponsiveContainer = (0, react_1.forwardRef)(({ aspect, initialDimension = {
    width: -1,
    height: -1,
}, width = '100%', height = '100%', minWidth = 0, minHeight, maxHeight, children, debounce = 0, id, className, onResize, style = {}, }, ref) => {
    const containerRef = (0, react_1.useRef)(null);
    const onResizeRef = (0, react_1.useRef)();
    onResizeRef.current = onResize;
    (0, react_1.useImperativeHandle)(ref, () => containerRef.current);
    const [sizes, setSizes] = (0, react_1.useState)({
        containerWidth: initialDimension.width,
        containerHeight: initialDimension.height,
    });
    const setContainerSize = (0, react_1.useCallback)((newWidth, newHeight) => {
        setSizes(prevState => {
            const roundedWidth = Math.round(newWidth);
            const roundedHeight = Math.round(newHeight);
            if (prevState.containerWidth === roundedWidth && prevState.containerHeight === roundedHeight) {
                return prevState;
            }
            return { containerWidth: roundedWidth, containerHeight: roundedHeight };
        });
    }, []);
    (0, react_1.useEffect)(() => {
        let callback = (entries) => {
            var _a;
            const { width: containerWidth, height: containerHeight } = entries[0].contentRect;
            setContainerSize(containerWidth, containerHeight);
            (_a = onResizeRef.current) === null || _a === void 0 ? void 0 : _a.call(onResizeRef, containerWidth, containerHeight);
        };
        if (debounce > 0) {
            callback = (0, throttle_1.default)(callback, debounce, { trailing: true, leading: false });
        }
        const observer = new ResizeObserver(callback);
        const { width: containerWidth, height: containerHeight } = containerRef.current.getBoundingClientRect();
        setContainerSize(containerWidth, containerHeight);
        observer.observe(containerRef.current);
        return () => {
            observer.disconnect();
        };
    }, [setContainerSize, debounce]);
    const chartContent = (0, react_1.useMemo)(() => {
        const { containerWidth, containerHeight } = sizes;
        if (containerWidth < 0 || containerHeight < 0) {
            return null;
        }
        (0, LogUtils_1.warn)((0, DataUtils_1.isPercent)(width) || (0, DataUtils_1.isPercent)(height), `The width(%s) and height(%s) are both fixed numbers,
       maybe you don't need to use a ResponsiveContainer.`, width, height);
        (0, LogUtils_1.warn)(!aspect || aspect > 0, 'The aspect(%s) must be greater than zero.', aspect);
        let calculatedWidth = (0, DataUtils_1.isPercent)(width) ? containerWidth : width;
        let calculatedHeight = (0, DataUtils_1.isPercent)(height) ? containerHeight : height;
        if (aspect && aspect > 0) {
            if (calculatedWidth) {
                calculatedHeight = calculatedWidth / aspect;
            }
            else if (calculatedHeight) {
                calculatedWidth = calculatedHeight * aspect;
            }
            if (maxHeight && calculatedHeight > maxHeight) {
                calculatedHeight = maxHeight;
            }
        }
        (0, LogUtils_1.warn)(calculatedWidth > 0 || calculatedHeight > 0, `The width(%s) and height(%s) of chart should be greater than 0,
       please check the style of container, or the props width(%s) and height(%s),
       or add a minWidth(%s) or minHeight(%s) or use aspect(%s) to control the
       height and width.`, calculatedWidth, calculatedHeight, width, height, minWidth, minHeight, aspect);
        const isCharts = !Array.isArray(children) && (0, react_is_1.isElement)(children) && (0, ReactUtils_1.getDisplayName)(children.type).endsWith('Chart');
        return react_1.default.Children.map(children, child => {
            if ((0, react_is_1.isElement)(child)) {
                return (0, react_1.cloneElement)(child, Object.assign({ width: calculatedWidth, height: calculatedHeight }, (isCharts
                    ? {
                        style: Object.assign({ height: '100%', width: '100%', maxHeight: calculatedHeight, maxWidth: calculatedWidth }, child.props.style),
                    }
                    : {})));
            }
            return child;
        });
    }, [aspect, children, height, maxHeight, minHeight, minWidth, sizes, width]);
    return (react_1.default.createElement("div", { id: id ? `${id}` : undefined, className: (0, clsx_1.default)('recharts-responsive-container', className), style: Object.assign(Object.assign({}, style), { width, height, minWidth, minHeight, maxHeight }), ref: containerRef }, chartContent));
});
//# sourceMappingURL=ResponsiveContainer.js.map