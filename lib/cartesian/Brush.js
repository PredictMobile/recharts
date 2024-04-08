"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Brush = void 0;
var _react = _interopRequireWildcard(require("react"));
var _clsx = _interopRequireDefault(require("clsx"));
var _d3Scale = require("victory-vendor/d3-scale");
var _isFunction = _interopRequireDefault(require("lodash/isFunction"));
var _range = _interopRequireDefault(require("lodash/range"));
var _Layer = require("../container/Layer");
var _Text = require("../component/Text");
var _ChartUtils = require("../util/ChartUtils");
var _DataUtils = require("../util/DataUtils");
var _CssPrefixUtils = require("../util/CssPrefixUtils");
var _ReactUtils = require("../util/ReactUtils");
var _chartLayoutContext = require("../context/chartLayoutContext");
var _chartDataContext = require("../context/chartDataContext");
var _brushUpdateContext = require("../context/brushUpdateContext");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /*
 * After we refactor classes to functional components, we can remove this eslint-disable
 */ /* eslint-disable max-classes-per-file */
// Why is this tickFormatter different from the other TickFormatters? This one allows to return numbers too for some reason.

function DefaultTraveller(props) {
  var {
    x,
    y,
    width,
    height,
    stroke
  } = props;
  var lineY = Math.floor(y + height / 2) - 1;
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("rect", {
    x: x,
    y: y,
    width: width,
    height: height,
    fill: stroke,
    stroke: "none"
  }), /*#__PURE__*/_react.default.createElement("line", {
    x1: x + 1,
    y1: lineY,
    x2: x + width - 1,
    y2: lineY,
    fill: "none",
    stroke: "#fff"
  }), /*#__PURE__*/_react.default.createElement("line", {
    x1: x + 1,
    y1: lineY + 2,
    x2: x + width - 1,
    y2: lineY + 2,
    fill: "none",
    stroke: "#fff"
  }));
}
function Traveller(props) {
  var {
    travellerProps,
    travellerType
  } = props;
  if ( /*#__PURE__*/_react.default.isValidElement(travellerType)) {
    // @ts-expect-error element cloning disagrees with the types (and it should)
    return /*#__PURE__*/_react.default.cloneElement(travellerType, travellerProps);
  }
  if ((0, _isFunction.default)(travellerType)) {
    return travellerType(travellerProps);
  }
  return /*#__PURE__*/_react.default.createElement(DefaultTraveller, travellerProps);
}
function TravellerLayer(_ref) {
  var {
    otherProps,
    travellerX,
    id,
    onMouseEnter,
    onMouseLeave,
    onMouseDown,
    onTouchStart,
    onTravellerMoveKeyboard,
    onFocus,
    onBlur
  } = _ref;
  var {
    y,
    x: xFromProps,
    travellerWidth,
    height,
    traveller,
    ariaLabel,
    data,
    startIndex,
    endIndex
  } = otherProps;
  var x = Math.max(travellerX, xFromProps);
  var travellerProps = _objectSpread(_objectSpread({}, (0, _ReactUtils.filterProps)(otherProps, false)), {}, {
    x,
    y,
    width: travellerWidth,
    height
  });
  var ariaLabelBrush = ariaLabel || "Min value: ".concat(data[startIndex].name, ", Max value: ").concat(data[endIndex].name);
  return /*#__PURE__*/_react.default.createElement(_Layer.Layer, {
    tabIndex: 0,
    role: "slider",
    "aria-label": ariaLabelBrush,
    "aria-valuenow": travellerX,
    className: "recharts-brush-traveller",
    onMouseEnter: onMouseEnter,
    onMouseLeave: onMouseLeave,
    onMouseDown: onMouseDown,
    onTouchStart: onTouchStart,
    onKeyDown: e => {
      if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      onTravellerMoveKeyboard(e.key === 'ArrowRight' ? 1 : -1, id);
    },
    onFocus: onFocus,
    onBlur: onBlur,
    style: {
      cursor: 'col-resize'
    }
  }, /*#__PURE__*/_react.default.createElement(Traveller, {
    travellerType: traveller,
    travellerProps: travellerProps
  }));
}
/*
 * This one cannot be a React Component because React is not happy with it returning only string | number.
 * React wants a full React.JSX.Element but that is not compatible with Text component.
 */
function getTextOfTick(props) {
  var {
    index,
    data,
    tickFormatter,
    dataKey
  } = props;
  var text = (0, _ChartUtils.getValueByDataKey)(data[index], dataKey, index);
  return (0, _isFunction.default)(tickFormatter) ? tickFormatter(text, index) : text;
}
function getIndexInRange(valueRange, x) {
  var len = valueRange.length;
  var start = 0;
  var end = len - 1;
  while (end - start > 1) {
    var middle = Math.floor((start + end) / 2);
    if (valueRange[middle] > x) {
      end = middle;
    } else {
      start = middle;
    }
  }
  return x >= valueRange[end] ? end : start;
}
function getIndex(_ref2) {
  var {
    startX,
    endX,
    scaleValues,
    gap,
    data
  } = _ref2;
  var lastIndex = data.length - 1;
  var min = Math.min(startX, endX);
  var max = Math.max(startX, endX);
  var minIndex = getIndexInRange(scaleValues, min);
  var maxIndex = getIndexInRange(scaleValues, max);
  return {
    startIndex: minIndex - minIndex % gap,
    endIndex: maxIndex === lastIndex ? lastIndex : maxIndex - maxIndex % gap
  };
}
function Background(_ref3) {
  var {
    x,
    y,
    width,
    height,
    fill,
    stroke
  } = _ref3;
  return /*#__PURE__*/_react.default.createElement("rect", {
    stroke: stroke,
    fill: fill,
    x: x,
    y: y,
    width: width,
    height: height
  });
}
function BrushText(_ref4) {
  var {
    startIndex,
    endIndex,
    y,
    height,
    travellerWidth,
    stroke,
    tickFormatter,
    dataKey,
    data,
    startX,
    endX
  } = _ref4;
  var offset = 5;
  var attrs = {
    pointerEvents: 'none',
    fill: stroke
  };
  return /*#__PURE__*/_react.default.createElement(_Layer.Layer, {
    className: "recharts-brush-texts"
  }, /*#__PURE__*/_react.default.createElement(_Text.Text, _extends({
    textAnchor: "end",
    verticalAnchor: "middle",
    x: Math.min(startX, endX) - offset,
    y: y + height / 2
  }, attrs), getTextOfTick({
    index: startIndex,
    tickFormatter,
    dataKey,
    data
  })), /*#__PURE__*/_react.default.createElement(_Text.Text, _extends({
    textAnchor: "start",
    verticalAnchor: "middle",
    x: Math.max(startX, endX) + travellerWidth + offset,
    y: y + height / 2
  }, attrs), getTextOfTick({
    index: endIndex,
    tickFormatter,
    dataKey,
    data
  })));
}
function Slide(_ref5) {
  var {
    y,
    height,
    stroke,
    travellerWidth,
    startX,
    endX,
    onMouseEnter,
    onMouseLeave,
    onMouseDown,
    onTouchStart
  } = _ref5;
  var x = Math.min(startX, endX) + travellerWidth;
  var width = Math.max(Math.abs(endX - startX) - travellerWidth, 0);
  return /*#__PURE__*/_react.default.createElement("rect", {
    className: "recharts-brush-slide",
    onMouseEnter: onMouseEnter,
    onMouseLeave: onMouseLeave,
    onMouseDown: onMouseDown,
    onTouchStart: onTouchStart,
    style: {
      cursor: 'move'
    },
    stroke: "none",
    fill: stroke,
    fillOpacity: 0.2,
    x: x,
    y: y,
    width: width,
    height: height
  });
}
function Panorama(_ref6) {
  var {
    x,
    y,
    width,
    height,
    data,
    children,
    padding
  } = _ref6;
  var isPanoramic = _react.default.Children.count(children) === 1;
  if (!isPanoramic) {
    return null;
  }
  var chartElement = _react.Children.only(children);
  if (!chartElement) {
    return null;
  }
  return /*#__PURE__*/_react.default.cloneElement(chartElement, {
    x,
    y,
    width,
    height,
    margin: padding,
    compact: true,
    data
  });
}
var createScale = _ref7 => {
  var {
    data,
    startIndex,
    endIndex,
    x,
    width,
    travellerWidth
  } = _ref7;
  if (!data || !data.length) {
    return {};
  }
  var len = data.length;
  var scale = (0, _d3Scale.scalePoint)().domain((0, _range.default)(0, len)).range([x, x + width - travellerWidth]);
  var scaleValues = scale.domain().map(entry => scale(entry));
  return {
    isTextActive: false,
    isSlideMoving: false,
    isTravellerMoving: false,
    isTravellerFocused: false,
    startX: scale(startIndex),
    endX: scale(endIndex),
    scale,
    scaleValues
  };
};
var isTouch = e => e.changedTouches && !!e.changedTouches.length;
class BrushWithState extends _react.PureComponent {
  constructor(props) {
    super(props);
    _defineProperty(this, "handleDrag", e => {
      if (this.leaveTimer) {
        clearTimeout(this.leaveTimer);
        this.leaveTimer = null;
      }
      if (this.state.isTravellerMoving) {
        this.handleTravellerMove(e);
      } else if (this.state.isSlideMoving) {
        this.handleSlideDrag(e);
      }
    });
    _defineProperty(this, "handleTouchMove", e => {
      if (e.changedTouches != null && e.changedTouches.length > 0) {
        this.handleDrag(e.changedTouches[0]);
      }
    });
    _defineProperty(this, "handleDragEnd", () => {
      this.setState({
        isTravellerMoving: false,
        isSlideMoving: false
      }, () => {
        var {
          endIndex,
          onDragEnd,
          startIndex
        } = this.props;
        onDragEnd === null || onDragEnd === void 0 || onDragEnd({
          endIndex,
          startIndex
        });
      });
      this.detachDragEndListener();
    });
    _defineProperty(this, "handleLeaveWrapper", () => {
      if (this.state.isTravellerMoving || this.state.isSlideMoving) {
        this.leaveTimer = window.setTimeout(this.handleDragEnd, this.props.leaveTimeOut);
      }
    });
    _defineProperty(this, "handleEnterSlideOrTraveller", () => {
      this.setState({
        isTextActive: true
      });
    });
    _defineProperty(this, "handleLeaveSlideOrTraveller", () => {
      this.setState({
        isTextActive: false
      });
    });
    _defineProperty(this, "handleSlideDragStart", e => {
      var event = isTouch(e) ? e.changedTouches[0] : e;
      this.setState({
        isTravellerMoving: false,
        isSlideMoving: true,
        slideMoveStartX: event.pageX
      });
      this.attachDragEndListener();
    });
    _defineProperty(this, "handleTravellerMoveKeyboard", (direction, id) => {
      var {
        data,
        gap
      } = this.props;
      // scaleValues are a list of coordinates. For example: [65, 250, 435, 620, 805, 990].
      var {
        scaleValues,
        startX,
        endX
      } = this.state;
      // currentScaleValue refers to which coordinate the current traveller should be placed at.
      var currentScaleValue = this.state[id];
      var currentIndex = scaleValues.indexOf(currentScaleValue);
      if (currentIndex === -1) {
        return;
      }
      var newIndex = currentIndex + direction;
      if (newIndex === -1 || newIndex >= scaleValues.length) {
        return;
      }
      var newScaleValue = scaleValues[newIndex];

      // Prevent travellers from being on top of each other or overlapping
      if (id === 'startX' && newScaleValue >= endX || id === 'endX' && newScaleValue <= startX) {
        return;
      }
      this.setState({
        [id]: newScaleValue
      }, () => {
        this.props.onChange(getIndex({
          startX: this.state.startX,
          endX: this.state.endX,
          data,
          gap,
          scaleValues
        }));
      });
    });
    this.travellerDragStartHandlers = {
      startX: this.handleTravellerDragStart.bind(this, 'startX'),
      endX: this.handleTravellerDragStart.bind(this, 'endX')
    };
    this.state = {};
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    var {
      data,
      width,
      x,
      travellerWidth,
      updateId,
      startIndex,
      endIndex
    } = nextProps;
    if (data !== prevState.prevData || updateId !== prevState.prevUpdateId) {
      return _objectSpread({
        prevData: data,
        prevTravellerWidth: travellerWidth,
        prevUpdateId: updateId,
        prevX: x,
        prevWidth: width
      }, data && data.length ? createScale({
        data,
        width,
        x,
        travellerWidth,
        startIndex,
        endIndex
      }) : {
        scale: null,
        scaleValues: null
      });
    }
    if (prevState.scale && (width !== prevState.prevWidth || x !== prevState.prevX || travellerWidth !== prevState.prevTravellerWidth)) {
      prevState.scale.range([x, x + width - travellerWidth]);
      var scaleValues = prevState.scale.domain().map(entry => prevState.scale(entry));
      return {
        prevData: data,
        prevTravellerWidth: travellerWidth,
        prevUpdateId: updateId,
        prevX: x,
        prevWidth: width,
        startX: prevState.scale(nextProps.startIndex),
        endX: prevState.scale(nextProps.endIndex),
        scaleValues
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
    var {
      slideMoveStartX,
      startX,
      endX,
      scaleValues
    } = this.state;
    var {
      x,
      width,
      travellerWidth,
      startIndex,
      endIndex,
      onChange,
      data,
      gap
    } = this.props;
    var delta = e.pageX - slideMoveStartX;
    if (delta > 0) {
      delta = Math.min(delta, x + width - travellerWidth - endX, x + width - travellerWidth - startX);
    } else if (delta < 0) {
      delta = Math.max(delta, x - startX, x - endX);
    }
    var newIndex = getIndex({
      startX: startX + delta,
      endX: endX + delta,
      data,
      gap,
      scaleValues
    });
    if ((newIndex.startIndex !== startIndex || newIndex.endIndex !== endIndex) && onChange) {
      onChange(newIndex);
    }
    this.setState({
      startX: startX + delta,
      endX: endX + delta,
      slideMoveStartX: e.pageX
    });
  }
  handleTravellerDragStart(id, e) {
    var event = isTouch(e) ? e.changedTouches[0] : e;
    this.setState({
      isSlideMoving: false,
      isTravellerMoving: true,
      movingTravellerId: id,
      brushMoveStartX: event.pageX
    });
    this.attachDragEndListener();
  }
  handleTravellerMove(e) {
    var {
      brushMoveStartX,
      movingTravellerId,
      endX,
      startX,
      scaleValues
    } = this.state;
    var prevValue = this.state[movingTravellerId];
    var {
      x,
      width,
      travellerWidth,
      onChange,
      gap,
      data
    } = this.props;
    var params = {
      startX: this.state.startX,
      endX: this.state.endX,
      data,
      gap,
      scaleValues
    };
    var delta = e.pageX - brushMoveStartX;
    if (delta > 0) {
      delta = Math.min(delta, x + width - travellerWidth - prevValue);
    } else if (delta < 0) {
      delta = Math.max(delta, x - prevValue);
    }
    params[movingTravellerId] = prevValue + delta;
    var newIndex = getIndex(params);
    var {
      startIndex,
      endIndex
    } = newIndex;
    var isFullGap = () => {
      var lastIndex = data.length - 1;
      if (movingTravellerId === 'startX' && (endX > startX ? startIndex % gap === 0 : endIndex % gap === 0) || endX < startX && endIndex === lastIndex || movingTravellerId === 'endX' && (endX > startX ? endIndex % gap === 0 : startIndex % gap === 0) || endX > startX && endIndex === lastIndex) {
        return true;
      }
      return false;
    };
    this.setState({
      [movingTravellerId]: prevValue + delta,
      brushMoveStartX: e.pageX
    }, () => {
      if (onChange) {
        if (isFullGap()) {
          onChange(newIndex);
        }
      }
    });
  }
  render() {
    var {
      data,
      className,
      children,
      x,
      y,
      width,
      height,
      alwaysShowText,
      fill,
      stroke,
      startIndex,
      endIndex,
      travellerWidth,
      tickFormatter,
      dataKey,
      padding
    } = this.props;
    var {
      startX,
      endX,
      isTextActive,
      isSlideMoving,
      isTravellerMoving,
      isTravellerFocused
    } = this.state;
    if (!data || !data.length || !(0, _DataUtils.isNumber)(x) || !(0, _DataUtils.isNumber)(y) || !(0, _DataUtils.isNumber)(width) || !(0, _DataUtils.isNumber)(height) || width <= 0 || height <= 0) {
      return null;
    }
    var layerClass = (0, _clsx.default)('recharts-brush', className);
    var style = (0, _CssPrefixUtils.generatePrefixStyle)('userSelect', 'none');
    return /*#__PURE__*/_react.default.createElement(_Layer.Layer, {
      className: layerClass,
      onMouseLeave: this.handleLeaveWrapper,
      onTouchMove: this.handleTouchMove,
      style: style
    }, /*#__PURE__*/_react.default.createElement(Background, {
      x: x,
      y: y,
      width: width,
      height: height,
      fill: fill,
      stroke: stroke
    }), /*#__PURE__*/_react.default.createElement(Panorama, {
      x: x,
      y: y,
      width: width,
      height: height,
      data: data,
      padding: padding
    }, children), /*#__PURE__*/_react.default.createElement(Slide, {
      y: y,
      height: height,
      stroke: stroke,
      travellerWidth: travellerWidth,
      startX: startX,
      endX: endX,
      onMouseEnter: this.handleEnterSlideOrTraveller,
      onMouseLeave: this.handleLeaveSlideOrTraveller,
      onMouseDown: this.handleSlideDragStart,
      onTouchStart: this.handleSlideDragStart
    }), /*#__PURE__*/_react.default.createElement(TravellerLayer, {
      travellerX: startX,
      id: "startX",
      otherProps: this.props,
      onMouseEnter: this.handleEnterSlideOrTraveller,
      onMouseLeave: this.handleLeaveSlideOrTraveller,
      onMouseDown: this.travellerDragStartHandlers.startX,
      onTouchStart: this.travellerDragStartHandlers.startX,
      onTravellerMoveKeyboard: this.handleTravellerMoveKeyboard,
      onFocus: () => {
        this.setState({
          isTravellerFocused: true
        });
      },
      onBlur: () => {
        this.setState({
          isTravellerFocused: false
        });
      }
    }), /*#__PURE__*/_react.default.createElement(TravellerLayer, {
      travellerX: endX,
      id: "endX",
      otherProps: this.props,
      onMouseEnter: this.handleEnterSlideOrTraveller,
      onMouseLeave: this.handleLeaveSlideOrTraveller,
      onMouseDown: this.travellerDragStartHandlers.endX,
      onTouchStart: this.travellerDragStartHandlers.endX,
      onTravellerMoveKeyboard: this.handleTravellerMoveKeyboard,
      onFocus: () => {
        this.setState({
          isTravellerFocused: true
        });
      },
      onBlur: () => {
        this.setState({
          isTravellerFocused: false
        });
      }
    }), (isTextActive || isSlideMoving || isTravellerMoving || isTravellerFocused || alwaysShowText) && /*#__PURE__*/_react.default.createElement(BrushText, {
      startIndex: startIndex,
      endIndex: endIndex,
      y: y,
      height: height,
      travellerWidth: travellerWidth,
      stroke: stroke,
      tickFormatter: tickFormatter,
      dataKey: dataKey,
      data: data,
      startX: startX,
      endX: endX
    }));
  }
}
function BrushInternal(props) {
  var offset = (0, _chartLayoutContext.useOffset)();
  var margin = (0, _chartLayoutContext.useMargin)();
  var chartData = (0, _chartDataContext.useChartData)();
  var {
    startIndex,
    endIndex
  } = (0, _chartDataContext.useDataIndex)();
  var updateId = (0, _chartLayoutContext.useUpdateId)();
  var onChangeFromContext = (0, _react.useContext)(_brushUpdateContext.BrushUpdateDispatchContext);
  var onChangeFromProps = props.onChange;
  var onChange = (0, _react.useCallback)(nextState => {
    onChangeFromContext === null || onChangeFromContext === void 0 || onChangeFromContext(nextState);
    onChangeFromProps === null || onChangeFromProps === void 0 || onChangeFromProps(nextState);
  }, [onChangeFromProps, onChangeFromContext]);
  var contextProperties = {
    data: chartData,
    x: (0, _DataUtils.isNumber)(props.x) ? props.x : offset.left,
    y: (0, _DataUtils.isNumber)(props.y) ? props.y : offset.top + offset.height + offset.brushBottom - (margin.bottom || 0),
    width: (0, _DataUtils.isNumber)(props.width) ? props.width : offset.width,
    startIndex,
    endIndex,
    updateId,
    onChange
  };
  // @ts-expect-error typescript complains about IntrinsicClassAttributes not matching
  return /*#__PURE__*/_react.default.createElement(BrushWithState, _extends({}, props, contextProperties));
}
class Brush extends _react.PureComponent {
  render() {
    return /*#__PURE__*/_react.default.createElement(BrushInternal, this.props);
  }
}
exports.Brush = Brush;
_defineProperty(Brush, "displayName", 'Brush');
_defineProperty(Brush, "defaultProps", {
  height: 40,
  travellerWidth: 5,
  gap: 1,
  fill: '#fff',
  stroke: '#666',
  padding: {
    top: 1,
    right: 1,
    bottom: 1,
    left: 1
  },
  leaveTimeOut: 1000,
  alwaysShowText: false
});