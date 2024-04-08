"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReferenceArea = void 0;
const react_1 = __importDefault(require("react"));
const isFunction_1 = __importDefault(require("lodash/isFunction"));
const clsx_1 = __importDefault(require("clsx"));
const Layer_1 = require("../container/Layer");
const Label_1 = require("../component/Label");
const CartesianUtils_1 = require("../util/CartesianUtils");
const DataUtils_1 = require("../util/DataUtils");
const Rectangle_1 = require("../shape/Rectangle");
const ReactUtils_1 = require("../util/ReactUtils");
const chartLayoutContext_1 = require("../context/chartLayoutContext");
const getRect = (hasX1, hasX2, hasY1, hasY2, xAxis, yAxis, props) => {
    const { x1: xValue1, x2: xValue2, y1: yValue1, y2: yValue2 } = props;
    if (!xAxis || !yAxis)
        return null;
    const scales = (0, CartesianUtils_1.createLabeledScales)({ x: xAxis.scale, y: yAxis.scale });
    const p1 = {
        x: hasX1 ? scales.x.apply(xValue1, { position: 'start' }) : scales.x.rangeMin,
        y: hasY1 ? scales.y.apply(yValue1, { position: 'start' }) : scales.y.rangeMin,
    };
    const p2 = {
        x: hasX2 ? scales.x.apply(xValue2, { position: 'end' }) : scales.x.rangeMax,
        y: hasY2 ? scales.y.apply(yValue2, { position: 'end' }) : scales.y.rangeMax,
    };
    if (props.ifOverflow === 'discard' && (!scales.isInRange(p1) || !scales.isInRange(p2))) {
        return null;
    }
    return (0, CartesianUtils_1.rectWithPoints)(p1, p2);
};
const renderRect = (option, props) => {
    let rect;
    if (react_1.default.isValidElement(option)) {
        rect = react_1.default.cloneElement(option, props);
    }
    else if ((0, isFunction_1.default)(option)) {
        rect = option(props);
    }
    else {
        rect = react_1.default.createElement(Rectangle_1.Rectangle, Object.assign({}, props, { className: "recharts-reference-area-rect" }));
    }
    return rect;
};
function ReferenceArea(props) {
    const { x1, x2, y1, y2, className, shape, xAxisId, yAxisId } = props;
    const clipPathId = (0, chartLayoutContext_1.useClipPathId)();
    const xAxis = (0, chartLayoutContext_1.useMaybeXAxis)(xAxisId);
    const yAxis = (0, chartLayoutContext_1.useMaybeYAxis)(yAxisId);
    if (!xAxis || !yAxis)
        return null;
    const hasX1 = (0, DataUtils_1.isNumOrStr)(x1);
    const hasX2 = (0, DataUtils_1.isNumOrStr)(x2);
    const hasY1 = (0, DataUtils_1.isNumOrStr)(y1);
    const hasY2 = (0, DataUtils_1.isNumOrStr)(y2);
    if (!hasX1 && !hasX2 && !hasY1 && !hasY2 && !shape) {
        return null;
    }
    const rect = getRect(hasX1, hasX2, hasY1, hasY2, xAxis, yAxis, props);
    if (!rect && !shape) {
        return null;
    }
    const isOverflowHidden = props.ifOverflow === 'hidden';
    const clipPath = isOverflowHidden ? `url(#${clipPathId})` : undefined;
    return (react_1.default.createElement(Layer_1.Layer, { className: (0, clsx_1.default)('recharts-reference-area', className) },
        renderRect(shape, Object.assign(Object.assign({ clipPath }, (0, ReactUtils_1.filterProps)(props, true)), rect)),
        Label_1.Label.renderCallByParent(props, rect)));
}
exports.ReferenceArea = ReferenceArea;
ReferenceArea.displayName = 'ReferenceArea';
ReferenceArea.defaultProps = {
    isFront: false,
    ifOverflow: 'discard',
    xAxisId: 0,
    yAxisId: 0,
    r: 10,
    fill: '#ccc',
    fillOpacity: 0.5,
    stroke: 'none',
    strokeWidth: 1,
};
//# sourceMappingURL=ReferenceArea.js.map