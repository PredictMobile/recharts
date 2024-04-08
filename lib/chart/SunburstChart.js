"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SunburstChart = void 0;
var _react = _interopRequireWildcard(require("react"));
var _d3Scale = require("victory-vendor/d3-scale");
var _clsx = _interopRequireDefault(require("clsx"));
var _Surface = require("../container/Surface");
var _Layer = require("../container/Layer");
var _Sector = require("../shape/Sector");
var _Text = require("../component/Text");
var _PolarUtils = require("../util/PolarUtils");
var _chartLayoutContext = require("../context/chartLayoutContext");
var _tooltipContext = require("../context/tooltipContext");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
var defaultTextProps = {
  fontWeight: 'bold',
  paintOrder: 'stroke fill',
  fontSize: '.75rem',
  stroke: '#FFF',
  fill: 'black',
  pointerEvents: 'none'
};
function getMaxDepthOf(node) {
  if (!node.children || node.children.length === 0) return 1;

  // Calculate depth for each child and find the maximum
  var childDepths = node.children.map(d => getMaxDepthOf(d));
  return 1 + Math.max(...childDepths);
}
var SunburstChart = _ref => {
  var {
    className,
    data,
    children,
    width,
    height,
    padding = 2,
    dataKey = 'value',
    ringPadding = 2,
    innerRadius = 50,
    fill = '#333',
    stroke = '#FFF',
    textOptions = defaultTextProps,
    outerRadius = Math.min(width, height) / 2,
    cx = width / 2,
    cy = height / 2,
    startAngle = 0,
    endAngle = 360,
    onClick,
    onMouseEnter,
    onMouseLeave
  } = _ref;
  var [isTooltipActive, setIsTooltipActive] = (0, _react.useState)(false);
  var [activeNode, setActiveNode] = (0, _react.useState)(null);
  var rScale = (0, _d3Scale.scaleLinear)([0, data[dataKey]], [0, endAngle]);
  var treeDepth = getMaxDepthOf(data);
  var thickness = (outerRadius - innerRadius) / treeDepth;
  var sectors = [];
  var positions = new Map([]);

  // event handlers
  function handleMouseEnter(node, e) {
    if (onMouseEnter) onMouseEnter(node, e);
    setActiveNode(node);
    setIsTooltipActive(true);
  }
  function handleMouseLeave(node, e) {
    if (onMouseLeave) onMouseLeave(node, e);
    setActiveNode(null);
    setIsTooltipActive(false);
  }
  function handleClick(node) {
    if (onClick) onClick(node);
  }

  // recursively add nodes for each data point and its children
  function drawArcs(childNodes, options) {
    var {
      radius,
      innerR,
      initialAngle,
      childColor
    } = options;
    var currentAngle = initialAngle;
    if (!childNodes) return; // base case: no children of this node

    childNodes.forEach(d => {
      var _ref2, _d$fill;
      var arcLength = rScale(d[dataKey]);
      var start = currentAngle;
      // color priority - if there's a color on the individual point use that, otherwise use parent color or default
      var fillColor = (_ref2 = (_d$fill = d === null || d === void 0 ? void 0 : d.fill) !== null && _d$fill !== void 0 ? _d$fill : childColor) !== null && _ref2 !== void 0 ? _ref2 : fill;
      var {
        x: textX,
        y: textY
      } = (0, _PolarUtils.polarToCartesian)(0, 0, innerR + radius / 2, -(start + arcLength - arcLength / 2));
      currentAngle += arcLength;
      sectors.push( /*#__PURE__*/_react.default.createElement("g", {
        "aria-label": d.name,
        tabIndex: 0
      }, /*#__PURE__*/_react.default.createElement(_Sector.Sector, {
        onClick: () => handleClick(d),
        onMouseEnter: e => handleMouseEnter(d, e),
        onMouseLeave: e => handleMouseLeave(d, e),
        fill: fillColor,
        stroke: stroke,
        strokeWidth: padding,
        startAngle: start,
        endAngle: start + arcLength,
        innerRadius: innerR,
        outerRadius: innerR + radius,
        cx: cx,
        cy: cy
      }), /*#__PURE__*/_react.default.createElement(_Text.Text, _extends({}, textOptions, {
        alignmentBaseline: "middle",
        textAnchor: "middle",
        x: textX + cx,
        y: cy - textY
      }), d[dataKey])));
      var {
        x: tooltipX,
        y: tooltipY
      } = (0, _PolarUtils.polarToCartesian)(cx, cy, innerR + radius / 2, start);
      positions.set(d.name, {
        x: tooltipX,
        y: tooltipY
      });
      return drawArcs(d.children, {
        radius,
        innerR: innerR + radius + ringPadding,
        initialAngle: start,
        childColor: fillColor
      });
    });
  }
  drawArcs(data.children, {
    radius: thickness,
    innerR: innerRadius,
    initialAngle: startAngle
  });
  var layerClass = (0, _clsx.default)('recharts-sunburst', className);
  function getTooltipContext() {
    if (activeNode == null) {
      return _tooltipContext.doNotDisplayTooltip;
    }
    return {
      // @ts-expect-error positions map does not match what Tooltip is expecting
      coordinate: positions.get(activeNode.name),
      payload: [activeNode],
      active: isTooltipActive
    };
  }
  var viewBox = {
    x: 0,
    y: 0,
    width,
    height
  };
  return /*#__PURE__*/_react.default.createElement(_chartLayoutContext.ViewBoxContext.Provider, {
    value: viewBox
  }, /*#__PURE__*/_react.default.createElement(_tooltipContext.TooltipContextProvider, {
    value: getTooltipContext()
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: (0, _clsx.default)('recharts-wrapper', className),
    style: {
      position: 'relative',
      width,
      height
    },
    role: "region"
  }, /*#__PURE__*/_react.default.createElement(_Surface.Surface, {
    width: width,
    height: height
  }, /*#__PURE__*/_react.default.createElement(_Layer.Layer, {
    className: layerClass
  }, sectors), children))));
};
exports.SunburstChart = SunburstChart;