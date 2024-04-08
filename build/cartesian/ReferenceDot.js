"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReferenceDot = void 0;
const react_1 = __importDefault(require("react"));
const isFunction_1 = __importDefault(require("lodash/isFunction"));
const clsx_1 = __importDefault(require("clsx"));
const Layer_1 = require("../container/Layer");
const Dot_1 = require("../shape/Dot");
const Label_1 = require("../component/Label");
const DataUtils_1 = require("../util/DataUtils");
const CartesianUtils_1 = require("../util/CartesianUtils");
const ReactUtils_1 = require("../util/ReactUtils");
const chartLayoutContext_1 = require("../context/chartLayoutContext");
const useCoordinate = (x, y, xAxisId, yAxisId, ifOverflow) => {
    const isX = (0, DataUtils_1.isNumOrStr)(x);
    const isY = (0, DataUtils_1.isNumOrStr)(y);
    const xAxis = (0, chartLayoutContext_1.useXAxisOrThrow)(xAxisId);
    const yAxis = (0, chartLayoutContext_1.useYAxisOrThrow)(yAxisId);
    if (!isX || !isY) {
        return null;
    }
    const scales = (0, CartesianUtils_1.createLabeledScales)({ x: xAxis.scale, y: yAxis.scale });
    const result = scales.apply({ x, y }, { bandAware: true });
    if (ifOverflow === 'discard' && !scales.isInRange(result)) {
        return null;
    }
    return result;
};
function ReferenceDot(props) {
    const { x, y, r } = props;
    const clipPathId = (0, chartLayoutContext_1.useClipPathId)();
    const coordinate = useCoordinate(x, y, props.xAxisId, props.yAxisId, props.ifOverflow);
    if (!coordinate) {
        return null;
    }
    const { x: cx, y: cy } = coordinate;
    const { shape, className, ifOverflow } = props;
    const clipPath = ifOverflow === 'hidden' ? `url(#${clipPathId})` : undefined;
    const dotProps = Object.assign(Object.assign({ clipPath }, (0, ReactUtils_1.filterProps)(props, true)), { cx,
        cy });
    return (react_1.default.createElement(Layer_1.Layer, { className: (0, clsx_1.default)('recharts-reference-dot', className) },
        ReferenceDot.renderDot(shape, dotProps),
        Label_1.Label.renderCallByParent(props, {
            x: cx - r,
            y: cy - r,
            width: 2 * r,
            height: 2 * r,
        })));
}
exports.ReferenceDot = ReferenceDot;
ReferenceDot.displayName = 'ReferenceDot';
ReferenceDot.defaultProps = {
    isFront: false,
    ifOverflow: 'discard',
    xAxisId: 0,
    yAxisId: 0,
    r: 10,
    fill: '#fff',
    stroke: '#ccc',
    fillOpacity: 1,
    strokeWidth: 1,
};
ReferenceDot.renderDot = (option, props) => {
    let dot;
    if (react_1.default.isValidElement(option)) {
        dot = react_1.default.cloneElement(option, props);
    }
    else if ((0, isFunction_1.default)(option)) {
        dot = option(props);
    }
    else {
        dot = react_1.default.createElement(Dot_1.Dot, Object.assign({}, props, { cx: props.cx, cy: props.cy, className: "recharts-reference-dot-dot" }));
    }
    return dot;
};
//# sourceMappingURL=ReferenceDot.js.map