"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReferenceLine = exports.getEndPoints = void 0;
const react_1 = __importDefault(require("react"));
const isFunction_1 = __importDefault(require("lodash/isFunction"));
const some_1 = __importDefault(require("lodash/some"));
const clsx_1 = __importDefault(require("clsx"));
const Layer_1 = require("../container/Layer");
const Label_1 = require("../component/Label");
const DataUtils_1 = require("../util/DataUtils");
const CartesianUtils_1 = require("../util/CartesianUtils");
const ReactUtils_1 = require("../util/ReactUtils");
const chartLayoutContext_1 = require("../context/chartLayoutContext");
const renderLine = (option, props) => {
    let line;
    if (react_1.default.isValidElement(option)) {
        line = react_1.default.cloneElement(option, props);
    }
    else if ((0, isFunction_1.default)(option)) {
        line = option(props);
    }
    else {
        line = react_1.default.createElement("line", Object.assign({}, props, { className: "recharts-reference-line-line" }));
    }
    return line;
};
const getEndPoints = (scales, isFixedX, isFixedY, isSegment, viewBox, position, xAxisOrientation, yAxisOrientation, props) => {
    const { x, y, width, height } = viewBox;
    if (isFixedY) {
        const { y: yCoord } = props;
        const coord = scales.y.apply(yCoord, { position });
        if (Number.isNaN(coord))
            return null;
        if (props.ifOverflow === 'discard' && !scales.y.isInRange(coord)) {
            return null;
        }
        const points = [
            { x: x + width, y: coord },
            { x, y: coord },
        ];
        return yAxisOrientation === 'left' ? points.reverse() : points;
    }
    if (isFixedX) {
        const { x: xCoord } = props;
        const coord = scales.x.apply(xCoord, { position });
        if (Number.isNaN(coord))
            return null;
        if (props.ifOverflow === 'discard' && !scales.x.isInRange(coord)) {
            return null;
        }
        const points = [
            { x: coord, y: y + height },
            { x: coord, y },
        ];
        return xAxisOrientation === 'top' ? points.reverse() : points;
    }
    if (isSegment) {
        const { segment } = props;
        const points = segment.map(p => scales.apply(p, { position }));
        if (props.ifOverflow === 'discard' && (0, some_1.default)(points, p => !scales.isInRange(p))) {
            return null;
        }
        return points;
    }
    return null;
};
exports.getEndPoints = getEndPoints;
function ReferenceLine(props) {
    const { x: fixedX, y: fixedY, segment, xAxisId, yAxisId, shape, className, ifOverflow } = props;
    const clipPathId = (0, chartLayoutContext_1.useClipPathId)();
    const xAxis = (0, chartLayoutContext_1.useXAxisOrThrow)(xAxisId);
    const yAxis = (0, chartLayoutContext_1.useYAxisOrThrow)(yAxisId);
    const viewBox = (0, chartLayoutContext_1.useViewBox)();
    if (!clipPathId || !viewBox) {
        return null;
    }
    const scales = (0, CartesianUtils_1.createLabeledScales)({ x: xAxis.scale, y: yAxis.scale });
    const isX = (0, DataUtils_1.isNumOrStr)(fixedX);
    const isY = (0, DataUtils_1.isNumOrStr)(fixedY);
    const isSegment = segment && segment.length === 2;
    const endPoints = (0, exports.getEndPoints)(scales, isX, isY, isSegment, viewBox, props.position, xAxis.orientation, yAxis.orientation, props);
    if (!endPoints) {
        return null;
    }
    const [{ x: x1, y: y1 }, { x: x2, y: y2 }] = endPoints;
    const clipPath = ifOverflow === 'hidden' ? `url(#${clipPathId})` : undefined;
    const lineProps = Object.assign(Object.assign({ clipPath }, (0, ReactUtils_1.filterProps)(props, true)), { x1,
        y1,
        x2,
        y2 });
    return (react_1.default.createElement(Layer_1.Layer, { className: (0, clsx_1.default)('recharts-reference-line', className) },
        renderLine(shape, lineProps),
        Label_1.Label.renderCallByParent(props, (0, CartesianUtils_1.rectWithCoords)({ x1, y1, x2, y2 }))));
}
exports.ReferenceLine = ReferenceLine;
ReferenceLine.displayName = 'ReferenceLine';
ReferenceLine.defaultProps = {
    isFront: false,
    ifOverflow: 'discard',
    xAxisId: 0,
    yAxisId: 0,
    fill: 'none',
    stroke: '#ccc',
    fillOpacity: 1,
    strokeWidth: 1,
    position: 'middle',
};
//# sourceMappingURL=ReferenceLine.js.map