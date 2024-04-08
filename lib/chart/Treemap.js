"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Treemap = void 0;
var _react = _interopRequireWildcard(require("react"));
var _isNaN = _interopRequireDefault(require("lodash/isNaN"));
var _isFunction = _interopRequireDefault(require("lodash/isFunction"));
var _omit = _interopRequireDefault(require("lodash/omit"));
var _get = _interopRequireDefault(require("lodash/get"));
var _clsx = _interopRequireDefault(require("clsx"));
var _reactSmooth = _interopRequireDefault(require("react-smooth"));
var _Tooltip = require("../component/Tooltip");
var _Layer = require("../container/Layer");
var _Surface = require("../container/Surface");
var _Polygon = require("../shape/Polygon");
var _Rectangle = require("../shape/Rectangle");
var _ChartUtils = require("../util/ChartUtils");
var _Constants = require("../util/Constants");
var _DataUtils = require("../util/DataUtils");
var _DOMUtils = require("../util/DOMUtils");
var _Global = require("../util/Global");
var _ReactUtils = require("../util/ReactUtils");
var _chartLayoutContext = require("../context/chartLayoutContext");
var _tooltipContext = require("../context/tooltipContext");
var _excluded = ["width", "height", "className", "style", "children", "type"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var NODE_VALUE_KEY = 'value';
var computeNode = _ref => {
  var {
    depth,
    node,
    index,
    dataKey
  } = _ref;
  var {
    children
  } = node;
  var childDepth = depth + 1;
  var computedChildren = children && children.length ? children.map((child, i) => computeNode({
    depth: childDepth,
    node: child,
    index: i,
    dataKey
  })) : null;
  var nodeValue;
  if (children && children.length) {
    nodeValue = computedChildren.reduce((result, child) => result + child[NODE_VALUE_KEY], 0);
  } else {
    // TODO need to verify dataKey
    nodeValue = (0, _isNaN.default)(node[dataKey]) || node[dataKey] <= 0 ? 0 : node[dataKey];
  }
  return _objectSpread(_objectSpread({}, node), {}, {
    children: computedChildren,
    [NODE_VALUE_KEY]: nodeValue,
    depth,
    index
  });
};
var filterRect = node => ({
  x: node.x,
  y: node.y,
  width: node.width,
  height: node.height
});

// Compute the area for each child based on value & scale.
var getAreaOfChildren = (children, areaValueRatio) => {
  var ratio = areaValueRatio < 0 ? 0 : areaValueRatio;
  return children.map(child => {
    var area = child[NODE_VALUE_KEY] * ratio;
    return _objectSpread(_objectSpread({}, child), {}, {
      area: (0, _isNaN.default)(area) || area <= 0 ? 0 : area
    });
  });
};

// Computes the score for the specified row, as the worst aspect ratio.
var getWorstScore = (row, parentSize, aspectRatio) => {
  var parentArea = parentSize * parentSize;
  var rowArea = row.area * row.area;
  var {
    min,
    max
  } = row.reduce((result, child) => ({
    min: Math.min(result.min, child.area),
    max: Math.max(result.max, child.area)
  }), {
    min: Infinity,
    max: 0
  });
  return rowArea ? Math.max(parentArea * max * aspectRatio / rowArea, rowArea / (parentArea * min * aspectRatio)) : Infinity;
};
var horizontalPosition = (row, parentSize, parentRect, isFlush) => {
  var rowHeight = parentSize ? Math.round(row.area / parentSize) : 0;
  if (isFlush || rowHeight > parentRect.height) {
    rowHeight = parentRect.height;
  }
  var curX = parentRect.x;
  var child;
  for (var _i = 0, len = row.length; _i < len; _i++) {
    child = row[_i];
    child.x = curX;
    child.y = parentRect.y;
    child.height = rowHeight;
    child.width = Math.min(rowHeight ? Math.round(child.area / rowHeight) : 0, parentRect.x + parentRect.width - curX);
    curX += child.width;
  }
  // add the remain x to the last one of row
  child.width += parentRect.x + parentRect.width - curX;
  return _objectSpread(_objectSpread({}, parentRect), {}, {
    y: parentRect.y + rowHeight,
    height: parentRect.height - rowHeight
  });
};
var verticalPosition = (row, parentSize, parentRect, isFlush) => {
  var rowWidth = parentSize ? Math.round(row.area / parentSize) : 0;
  if (isFlush || rowWidth > parentRect.width) {
    rowWidth = parentRect.width;
  }
  var curY = parentRect.y;
  var child;
  for (var _i2 = 0, len = row.length; _i2 < len; _i2++) {
    child = row[_i2];
    child.x = parentRect.x;
    child.y = curY;
    child.width = rowWidth;
    child.height = Math.min(rowWidth ? Math.round(child.area / rowWidth) : 0, parentRect.y + parentRect.height - curY);
    curY += child.height;
  }
  if (child) {
    child.height += parentRect.y + parentRect.height - curY;
  }
  return _objectSpread(_objectSpread({}, parentRect), {}, {
    x: parentRect.x + rowWidth,
    width: parentRect.width - rowWidth
  });
};
var position = (row, parentSize, parentRect, isFlush) => {
  if (parentSize === parentRect.width) {
    return horizontalPosition(row, parentSize, parentRect, isFlush);
  }
  return verticalPosition(row, parentSize, parentRect, isFlush);
};

// Recursively arranges the specified node's children into squarified rows.
var squarify = (node, aspectRatio) => {
  var {
    children
  } = node;
  if (children && children.length) {
    var rect = filterRect(node);
    // maybe a bug
    var row = [];
    var best = Infinity; // the best row score so far
    var child, score; // the current row score
    var size = Math.min(rect.width, rect.height); // initial orientation
    var scaleChildren = getAreaOfChildren(children, rect.width * rect.height / node[NODE_VALUE_KEY]);
    var tempChildren = scaleChildren.slice();
    row.area = 0;
    while (tempChildren.length > 0) {
      // row first
      // eslint-disable-next-line prefer-destructuring
      row.push(child = tempChildren[0]);
      row.area += child.area;
      score = getWorstScore(row, size, aspectRatio);
      if (score <= best) {
        // continue with this orientation
        tempChildren.shift();
        best = score;
      } else {
        // abort, and try a different orientation
        row.area -= row.pop().area;
        rect = position(row, size, rect, false);
        size = Math.min(rect.width, rect.height);
        row.length = row.area = 0;
        best = Infinity;
      }
    }
    if (row.length) {
      rect = position(row, size, rect, true);
      row.length = row.area = 0;
    }
    return _objectSpread(_objectSpread({}, node), {}, {
      children: scaleChildren.map(c => squarify(c, aspectRatio))
    });
  }
  return node;
};
var defaultState = {
  isTooltipActive: false,
  isAnimationFinished: false,
  activeNode: null,
  formatRoot: null,
  currentRoot: null,
  nestIndex: []
};
class Treemap extends _react.PureComponent {
  constructor() {
    super(...arguments);
    _defineProperty(this, "state", _objectSpread({}, defaultState));
    _defineProperty(this, "handleAnimationEnd", () => {
      var {
        onAnimationEnd
      } = this.props;
      this.setState({
        isAnimationFinished: true
      });
      if ((0, _isFunction.default)(onAnimationEnd)) {
        onAnimationEnd();
      }
    });
    _defineProperty(this, "handleAnimationStart", () => {
      var {
        onAnimationStart
      } = this.props;
      this.setState({
        isAnimationFinished: false
      });
      if ((0, _isFunction.default)(onAnimationStart)) {
        onAnimationStart();
      }
    });
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.data !== prevState.prevData || nextProps.type !== prevState.prevType || nextProps.width !== prevState.prevWidth || nextProps.height !== prevState.prevHeight || nextProps.dataKey !== prevState.prevDataKey || nextProps.aspectRatio !== prevState.prevAspectRatio) {
      var root = computeNode({
        depth: 0,
        node: {
          children: nextProps.data,
          x: 0,
          y: 0,
          width: nextProps.width,
          height: nextProps.height
        },
        index: 0,
        dataKey: nextProps.dataKey
      });
      var formatRoot = squarify(root, nextProps.aspectRatio);
      return _objectSpread(_objectSpread({}, prevState), {}, {
        formatRoot,
        currentRoot: root,
        nestIndex: [root],
        prevAspectRatio: nextProps.aspectRatio,
        prevData: nextProps.data,
        prevWidth: nextProps.width,
        prevHeight: nextProps.height,
        prevDataKey: nextProps.dataKey,
        prevType: nextProps.type
      });
    }
    return null;
  }
  handleMouseEnter(node, e) {
    e.persist();
    var {
      onMouseEnter,
      children
    } = this.props;
    var tooltipItem = (0, _ReactUtils.findChildByType)(children, _Tooltip.Tooltip);
    if (tooltipItem) {
      this.setState({
        isTooltipActive: true,
        activeNode: node
      }, () => {
        if (onMouseEnter) {
          onMouseEnter(node, e);
        }
      });
    } else if (onMouseEnter) {
      onMouseEnter(node, e);
    }
  }
  handleMouseLeave(node, e) {
    e.persist();
    var {
      onMouseLeave,
      children
    } = this.props;
    var tooltipItem = (0, _ReactUtils.findChildByType)(children, _Tooltip.Tooltip);
    if (tooltipItem) {
      this.setState({
        isTooltipActive: false,
        activeNode: null
      }, () => {
        if (onMouseLeave) {
          onMouseLeave(node, e);
        }
      });
    } else if (onMouseLeave) {
      onMouseLeave(node, e);
    }
  }
  handleClick(node) {
    var {
      onClick,
      type
    } = this.props;
    if (type === 'nest' && node.children) {
      var {
        width,
        height,
        dataKey,
        aspectRatio
      } = this.props;
      var root = computeNode({
        depth: 0,
        node: _objectSpread(_objectSpread({}, node), {}, {
          x: 0,
          y: 0,
          width,
          height
        }),
        index: 0,
        dataKey
      });
      var formatRoot = squarify(root, aspectRatio);
      var {
        nestIndex
      } = this.state;
      nestIndex.push(node);
      this.setState({
        formatRoot,
        currentRoot: root,
        nestIndex
      });
    }
    if (onClick) {
      onClick(node);
    }
  }
  handleNestIndex(node, i) {
    var {
      nestIndex
    } = this.state;
    var {
      width,
      height,
      dataKey,
      aspectRatio
    } = this.props;
    var root = computeNode({
      depth: 0,
      node: _objectSpread(_objectSpread({}, node), {}, {
        x: 0,
        y: 0,
        width,
        height
      }),
      index: 0,
      dataKey
    });
    var formatRoot = squarify(root, aspectRatio);
    nestIndex = nestIndex.slice(0, i + 1);
    this.setState({
      formatRoot,
      currentRoot: node,
      nestIndex
    });
  }
  renderItem(content, nodeProps, isLeaf) {
    var {
      isAnimationActive,
      animationBegin,
      animationDuration,
      animationEasing,
      isUpdateAnimationActive,
      type,
      animationId,
      colorPanel
    } = this.props;
    var {
      isAnimationFinished
    } = this.state;
    var {
      width,
      height,
      x,
      y,
      depth
    } = nodeProps;
    var translateX = parseInt("".concat((Math.random() * 2 - 1) * width), 10);
    var event = {};
    if (isLeaf || type === 'nest') {
      event = {
        onMouseEnter: this.handleMouseEnter.bind(this, nodeProps),
        onMouseLeave: this.handleMouseLeave.bind(this, nodeProps),
        onClick: this.handleClick.bind(this, nodeProps)
      };
    }
    if (!isAnimationActive) {
      return /*#__PURE__*/_react.default.createElement(_Layer.Layer, event, this.constructor.renderContentItem(content, _objectSpread(_objectSpread({}, nodeProps), {}, {
        isAnimationActive: false,
        isUpdateAnimationActive: false,
        width,
        height,
        x,
        y
      }), type, colorPanel));
    }
    return /*#__PURE__*/_react.default.createElement(_reactSmooth.default, {
      begin: animationBegin,
      duration: animationDuration,
      isActive: isAnimationActive,
      easing: animationEasing,
      key: "treemap-".concat(animationId),
      from: {
        x,
        y,
        width,
        height
      },
      to: {
        x,
        y,
        width,
        height
      },
      onAnimationStart: this.handleAnimationStart,
      onAnimationEnd: this.handleAnimationEnd
    }, _ref2 => {
      var {
        x: currX,
        y: currY,
        width: currWidth,
        height: currHeight
      } = _ref2;
      return /*#__PURE__*/_react.default.createElement(_reactSmooth.default, {
        from: "translate(".concat(translateX, "px, ").concat(translateX, "px)"),
        to: "translate(0, 0)",
        attributeName: "transform",
        begin: animationBegin,
        easing: animationEasing,
        isActive: isAnimationActive,
        duration: animationDuration
      }, /*#__PURE__*/_react.default.createElement(_Layer.Layer, event, (() => {
        // when animation Duration , only render depth=1 nodes
        if (depth > 2 && !isAnimationFinished) {
          return null;
        }
        return this.constructor.renderContentItem(content, _objectSpread(_objectSpread({}, nodeProps), {}, {
          isAnimationActive,
          isUpdateAnimationActive: !isUpdateAnimationActive,
          width: currWidth,
          height: currHeight,
          x: currX,
          y: currY
        }), type, colorPanel);
      })()));
    });
  }
  static renderContentItem(content, nodeProps, type, colorPanel) {
    if ( /*#__PURE__*/_react.default.isValidElement(content)) {
      return /*#__PURE__*/_react.default.cloneElement(content, nodeProps);
    }
    if ((0, _isFunction.default)(content)) {
      return content(nodeProps);
    }
    // optimize default shape
    var {
      x,
      y,
      width,
      height,
      index
    } = nodeProps;
    var arrow = null;
    if (width > 10 && height > 10 && nodeProps.children && type === 'nest') {
      arrow = /*#__PURE__*/_react.default.createElement(_Polygon.Polygon, {
        points: [{
          x: x + 2,
          y: y + height / 2
        }, {
          x: x + 6,
          y: y + height / 2 + 3
        }, {
          x: x + 2,
          y: y + height / 2 + 6
        }]
      });
    }
    var text = null;
    var nameSize = (0, _DOMUtils.getStringSize)(nodeProps.name);
    if (width > 20 && height > 20 && nameSize.width < width && nameSize.height < height) {
      text = /*#__PURE__*/_react.default.createElement("text", {
        x: x + 8,
        y: y + height / 2 + 7,
        fontSize: 14
      }, nodeProps.name);
    }
    var colors = colorPanel || _Constants.COLOR_PANEL;
    return /*#__PURE__*/_react.default.createElement("g", null, /*#__PURE__*/_react.default.createElement(_Rectangle.Rectangle, _extends({
      fill: nodeProps.depth < 2 ? colors[index % colors.length] : 'rgba(255,255,255,0)',
      stroke: "#fff"
    }, (0, _omit.default)(nodeProps, 'children'), {
      role: "img"
    })), arrow, text);
  }
  renderNode(root, node) {
    var {
      content,
      type
    } = this.props;
    var nodeProps = _objectSpread(_objectSpread(_objectSpread({}, (0, _ReactUtils.filterProps)(this.props, false)), node), {}, {
      root
    });
    var isLeaf = !node.children || !node.children.length;
    var {
      currentRoot
    } = this.state;
    var isCurrentRootChild = (currentRoot.children || []).filter(item => item.depth === node.depth && item.name === node.name);
    if (!isCurrentRootChild.length && root.depth && type === 'nest') {
      return null;
    }
    return /*#__PURE__*/_react.default.createElement(_Layer.Layer, {
      key: "recharts-treemap-node-".concat(nodeProps.x, "-").concat(nodeProps.y, "-").concat(nodeProps.name),
      className: "recharts-treemap-depth-".concat(node.depth)
    }, this.renderItem(content, nodeProps, isLeaf), node.children && node.children.length ? node.children.map(child => this.renderNode(node, child)) : null);
  }
  renderAllNodes() {
    var {
      formatRoot
    } = this.state;
    if (!formatRoot) {
      return null;
    }
    return this.renderNode(formatRoot, formatRoot);
  }

  // render nest treemap
  renderNestIndex() {
    var {
      nameKey,
      nestIndexContent
    } = this.props;
    var {
      nestIndex
    } = this.state;
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "recharts-treemap-nest-index-wrapper",
      style: {
        marginTop: '8px',
        textAlign: 'center'
      }
    }, nestIndex.map((item, i) => {
      // TODO need to verify nameKey type
      var name = (0, _get.default)(item, nameKey, 'root');
      var content = null;
      if ( /*#__PURE__*/_react.default.isValidElement(nestIndexContent)) {
        content = /*#__PURE__*/_react.default.cloneElement(nestIndexContent, item, i);
      }
      if ((0, _isFunction.default)(nestIndexContent)) {
        content = nestIndexContent(item, i);
      } else {
        content = name;
      }
      return (
        /*#__PURE__*/
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
        _react.default.createElement("div", {
          onClick: this.handleNestIndex.bind(this, item, i),
          key: "nest-index-".concat((0, _DataUtils.uniqueId)()),
          className: "recharts-treemap-nest-index-box",
          style: {
            cursor: 'pointer',
            display: 'inline-block',
            padding: '0 7px',
            background: '#000',
            color: '#fff',
            marginRight: '3px'
          }
        }, content)
      );
    }));
  }
  getTooltipContext() {
    var {
      nameKey
    } = this.props;
    var {
      isTooltipActive,
      activeNode
    } = this.state;
    var coordinate = activeNode ? {
      x: activeNode.x + activeNode.width / 2,
      y: activeNode.y + activeNode.height / 2
    } : null;
    var payload = isTooltipActive && activeNode ? [{
      payload: activeNode,
      name: (0, _ChartUtils.getValueByDataKey)(activeNode, nameKey, ''),
      value: (0, _ChartUtils.getValueByDataKey)(activeNode, NODE_VALUE_KEY)
    }] : [];
    return {
      active: isTooltipActive,
      coordinate,
      label: '',
      payload,
      index: 0
    };
  }
  render() {
    if (!(0, _ReactUtils.validateWidthHeight)(this)) {
      return null;
    }
    var _this$props = this.props,
      {
        width,
        height,
        className,
        style,
        children,
        type
      } = _this$props,
      others = _objectWithoutProperties(_this$props, _excluded);
    var attrs = (0, _ReactUtils.filterProps)(others, false);
    var viewBox = {
      x: 0,
      y: 0,
      width,
      height
    };
    return /*#__PURE__*/_react.default.createElement(_chartLayoutContext.ViewBoxContext.Provider, {
      value: viewBox
    }, /*#__PURE__*/_react.default.createElement(_tooltipContext.TooltipContextProvider, {
      value: this.getTooltipContext()
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: (0, _clsx.default)('recharts-wrapper', className),
      style: _objectSpread(_objectSpread({}, style), {}, {
        position: 'relative',
        cursor: 'default',
        width,
        height
      }),
      role: "region"
    }, /*#__PURE__*/_react.default.createElement(_Surface.Surface, _extends({}, attrs, {
      width: width,
      height: type === 'nest' ? height - 30 : height
    }), this.renderAllNodes(), children), type === 'nest' && this.renderNestIndex())));
  }
}
exports.Treemap = Treemap;
_defineProperty(Treemap, "displayName", 'Treemap');
_defineProperty(Treemap, "defaultProps", {
  aspectRatio: 0.5 * (1 + Math.sqrt(5)),
  dataKey: 'value',
  type: 'flat',
  isAnimationActive: !_Global.Global.isSsr,
  isUpdateAnimationActive: !_Global.Global.isSsr,
  animationBegin: 0,
  animationDuration: 1500,
  animationEasing: 'linear'
});