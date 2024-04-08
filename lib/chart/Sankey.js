"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Sankey = void 0;
var _react = _interopRequireWildcard(require("react"));
var _maxBy = _interopRequireDefault(require("lodash/maxBy"));
var _min = _interopRequireDefault(require("lodash/min"));
var _get = _interopRequireDefault(require("lodash/get"));
var _sumBy = _interopRequireDefault(require("lodash/sumBy"));
var _isFunction = _interopRequireDefault(require("lodash/isFunction"));
var _clsx = _interopRequireDefault(require("clsx"));
var _Surface = require("../container/Surface");
var _Layer = require("../container/Layer");
var _Tooltip = require("../component/Tooltip");
var _Rectangle = require("../shape/Rectangle");
var _ShallowEqual = require("../util/ShallowEqual");
var _ReactUtils = require("../util/ReactUtils");
var _ChartUtils = require("../util/ChartUtils");
var _chartLayoutContext = require("../context/chartLayoutContext");
var _tooltipContext = require("../context/tooltipContext");
var _excluded = ["sourceX", "sourceY", "sourceControlX", "targetX", "targetY", "targetControlX", "linkWidth"],
  _excluded2 = ["width", "height", "className", "style", "children"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * @file TreemapChart
 */
var defaultCoordinateOfTooltip = {
  x: 0,
  y: 0
};
var interpolationGenerator = (a, b) => {
  var ka = +a;
  var kb = b - ka;
  return t => ka + kb * t;
};
var centerY = node => node.y + node.dy / 2;
var getValue = entry => entry && entry.value || 0;
var getSumOfIds = (links, ids) => ids.reduce((result, id) => result + getValue(links[id]), 0);
var getSumWithWeightedSource = (tree, links, ids) => ids.reduce((result, id) => {
  var link = links[id];
  var sourceNode = tree[link.source];
  return result + centerY(sourceNode) * getValue(links[id]);
}, 0);
var getSumWithWeightedTarget = (tree, links, ids) => ids.reduce((result, id) => {
  var link = links[id];
  var targetNode = tree[link.target];
  return result + centerY(targetNode) * getValue(links[id]);
}, 0);
var ascendingY = (a, b) => a.y - b.y;
var searchTargetsAndSources = (links, id) => {
  var sourceNodes = [];
  var sourceLinks = [];
  var targetNodes = [];
  var targetLinks = [];
  for (var i = 0, len = links.length; i < len; i++) {
    var link = links[i];
    if (link.source === id) {
      targetNodes.push(link.target);
      targetLinks.push(i);
    }
    if (link.target === id) {
      sourceNodes.push(link.source);
      sourceLinks.push(i);
    }
  }
  return {
    sourceNodes,
    sourceLinks,
    targetLinks,
    targetNodes
  };
};
var updateDepthOfTargets = (tree, curNode) => {
  var {
    targetNodes
  } = curNode;
  for (var i = 0, len = targetNodes.length; i < len; i++) {
    var target = tree[targetNodes[i]];
    if (target) {
      target.depth = Math.max(curNode.depth + 1, target.depth);
      updateDepthOfTargets(tree, target);
    }
  }
};
var getNodesTree = (_ref, width, nodeWidth) => {
  var {
    nodes,
    links
  } = _ref;
  var tree = nodes.map((entry, index) => {
    var result = searchTargetsAndSources(links, index);
    return _objectSpread(_objectSpread(_objectSpread({}, entry), result), {}, {
      value: Math.max(getSumOfIds(links, result.sourceLinks), getSumOfIds(links, result.targetLinks)),
      depth: 0
    });
  });
  for (var i = 0, len = tree.length; i < len; i++) {
    var node = tree[i];
    if (!node.sourceNodes.length) {
      updateDepthOfTargets(tree, node);
    }
  }
  var maxDepth = (0, _maxBy.default)(tree, entry => entry.depth).depth;
  if (maxDepth >= 1) {
    var childWidth = (width - nodeWidth) / maxDepth;
    for (var _i = 0, _len = tree.length; _i < _len; _i++) {
      var _node = tree[_i];
      if (!_node.targetNodes.length) {
        _node.depth = maxDepth;
      }
      _node.x = _node.depth * childWidth;
      _node.dx = nodeWidth;
    }
  }
  return {
    tree,
    maxDepth
  };
};
var getDepthTree = tree => {
  var result = [];
  for (var i = 0, len = tree.length; i < len; i++) {
    var node = tree[i];
    if (!result[node.depth]) {
      result[node.depth] = [];
    }
    result[node.depth].push(node);
  }
  return result;
};
var updateYOfTree = (depthTree, height, nodePadding, links) => {
  var yRatio = (0, _min.default)(depthTree.map(nodes => (height - (nodes.length - 1) * nodePadding) / (0, _sumBy.default)(nodes, getValue)));
  for (var d = 0, maxDepth = depthTree.length; d < maxDepth; d++) {
    for (var i = 0, len = depthTree[d].length; i < len; i++) {
      var node = depthTree[d][i];
      node.y = i;
      node.dy = node.value * yRatio;
    }
  }
  return links.map(link => _objectSpread(_objectSpread({}, link), {}, {
    dy: getValue(link) * yRatio
  }));
};
var resolveCollisions = function resolveCollisions(depthTree, height, nodePadding) {
  var sort = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
  for (var i = 0, len = depthTree.length; i < len; i++) {
    var nodes = depthTree[i];
    var n = nodes.length;

    // Sort by the value of y
    if (sort) {
      nodes.sort(ascendingY);
    }
    var y0 = 0;
    for (var j = 0; j < n; j++) {
      var node = nodes[j];
      var dy = y0 - node.y;
      if (dy > 0) {
        node.y += dy;
      }
      y0 = node.y + node.dy + nodePadding;
    }
    y0 = height + nodePadding;
    for (var _j = n - 1; _j >= 0; _j--) {
      var _node2 = nodes[_j];
      var _dy = _node2.y + _node2.dy + nodePadding - y0;
      if (_dy > 0) {
        _node2.y -= _dy;
        y0 = _node2.y;
      } else {
        break;
      }
    }
  }
};
var relaxLeftToRight = (tree, depthTree, links, alpha) => {
  for (var i = 0, maxDepth = depthTree.length; i < maxDepth; i++) {
    var nodes = depthTree[i];
    for (var j = 0, len = nodes.length; j < len; j++) {
      var node = nodes[j];
      if (node.sourceLinks.length) {
        var sourceSum = getSumOfIds(links, node.sourceLinks);
        var weightedSum = getSumWithWeightedSource(tree, links, node.sourceLinks);
        var y = weightedSum / sourceSum;
        node.y += (y - centerY(node)) * alpha;
      }
    }
  }
};
var relaxRightToLeft = (tree, depthTree, links, alpha) => {
  for (var i = depthTree.length - 1; i >= 0; i--) {
    var nodes = depthTree[i];
    for (var j = 0, len = nodes.length; j < len; j++) {
      var node = nodes[j];
      if (node.targetLinks.length) {
        var targetSum = getSumOfIds(links, node.targetLinks);
        var weightedSum = getSumWithWeightedTarget(tree, links, node.targetLinks);
        var y = weightedSum / targetSum;
        node.y += (y - centerY(node)) * alpha;
      }
    }
  }
};
var updateYOfLinks = (tree, links) => {
  for (var i = 0, len = tree.length; i < len; i++) {
    var node = tree[i];
    var sy = 0;
    var ty = 0;
    node.targetLinks.sort((a, b) => tree[links[a].target].y - tree[links[b].target].y);
    node.sourceLinks.sort((a, b) => tree[links[a].source].y - tree[links[b].source].y);
    for (var j = 0, tLen = node.targetLinks.length; j < tLen; j++) {
      var link = links[node.targetLinks[j]];
      if (link) {
        link.sy = sy;
        sy += link.dy;
      }
    }
    for (var _j2 = 0, sLen = node.sourceLinks.length; _j2 < sLen; _j2++) {
      var _link = links[node.sourceLinks[_j2]];
      if (_link) {
        _link.ty = ty;
        ty += _link.dy;
      }
    }
  }
};
var computeData = _ref2 => {
  var {
    data,
    width,
    height,
    iterations,
    nodeWidth,
    nodePadding,
    sort
  } = _ref2;
  var {
    links
  } = data;
  var {
    tree
  } = getNodesTree(data, width, nodeWidth);
  var depthTree = getDepthTree(tree);
  var newLinks = updateYOfTree(depthTree, height, nodePadding, links);
  resolveCollisions(depthTree, height, nodePadding, sort);
  var alpha = 1;
  for (var i = 1; i <= iterations; i++) {
    relaxRightToLeft(tree, depthTree, newLinks, alpha *= 0.99);
    resolveCollisions(depthTree, height, nodePadding, sort);
    relaxLeftToRight(tree, depthTree, newLinks, alpha);
    resolveCollisions(depthTree, height, nodePadding, sort);
  }
  updateYOfLinks(tree, newLinks);
  return {
    nodes: tree,
    links: newLinks
  };
};
var getCoordinateOfTooltip = (el, type) => {
  if (type === 'node') {
    return {
      x: el.x + el.width / 2,
      y: el.y + el.height / 2
    };
  }
  return {
    x: (el.sourceX + el.targetX) / 2,
    y: (el.sourceY + el.targetY) / 2
  };
};
var getPayloadOfTooltip = (el, type, nameKey) => {
  var {
    payload
  } = el;
  if (type === 'node') {
    return [{
      payload: el,
      name: (0, _ChartUtils.getValueByDataKey)(payload, nameKey, ''),
      value: (0, _ChartUtils.getValueByDataKey)(payload, 'value')
    }];
  }
  if (payload.source && payload.target) {
    var sourceName = (0, _ChartUtils.getValueByDataKey)(payload.source, nameKey, '');
    var targetName = (0, _ChartUtils.getValueByDataKey)(payload.target, nameKey, '');
    return [{
      payload: el,
      name: "".concat(sourceName, " - ").concat(targetName),
      value: (0, _ChartUtils.getValueByDataKey)(payload, 'value')
    }];
  }
  return [];
};
class Sankey extends _react.PureComponent {
  constructor() {
    super(...arguments);
    _defineProperty(this, "state", {
      activeElement: null,
      activeElementType: null,
      isTooltipActive: false,
      nodes: [],
      links: []
    });
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    var {
      data,
      width,
      height,
      margin,
      iterations,
      nodeWidth,
      nodePadding,
      sort
    } = nextProps;
    if (data !== prevState.prevData || width !== prevState.prevWidth || height !== prevState.prevHeight || !(0, _ShallowEqual.shallowEqual)(margin, prevState.prevMargin) || iterations !== prevState.prevIterations || nodeWidth !== prevState.prevNodeWidth || nodePadding !== prevState.prevNodePadding || sort !== prevState.sort) {
      var contentWidth = width - (margin && margin.left || 0) - (margin && margin.right || 0);
      var contentHeight = height - (margin && margin.top || 0) - (margin && margin.bottom || 0);
      var {
        links,
        nodes
      } = computeData({
        data,
        width: contentWidth,
        height: contentHeight,
        iterations,
        nodeWidth,
        nodePadding,
        sort
      });
      return _objectSpread(_objectSpread({}, prevState), {}, {
        nodes,
        links,
        prevData: data,
        prevWidth: iterations,
        prevHeight: height,
        prevMargin: margin,
        prevNodePadding: nodePadding,
        prevNodeWidth: nodeWidth,
        prevIterations: iterations,
        prevSort: sort
      });
    }
    return null;
  }
  handleMouseEnter(el, type, e) {
    var {
      onMouseEnter,
      children
    } = this.props;
    var tooltipItem = (0, _ReactUtils.findChildByType)(children, _Tooltip.Tooltip);
    if (tooltipItem) {
      this.setState(prev => {
        if (tooltipItem.props.trigger === 'hover') {
          return _objectSpread(_objectSpread({}, prev), {}, {
            activeElement: el,
            activeElementType: type,
            isTooltipActive: true
          });
        }
        return prev;
      }, () => {
        if (onMouseEnter) {
          onMouseEnter(el, type, e);
        }
      });
    } else if (onMouseEnter) {
      onMouseEnter(el, type, e);
    }
  }
  handleMouseLeave(el, type, e) {
    var {
      onMouseLeave,
      children
    } = this.props;
    var tooltipItem = (0, _ReactUtils.findChildByType)(children, _Tooltip.Tooltip);
    if (tooltipItem) {
      this.setState(prev => {
        if (tooltipItem.props.trigger === 'hover') {
          return _objectSpread(_objectSpread({}, prev), {}, {
            activeElement: undefined,
            activeElementType: undefined,
            isTooltipActive: false
          });
        }
        return prev;
      }, () => {
        if (onMouseLeave) {
          onMouseLeave(el, type, e);
        }
      });
    } else if (onMouseLeave) {
      onMouseLeave(el, type, e);
    }
  }
  handleClick(el, type, e) {
    var {
      onClick,
      children
    } = this.props;
    var tooltipItem = (0, _ReactUtils.findChildByType)(children, _Tooltip.Tooltip);
    if (tooltipItem && tooltipItem.props.trigger === 'click') {
      if (this.state.isTooltipActive) {
        this.setState(prev => {
          return _objectSpread(_objectSpread({}, prev), {}, {
            activeElement: undefined,
            activeElementType: undefined,
            isTooltipActive: false
          });
        });
      } else {
        this.setState(prev => {
          return _objectSpread(_objectSpread({}, prev), {}, {
            activeElement: el,
            activeElementType: type,
            isTooltipActive: true
          });
        });
      }
    }
    if (onClick) onClick(el, type, e);
  }
  static renderLinkItem(option, props) {
    if ( /*#__PURE__*/_react.default.isValidElement(option)) {
      return /*#__PURE__*/_react.default.cloneElement(option, props);
    }
    if ((0, _isFunction.default)(option)) {
      return option(props);
    }
    var {
        sourceX,
        sourceY,
        sourceControlX,
        targetX,
        targetY,
        targetControlX,
        linkWidth
      } = props,
      others = _objectWithoutProperties(props, _excluded);
    return /*#__PURE__*/_react.default.createElement("path", _extends({
      className: "recharts-sankey-link",
      d: "\n          M".concat(sourceX, ",").concat(sourceY, "\n          C").concat(sourceControlX, ",").concat(sourceY, " ").concat(targetControlX, ",").concat(targetY, " ").concat(targetX, ",").concat(targetY, "\n        "),
      fill: "none",
      stroke: "#333",
      strokeWidth: linkWidth,
      strokeOpacity: "0.2"
    }, (0, _ReactUtils.filterProps)(others, false)));
  }
  renderLinks(links, nodes) {
    var {
      linkCurvature,
      link: linkContent,
      margin
    } = this.props;
    var top = (0, _get.default)(margin, 'top') || 0;
    var left = (0, _get.default)(margin, 'left') || 0;
    return /*#__PURE__*/_react.default.createElement(_Layer.Layer, {
      className: "recharts-sankey-links",
      key: "recharts-sankey-links"
    }, links.map((link, i) => {
      var {
        sy: sourceRelativeY,
        ty: targetRelativeY,
        dy: linkWidth
      } = link;
      var source = nodes[link.source];
      var target = nodes[link.target];
      var sourceX = source.x + source.dx + left;
      var targetX = target.x + left;
      var interpolationFunc = interpolationGenerator(sourceX, targetX);
      var sourceControlX = interpolationFunc(linkCurvature);
      var targetControlX = interpolationFunc(1 - linkCurvature);
      var sourceY = source.y + sourceRelativeY + linkWidth / 2 + top;
      var targetY = target.y + targetRelativeY + linkWidth / 2 + top;
      var linkProps = _objectSpread({
        sourceX,
        targetX,
        sourceY,
        targetY,
        sourceControlX,
        targetControlX,
        sourceRelativeY,
        targetRelativeY,
        linkWidth,
        index: i,
        payload: _objectSpread(_objectSpread({}, link), {}, {
          source,
          target
        })
      }, (0, _ReactUtils.filterProps)(linkContent, false));
      var events = {
        onMouseEnter: this.handleMouseEnter.bind(this, linkProps, 'link'),
        onMouseLeave: this.handleMouseLeave.bind(this, linkProps, 'link'),
        onClick: this.handleClick.bind(this, linkProps, 'link')
      };
      return /*#__PURE__*/_react.default.createElement(_Layer.Layer, _extends({
        key: "link-".concat(link.source, "-").concat(link.target, "-").concat(link.value)
      }, events), this.constructor.renderLinkItem(linkContent, linkProps));
    }));
  }
  static renderNodeItem(option, props) {
    if ( /*#__PURE__*/_react.default.isValidElement(option)) {
      return /*#__PURE__*/_react.default.cloneElement(option, props);
    }
    if ((0, _isFunction.default)(option)) {
      return option(props);
    }
    return /*#__PURE__*/_react.default.createElement(_Rectangle.Rectangle, _extends({
      className: "recharts-sankey-node",
      fill: "#0088fe",
      fillOpacity: "0.8"
    }, (0, _ReactUtils.filterProps)(props, false), {
      role: "img"
    }));
  }
  renderNodes(nodes) {
    var {
      node: nodeContent,
      margin
    } = this.props;
    var top = (0, _get.default)(margin, 'top') || 0;
    var left = (0, _get.default)(margin, 'left') || 0;
    return /*#__PURE__*/_react.default.createElement(_Layer.Layer, {
      className: "recharts-sankey-nodes",
      key: "recharts-sankey-nodes"
    }, nodes.map((node, i) => {
      var {
        x,
        y,
        dx,
        dy
      } = node;
      var nodeProps = _objectSpread(_objectSpread({}, (0, _ReactUtils.filterProps)(nodeContent, false)), {}, {
        x: x + left,
        y: y + top,
        width: dx,
        height: dy,
        index: i,
        payload: node
      });
      var events = {
        onMouseEnter: this.handleMouseEnter.bind(this, nodeProps, 'node'),
        onMouseLeave: this.handleMouseLeave.bind(this, nodeProps, 'node'),
        onClick: this.handleClick.bind(this, nodeProps, 'node')
      };
      return /*#__PURE__*/_react.default.createElement(_Layer.Layer, _extends({
        key: "node-".concat(node.x, "-").concat(node.y, "-").concat(node.value)
      }, events), this.constructor.renderNodeItem(nodeContent, nodeProps));
    }));
  }
  getTooltipContext() {
    var {
      nameKey
    } = this.props;
    var {
      isTooltipActive,
      activeElement,
      activeElementType
    } = this.state;
    var coordinate = activeElement ? getCoordinateOfTooltip(activeElement, activeElementType) : defaultCoordinateOfTooltip;
    var payload = activeElement ? getPayloadOfTooltip(activeElement, activeElementType, nameKey) : [];
    return {
      label: '',
      payload,
      coordinate,
      active: isTooltipActive,
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
        children
      } = _this$props,
      others = _objectWithoutProperties(_this$props, _excluded2);
    var {
      links,
      nodes
    } = this.state;
    var viewBox = {
      x: 0,
      y: 0,
      width,
      height
    };
    var attrs = (0, _ReactUtils.filterProps)(others, false);
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
      height: height
    }), children, this.renderLinks(links, nodes), this.renderNodes(nodes)))));
  }
}
exports.Sankey = Sankey;
_defineProperty(Sankey, "displayName", 'Sankey');
_defineProperty(Sankey, "defaultProps", {
  nameKey: 'name',
  dataKey: 'value',
  nodePadding: 10,
  nodeWidth: 10,
  linkCurvature: 0.5,
  iterations: 32,
  margin: {
    top: 5,
    right: 5,
    bottom: 5,
    left: 5
  },
  sort: true
});