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
exports.Brush = void 0;
const react_1 = __importStar(require("react"));
const clsx_1 = __importDefault(require("clsx"));
const d3_scale_1 = require("victory-vendor/d3-scale");
const isFunction_1 = __importDefault(require("lodash/isFunction"));
const range_1 = __importDefault(require("lodash/range"));
const Layer_1 = require("../container/Layer");
const Text_1 = require("../component/Text");
const ChartUtils_1 = require("../util/ChartUtils");
const DataUtils_1 = require("../util/DataUtils");
const CssPrefixUtils_1 = require("../util/CssPrefixUtils");
const ReactUtils_1 = require("../util/ReactUtils");
const chartLayoutContext_1 = require("../context/chartLayoutContext");
const chartDataContext_1 = require("../context/chartDataContext");
const brushUpdateContext_1 = require("../context/brushUpdateContext");
function DefaultTraveller(props) {
    const { x, y, width, height, stroke } = props;
    const lineY = Math.floor(y + height / 2) - 1;
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("rect", { x: x, y: y, width: width, height: height, fill: stroke, stroke: "none" }),
        react_1.default.createElement("line", { x1: x + 1, y1: lineY, x2: x + width - 1, y2: lineY, fill: "none", stroke: "#fff" }),
        react_1.default.createElement("line", { x1: x + 1, y1: lineY + 2, x2: x + width - 1, y2: lineY + 2, fill: "none", stroke: "#fff" })));
}
function Traveller(props) {
    const { travellerProps, travellerType } = props;
    if (react_1.default.isValidElement(travellerType)) {
        return react_1.default.cloneElement(travellerType, travellerProps);
    }
    if ((0, isFunction_1.default)(travellerType)) {
        return travellerType(travellerProps);
    }
    return react_1.default.createElement(DefaultTraveller, Object.assign({}, travellerProps));
}
function TravellerLayer({ otherProps, travellerX, id, onMouseEnter, onMouseLeave, onMouseDown, onTouchStart, onTravellerMoveKeyboard, onFocus, onBlur, }) {
    const { y, x: xFromProps, travellerWidth, height, traveller, ariaLabel, data, startIndex, endIndex } = otherProps;
    const x = Math.max(travellerX, xFromProps);
    const travellerProps = Object.assign(Object.assign({}, (0, ReactUtils_1.filterProps)(otherProps, false)), { x,
        y, width: travellerWidth, height });
    const ariaLabelBrush = ariaLabel || `Min value: ${data[startIndex].name}, Max value: ${data[endIndex].name}`;
    return (react_1.default.createElement(Layer_1.Layer, { tabIndex: 0, role: "slider", "aria-label": ariaLabelBrush, "aria-valuenow": travellerX, className: "recharts-brush-traveller", onMouseEnter: onMouseEnter, onMouseLeave: onMouseLeave, onMouseDown: onMouseDown, onTouchStart: onTouchStart, onKeyDown: e => {
            if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) {
                return;
            }
            e.preventDefault();
            e.stopPropagation();
            onTravellerMoveKeyboard(e.key === 'ArrowRight' ? 1 : -1, id);
        }, onFocus: onFocus, onBlur: onBlur, style: { cursor: 'col-resize' } },
        react_1.default.createElement(Traveller, { travellerType: traveller, travellerProps: travellerProps })));
}
function getTextOfTick(props) {
    const { index, data, tickFormatter, dataKey } = props;
    const text = (0, ChartUtils_1.getValueByDataKey)(data[index], dataKey, index);
    return (0, isFunction_1.default)(tickFormatter) ? tickFormatter(text, index) : text;
}
function getIndexInRange(valueRange, x) {
    const len = valueRange.length;
    let start = 0;
    let end = len - 1;
    while (end - start > 1) {
        const middle = Math.floor((start + end) / 2);
        if (valueRange[middle] > x) {
            end = middle;
        }
        else {
            start = middle;
        }
    }
    return x >= valueRange[end] ? end : start;
}
function getIndex({ startX, endX, scaleValues, gap, data, }) {
    const lastIndex = data.length - 1;
    const min = Math.min(startX, endX);
    const max = Math.max(startX, endX);
    const minIndex = getIndexInRange(scaleValues, min);
    const maxIndex = getIndexInRange(scaleValues, max);
    return {
        startIndex: minIndex - (minIndex % gap),
        endIndex: maxIndex === lastIndex ? lastIndex : maxIndex - (maxIndex % gap),
    };
}
function Background({ x, y, width, height, fill, stroke, }) {
    return react_1.default.createElement("rect", { stroke: stroke, fill: fill, x: x, y: y, width: width, height: height });
}
function BrushText({ startIndex, endIndex, y, height, travellerWidth, stroke, tickFormatter, dataKey, data, startX, endX, }) {
    const offset = 5;
    const attrs = {
        pointerEvents: 'none',
        fill: stroke,
    };
    return (react_1.default.createElement(Layer_1.Layer, { className: "recharts-brush-texts" },
        react_1.default.createElement(Text_1.Text, Object.assign({ textAnchor: "end", verticalAnchor: "middle", x: Math.min(startX, endX) - offset, y: y + height / 2 }, attrs), getTextOfTick({ index: startIndex, tickFormatter, dataKey, data })),
        react_1.default.createElement(Text_1.Text, Object.assign({ textAnchor: "start", verticalAnchor: "middle", x: Math.max(startX, endX) + travellerWidth + offset, y: y + height / 2 }, attrs), getTextOfTick({ index: endIndex, tickFormatter, dataKey, data }))));
}
function Slide({ y, height, stroke, travellerWidth, startX, endX, onMouseEnter, onMouseLeave, onMouseDown, onTouchStart, }) {
    const x = Math.min(startX, endX) + travellerWidth;
    const width = Math.max(Math.abs(endX - startX) - travellerWidth, 0);
    return (react_1.default.createElement("rect", { className: "recharts-brush-slide", onMouseEnter: onMouseEnter, onMouseLeave: onMouseLeave, onMouseDown: onMouseDown, onTouchStart: onTouchStart, style: { cursor: 'move' }, stroke: "none", fill: stroke, fillOpacity: 0.2, x: x, y: y, width: width, height: height }));
}
function Panorama({ x, y, width, height, data, children, padding, }) {
    const isPanoramic = react_1.default.Children.count(children) === 1;
    if (!isPanoramic) {
        return null;
    }
    const chartElement = react_1.Children.only(children);
    if (!chartElement) {
        return null;
    }
    return react_1.default.cloneElement(chartElement, {
        x,
        y,
        width,
        height,
        margin: padding,
        compact: true,
        data,
    });
}
const createScale = ({ data, startIndex, endIndex, x, width, travellerWidth, }) => {
    if (!data || !data.length) {
        return {};
    }
    const len = data.length;
    const scale = (0, d3_scale_1.scalePoint)()
        .domain((0, range_1.default)(0, len))
        .range([x, x + width - travellerWidth]);
    const scaleValues = scale.domain().map(entry => scale(entry));
    return {
        isTextActive: false,
        isSlideMoving: false,
        isTravellerMoving: false,
        isTravellerFocused: false,
        startX: scale(startIndex),
        endX: scale(endIndex),
        scale,
        scaleValues,
    };
};
const isTouch = (e) => e.changedTouches && !!e.changedTouches.length;
class BrushWithState extends react_1.PureComponent {
    constructor(props) {
        super(props);
        this.handleDrag = (e) => {
            if (this.leaveTimer) {
                clearTimeout(this.leaveTimer);
                this.leaveTimer = null;
            }
            if (this.state.isTravellerMoving) {
                this.handleTravellerMove(e);
            }
            else if (this.state.isSlideMoving) {
                this.handleSlideDrag(e);
            }
        };
        this.handleTouchMove = (e) => {
            if (e.changedTouches != null && e.changedTouches.length > 0) {
                this.handleDrag(e.changedTouches[0]);
            }
        };
        this.handleDragEnd = () => {
            this.setState({
                isTravellerMoving: false,
                isSlideMoving: false,
            }, () => {
                const { endIndex, onDragEnd, startIndex } = this.props;
                onDragEnd === null || onDragEnd === void 0 ? void 0 : onDragEnd({
                    endIndex,
                    startIndex,
                });
            });
            this.detachDragEndListener();
        };
        this.handleLeaveWrapper = () => {
            if (this.state.isTravellerMoving || this.state.isSlideMoving) {
                this.leaveTimer = window.setTimeout(this.handleDragEnd, this.props.leaveTimeOut);
            }
        };
        this.handleEnterSlideOrTraveller = () => {
            this.setState({
                isTextActive: true,
            });
        };
        this.handleLeaveSlideOrTraveller = () => {
            this.setState({
                isTextActive: false,
            });
        };
        this.handleSlideDragStart = (e) => {
            const event = isTouch(e) ? e.changedTouches[0] : e;
            this.setState({
                isTravellerMoving: false,
                isSlideMoving: true,
                slideMoveStartX: event.pageX,
            });
            this.attachDragEndListener();
        };
        this.handleTravellerMoveKeyboard = (direction, id) => {
            const { data, gap } = this.props;
            const { scaleValues, startX, endX } = this.state;
            const currentScaleValue = this.state[id];
            const currentIndex = scaleValues.indexOf(currentScaleValue);
            if (currentIndex === -1) {
                return;
            }
            const newIndex = currentIndex + direction;
            if (newIndex === -1 || newIndex >= scaleValues.length) {
                return;
            }
            const newScaleValue = scaleValues[newIndex];
            if ((id === 'startX' && newScaleValue >= endX) || (id === 'endX' && newScaleValue <= startX)) {
                return;
            }
            this.setState({
                [id]: newScaleValue,
            }, () => {
                this.props.onChange(getIndex({
                    startX: this.state.startX,
                    endX: this.state.endX,
                    data,
                    gap,
                    scaleValues,
                }));
            });
        };
        this.travellerDragStartHandlers = {
            startX: this.handleTravellerDragStart.bind(this, 'startX'),
            endX: this.handleTravellerDragStart.bind(this, 'endX'),
        };
        this.state = {};
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        const { data, width, x, travellerWidth, updateId, startIndex, endIndex } = nextProps;
        if (data !== prevState.prevData || updateId !== prevState.prevUpdateId) {
            return Object.assign({ prevData: data, prevTravellerWidth: travellerWidth, prevUpdateId: updateId, prevX: x, prevWidth: width }, (data && data.length
                ? createScale({ data, width, x, travellerWidth, startIndex, endIndex })
                : { scale: null, scaleValues: null }));
        }
        if (prevState.scale &&
            (width !== prevState.prevWidth || x !== prevState.prevX || travellerWidth !== prevState.prevTravellerWidth)) {
            prevState.scale.range([x, x + width - travellerWidth]);
            const scaleValues = prevState.scale.domain().map(entry => prevState.scale(entry));
            return {
                prevData: data,
                prevTravellerWidth: travellerWidth,
                prevUpdateId: updateId,
                prevX: x,
                prevWidth: width,
                startX: prevState.scale(nextProps.startIndex),
                endX: prevState.scale(nextProps.endIndex),
                scaleValues,
            };
        }
        return null;
    }
    componentWillUnmount() {
        if (this.leaveTimer) {
            clearTimeout(this.leaveTimer);
            this.leaveTimer = null;
        }
        this.detachDragEndListener();
    }
    attachDragEndListener() {
        window.addEventListener('mouseup', this.handleDragEnd, true);
        window.addEventListener('touchend', this.handleDragEnd, true);
        window.addEventListener('mousemove', this.handleDrag, true);
    }
    detachDragEndListener() {
        window.removeEventListener('mouseup', this.handleDragEnd, true);
        window.removeEventListener('touchend', this.handleDragEnd, true);
        window.removeEventListener('mousemove', this.handleDrag, true);
    }
    handleSlideDrag(e) {
        const { slideMoveStartX, startX, endX, scaleValues } = this.state;
        const { x, width, travellerWidth, startIndex, endIndex, onChange, data, gap } = this.props;
        let delta = e.pageX - slideMoveStartX;
        if (delta > 0) {
            delta = Math.min(delta, x + width - travellerWidth - endX, x + width - travellerWidth - startX);
        }
        else if (delta < 0) {
            delta = Math.max(delta, x - startX, x - endX);
        }
        const newIndex = getIndex({
            startX: startX + delta,
            endX: endX + delta,
            data,
            gap,
            scaleValues,
        });
        if ((newIndex.startIndex !== startIndex || newIndex.endIndex !== endIndex) && onChange) {
            onChange(newIndex);
        }
        this.setState({
            startX: startX + delta,
            endX: endX + delta,
            slideMoveStartX: e.pageX,
        });
    }
    handleTravellerDragStart(id, e) {
        const event = isTouch(e) ? e.changedTouches[0] : e;
        this.setState({
            isSlideMoving: false,
            isTravellerMoving: true,
            movingTravellerId: id,
            brushMoveStartX: event.pageX,
        });
        this.attachDragEndListener();
    }
    handleTravellerMove(e) {
        const { brushMoveStartX, movingTravellerId, endX, startX, scaleValues } = this.state;
        const prevValue = this.state[movingTravellerId];
        const { x, width, travellerWidth, onChange, gap, data } = this.props;
        const params = { startX: this.state.startX, endX: this.state.endX, data, gap, scaleValues };
        let delta = e.pageX - brushMoveStartX;
        if (delta > 0) {
            delta = Math.min(delta, x + width - travellerWidth - prevValue);
        }
        else if (delta < 0) {
            delta = Math.max(delta, x - prevValue);
        }
        params[movingTravellerId] = prevValue + delta;
        const newIndex = getIndex(params);
        const { startIndex, endIndex } = newIndex;
        const isFullGap = () => {
            const lastIndex = data.length - 1;
            if ((movingTravellerId === 'startX' && (endX > startX ? startIndex % gap === 0 : endIndex % gap === 0)) ||
                (endX < startX && endIndex === lastIndex) ||
                (movingTravellerId === 'endX' && (endX > startX ? endIndex % gap === 0 : startIndex % gap === 0)) ||
                (endX > startX && endIndex === lastIndex)) {
                return true;
            }
            return false;
        };
        this.setState({
            [movingTravellerId]: prevValue + delta,
            brushMoveStartX: e.pageX,
        }, () => {
            if (onChange) {
                if (isFullGap()) {
                    onChange(newIndex);
                }
            }
        });
    }
    render() {
        const { data, className, children, x, y, width, height, alwaysShowText, fill, stroke, startIndex, endIndex, travellerWidth, tickFormatter, dataKey, padding, } = this.props;
        const { startX, endX, isTextActive, isSlideMoving, isTravellerMoving, isTravellerFocused } = this.state;
        if (!data ||
            !data.length ||
            !(0, DataUtils_1.isNumber)(x) ||
            !(0, DataUtils_1.isNumber)(y) ||
            !(0, DataUtils_1.isNumber)(width) ||
            !(0, DataUtils_1.isNumber)(height) ||
            width <= 0 ||
            height <= 0) {
            return null;
        }
        const layerClass = (0, clsx_1.default)('recharts-brush', className);
        const style = (0, CssPrefixUtils_1.generatePrefixStyle)('userSelect', 'none');
        return (react_1.default.createElement(Layer_1.Layer, { className: layerClass, onMouseLeave: this.handleLeaveWrapper, onTouchMove: this.handleTouchMove, style: style },
            react_1.default.createElement(Background, { x: x, y: y, width: width, height: height, fill: fill, stroke: stroke }),
            react_1.default.createElement(Panorama, { x: x, y: y, width: width, height: height, data: data, padding: padding }, children),
            react_1.default.createElement(Slide, { y: y, height: height, stroke: stroke, travellerWidth: travellerWidth, startX: startX, endX: endX, onMouseEnter: this.handleEnterSlideOrTraveller, onMouseLeave: this.handleLeaveSlideOrTraveller, onMouseDown: this.handleSlideDragStart, onTouchStart: this.handleSlideDragStart }),
            react_1.default.createElement(TravellerLayer, { travellerX: startX, id: "startX", otherProps: this.props, onMouseEnter: this.handleEnterSlideOrTraveller, onMouseLeave: this.handleLeaveSlideOrTraveller, onMouseDown: this.travellerDragStartHandlers.startX, onTouchStart: this.travellerDragStartHandlers.startX, onTravellerMoveKeyboard: this.handleTravellerMoveKeyboard, onFocus: () => {
                    this.setState({ isTravellerFocused: true });
                }, onBlur: () => {
                    this.setState({ isTravellerFocused: false });
                } }),
            react_1.default.createElement(TravellerLayer, { travellerX: endX, id: "endX", otherProps: this.props, onMouseEnter: this.handleEnterSlideOrTraveller, onMouseLeave: this.handleLeaveSlideOrTraveller, onMouseDown: this.travellerDragStartHandlers.endX, onTouchStart: this.travellerDragStartHandlers.endX, onTravellerMoveKeyboard: this.handleTravellerMoveKeyboard, onFocus: () => {
                    this.setState({ isTravellerFocused: true });
                }, onBlur: () => {
                    this.setState({ isTravellerFocused: false });
                } }),
            (isTextActive || isSlideMoving || isTravellerMoving || isTravellerFocused || alwaysShowText) && (react_1.default.createElement(BrushText, { startIndex: startIndex, endIndex: endIndex, y: y, height: height, travellerWidth: travellerWidth, stroke: stroke, tickFormatter: tickFormatter, dataKey: dataKey, data: data, startX: startX, endX: endX }))));
    }
}
function BrushInternal(props) {
    const offset = (0, chartLayoutContext_1.useOffset)();
    const margin = (0, chartLayoutContext_1.useMargin)();
    const chartData = (0, chartDataContext_1.useChartData)();
    const { startIndex, endIndex } = (0, chartDataContext_1.useDataIndex)();
    const updateId = (0, chartLayoutContext_1.useUpdateId)();
    const onChangeFromContext = (0, react_1.useContext)(brushUpdateContext_1.BrushUpdateDispatchContext);
    const onChangeFromProps = props.onChange;
    const onChange = (0, react_1.useCallback)((nextState) => {
        onChangeFromContext === null || onChangeFromContext === void 0 ? void 0 : onChangeFromContext(nextState);
        onChangeFromProps === null || onChangeFromProps === void 0 ? void 0 : onChangeFromProps(nextState);
    }, [onChangeFromProps, onChangeFromContext]);
    const contextProperties = {
        data: chartData,
        x: (0, DataUtils_1.isNumber)(props.x) ? props.x : offset.left,
        y: (0, DataUtils_1.isNumber)(props.y) ? props.y : offset.top + offset.height + offset.brushBottom - (margin.bottom || 0),
        width: (0, DataUtils_1.isNumber)(props.width) ? props.width : offset.width,
        startIndex,
        endIndex,
        updateId,
        onChange,
    };
    return react_1.default.createElement(BrushWithState, Object.assign({}, props, contextProperties));
}
class Brush extends react_1.PureComponent {
    render() {
        return react_1.default.createElement(BrushInternal, Object.assign({}, this.props));
    }
}
exports.Brush = Brush;
Brush.displayName = 'Brush';
Brush.defaultProps = {
    height: 40,
    travellerWidth: 5,
    gap: 1,
    fill: '#fff',
    stroke: '#666',
    padding: { top: 1, right: 1, bottom: 1, left: 1 },
    leaveTimeOut: 1000,
    alwaysShowText: false,
};
//# sourceMappingURL=Brush.js.map