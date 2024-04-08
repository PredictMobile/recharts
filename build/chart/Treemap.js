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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Treemap = void 0;
const react_1 = __importStar(require("react"));
const isNaN_1 = __importDefault(require("lodash/isNaN"));
const isFunction_1 = __importDefault(require("lodash/isFunction"));
const omit_1 = __importDefault(require("lodash/omit"));
const get_1 = __importDefault(require("lodash/get"));
const clsx_1 = __importDefault(require("clsx"));
const react_smooth_1 = __importDefault(require("react-smooth"));
const Tooltip_1 = require("../component/Tooltip");
const Layer_1 = require("../container/Layer");
const Surface_1 = require("../container/Surface");
const Polygon_1 = require("../shape/Polygon");
const Rectangle_1 = require("../shape/Rectangle");
const ChartUtils_1 = require("../util/ChartUtils");
const Constants_1 = require("../util/Constants");
const DataUtils_1 = require("../util/DataUtils");
const DOMUtils_1 = require("../util/DOMUtils");
const Global_1 = require("../util/Global");
const ReactUtils_1 = require("../util/ReactUtils");
const chartLayoutContext_1 = require("../context/chartLayoutContext");
const tooltipContext_1 = require("../context/tooltipContext");
const NODE_VALUE_KEY = 'value';
const computeNode = ({ depth, node, index, dataKey, }) => {
    const { children } = node;
    const childDepth = depth + 1;
    const computedChildren = children && children.length
        ? children.map((child, i) => computeNode({ depth: childDepth, node: child, index: i, dataKey }))
        : null;
    let nodeValue;
    if (children && children.length) {
        nodeValue = computedChildren.reduce((result, child) => result + child[NODE_VALUE_KEY], 0);
    }
    else {
        nodeValue = (0, isNaN_1.default)(node[dataKey]) || node[dataKey] <= 0 ? 0 : node[dataKey];
    }
    return Object.assign(Object.assign({}, node), { children: computedChildren, [NODE_VALUE_KEY]: nodeValue, depth,
        index });
};
const filterRect = (node) => ({ x: node.x, y: node.y, width: node.width, height: node.height });
const getAreaOfChildren = (children, areaValueRatio) => {
    const ratio = areaValueRatio < 0 ? 0 : areaValueRatio;
    return children.map((child) => {
        const area = child[NODE_VALUE_KEY] * ratio;
        return Object.assign(Object.assign({}, child), { area: (0, isNaN_1.default)(area) || area <= 0 ? 0 : area });
    });
};
const getWorstScore = (row, parentSize, aspectRatio) => {
    const parentArea = parentSize * parentSize;
    const rowArea = row.area * row.area;
    const { min, max } = row.reduce((result, child) => ({
        min: Math.min(result.min, child.area),
        max: Math.max(result.max, child.area),
    }), { min: Infinity, max: 0 });
    return rowArea
        ? Math.max((parentArea * max * aspectRatio) / rowArea, rowArea / (parentArea * min * aspectRatio))
        : Infinity;
};
const horizontalPosition = (row, parentSize, parentRect, isFlush) => {
    let rowHeight = parentSize ? Math.round(row.area / parentSize) : 0;
    if (isFlush || rowHeight > parentRect.height) {
        rowHeight = parentRect.height;
    }
    let curX = parentRect.x;
    let child;
    for (let i = 0, len = row.length; i < len; i++) {
        child = row[i];
        child.x = curX;
        child.y = parentRect.y;
        child.height = rowHeight;
        child.width = Math.min(rowHeight ? Math.round(child.area / rowHeight) : 0, parentRect.x + parentRect.width - curX);
        curX += child.width;
    }
    child.width += parentRect.x + parentRect.width - curX;
    return Object.assign(Object.assign({}, parentRect), { y: parentRect.y + rowHeight, height: parentRect.height - rowHeight });
};
const verticalPosition = (row, parentSize, parentRect, isFlush) => {
    let rowWidth = parentSize ? Math.round(row.area / parentSize) : 0;
    if (isFlush || rowWidth > parentRect.width) {
        rowWidth = parentRect.width;
    }
    let curY = parentRect.y;
    let child;
    for (let i = 0, len = row.length; i < len; i++) {
        child = row[i];
        child.x = parentRect.x;
        child.y = curY;
        child.width = rowWidth;
        child.height = Math.min(rowWidth ? Math.round(child.area / rowWidth) : 0, parentRect.y + parentRect.height - curY);
        curY += child.height;
    }
    if (child) {
        child.height += parentRect.y + parentRect.height - curY;
    }
    return Object.assign(Object.assign({}, parentRect), { x: parentRect.x + rowWidth, width: parentRect.width - rowWidth });
};
const position = (row, parentSize, parentRect, isFlush) => {
    if (parentSize === parentRect.width) {
        return horizontalPosition(row, parentSize, parentRect, isFlush);
    }
    return verticalPosition(row, parentSize, parentRect, isFlush);
};
const squarify = (node, aspectRatio) => {
    const { children } = node;
    if (children && children.length) {
        let rect = filterRect(node);
        const row = [];
        let best = Infinity;
        let child, score;
        let size = Math.min(rect.width, rect.height);
        const scaleChildren = getAreaOfChildren(children, (rect.width * rect.height) / node[NODE_VALUE_KEY]);
        const tempChildren = scaleChildren.slice();
        row.area = 0;
        while (tempChildren.length > 0) {
            row.push((child = tempChildren[0]));
            row.area += child.area;
            score = getWorstScore(row, size, aspectRatio);
            if (score <= best) {
                tempChildren.shift();
                best = score;
            }
            else {
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
        return Object.assign(Object.assign({}, node), { children: scaleChildren.map(c => squarify(c, aspectRatio)) });
    }
    return node;
};
const defaultState = {
    isTooltipActive: false,
    isAnimationFinished: false,
    activeNode: null,
    formatRoot: null,
    currentRoot: null,
    nestIndex: [],
};
class Treemap extends react_1.PureComponent {
    constructor() {
        super(...arguments);
        this.state = Object.assign({}, defaultState);
        this.handleAnimationEnd = () => {
            const { onAnimationEnd } = this.props;
            this.setState({ isAnimationFinished: true });
            if ((0, isFunction_1.default)(onAnimationEnd)) {
                onAnimationEnd();
            }
        };
        this.handleAnimationStart = () => {
            const { onAnimationStart } = this.props;
            this.setState({ isAnimationFinished: false });
            if ((0, isFunction_1.default)(onAnimationStart)) {
                onAnimationStart();
            }
        };
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.data !== prevState.prevData ||
            nextProps.type !== prevState.prevType ||
            nextProps.width !== prevState.prevWidth ||
            nextProps.height !== prevState.prevHeight ||
            nextProps.dataKey !== prevState.prevDataKey ||
            nextProps.aspectRatio !== prevState.prevAspectRatio) {
            const root = computeNode({
                depth: 0,
                node: { children: nextProps.data, x: 0, y: 0, width: nextProps.width, height: nextProps.height },
                index: 0,
                dataKey: nextProps.dataKey,
            });
            const formatRoot = squarify(root, nextProps.aspectRatio);
            return Object.assign(Object.assign({}, prevState), { formatRoot, currentRoot: root, nestIndex: [root], prevAspectRatio: nextProps.aspectRatio, prevData: nextProps.data, prevWidth: nextProps.width, prevHeight: nextProps.height, prevDataKey: nextProps.dataKey, prevType: nextProps.type });
        }
        return null;
    }
    handleMouseEnter(node, e) {
        e.persist();
        const { onMouseEnter, children } = this.props;
        const tooltipItem = (0, ReactUtils_1.findChildByType)(children, Tooltip_1.Tooltip);
        if (tooltipItem) {
            this.setState({
                isTooltipActive: true,
                activeNode: node,
            }, () => {
                if (onMouseEnter) {
                    onMouseEnter(node, e);
                }
            });
        }
        else if (onMouseEnter) {
            onMouseEnter(node, e);
        }
    }
    handleMouseLeave(node, e) {
        e.persist();
        const { onMouseLeave, children } = this.props;
        const tooltipItem = (0, ReactUtils_1.findChildByType)(children, Tooltip_1.Tooltip);
        if (tooltipItem) {
            this.setState({
                isTooltipActive: false,
                activeNode: null,
            }, () => {
                if (onMouseLeave) {
                    onMouseLeave(node, e);
                }
            });
        }
        else if (onMouseLeave) {
            onMouseLeave(node, e);
        }
    }
    handleClick(node) {
        const { onClick, type } = this.props;
        if (type === 'nest' && node.children) {
            const { width, height, dataKey, aspectRatio } = this.props;
            const root = computeNode({
                depth: 0,
                node: Object.assign(Object.assign({}, node), { x: 0, y: 0, width, height }),
                index: 0,
                dataKey,
            });
            const formatRoot = squarify(root, aspectRatio);
            const { nestIndex } = this.state;
            nestIndex.push(node);
            this.setState({
                formatRoot,
                currentRoot: root,
                nestIndex,
            });
        }
        if (onClick) {
            onClick(node);
        }
    }
    handleNestIndex(node, i) {
        let { nestIndex } = this.state;
        const { width, height, dataKey, aspectRatio } = this.props;
        const root = computeNode({
            depth: 0,
            node: Object.assign(Object.assign({}, node), { x: 0, y: 0, width, height }),
            index: 0,
            dataKey,
        });
        const formatRoot = squarify(root, aspectRatio);
        nestIndex = nestIndex.slice(0, i + 1);
        this.setState({
            formatRoot,
            currentRoot: node,
            nestIndex,
        });
    }
    renderItem(content, nodeProps, isLeaf) {
        const { isAnimationActive, animationBegin, animationDuration, animationEasing, isUpdateAnimationActive, type, animationId, colorPanel, } = this.props;
        const { isAnimationFinished } = this.state;
        const { width, height, x, y, depth } = nodeProps;
        const translateX = parseInt(`${(Math.random() * 2 - 1) * width}`, 10);
        let event = {};
        if (isLeaf || type === 'nest') {
            event = {
                onMouseEnter: this.handleMouseEnter.bind(this, nodeProps),
                onMouseLeave: this.handleMouseLeave.bind(this, nodeProps),
                onClick: this.handleClick.bind(this, nodeProps),
            };
        }
        if (!isAnimationActive) {
            return (react_1.default.createElement(Layer_1.Layer, Object.assign({}, event), this.constructor.renderContentItem(content, Object.assign(Object.assign({}, nodeProps), { isAnimationActive: false, isUpdateAnimationActive: false, width,
                height,
                x,
                y }), type, colorPanel)));
        }
        return (react_1.default.createElement(react_smooth_1.default, { begin: animationBegin, duration: animationDuration, isActive: isAnimationActive, easing: animationEasing, key: `treemap-${animationId}`, from: { x, y, width, height }, to: { x, y, width, height }, onAnimationStart: this.handleAnimationStart, onAnimationEnd: this.handleAnimationEnd }, ({ x: currX, y: currY, width: currWidth, height: currHeight }) => (react_1.default.createElement(react_smooth_1.default, { from: `translate(${translateX}px, ${translateX}px)`, to: "translate(0, 0)", attributeName: "transform", begin: animationBegin, easing: animationEasing, isActive: isAnimationActive, duration: animationDuration },
            react_1.default.createElement(Layer_1.Layer, Object.assign({}, event), (() => {
                if (depth > 2 && !isAnimationFinished) {
                    return null;
                }
                return this.constructor.renderContentItem(content, Object.assign(Object.assign({}, nodeProps), { isAnimationActive, isUpdateAnimationActive: !isUpdateAnimationActive, width: currWidth, height: currHeight, x: currX, y: currY }), type, colorPanel);
            })())))));
    }
    static renderContentItem(content, nodeProps, type, colorPanel) {
        if (react_1.default.isValidElement(content)) {
            return react_1.default.cloneElement(content, nodeProps);
        }
        if ((0, isFunction_1.default)(content)) {
            return content(nodeProps);
        }
        const { x, y, width, height, index } = nodeProps;
        let arrow = null;
        if (width > 10 && height > 10 && nodeProps.children && type === 'nest') {
            arrow = (react_1.default.createElement(Polygon_1.Polygon, { points: [
                    { x: x + 2, y: y + height / 2 },
                    { x: x + 6, y: y + height / 2 + 3 },
                    { x: x + 2, y: y + height / 2 + 6 },
                ] }));
        }
        let text = null;
        const nameSize = (0, DOMUtils_1.getStringSize)(nodeProps.name);
        if (width > 20 && height > 20 && nameSize.width < width && nameSize.height < height) {
            text = (react_1.default.createElement("text", { x: x + 8, y: y + height / 2 + 7, fontSize: 14 }, nodeProps.name));
        }
        const colors = colorPanel || Constants_1.COLOR_PANEL;
        return (react_1.default.createElement("g", null,
            react_1.default.createElement(Rectangle_1.Rectangle, Object.assign({ fill: nodeProps.depth < 2 ? colors[index % colors.length] : 'rgba(255,255,255,0)', stroke: "#fff" }, (0, omit_1.default)(nodeProps, 'children'), { role: "img" })),
            arrow,
            text));
    }
    renderNode(root, node) {
        const { content, type } = this.props;
        const nodeProps = Object.assign(Object.assign(Object.assign({}, (0, ReactUtils_1.filterProps)(this.props, false)), node), { root });
        const isLeaf = !node.children || !node.children.length;
        const { currentRoot } = this.state;
        const isCurrentRootChild = (currentRoot.children || []).filter((item) => item.depth === node.depth && item.name === node.name);
        if (!isCurrentRootChild.length && root.depth && type === 'nest') {
            return null;
        }
        return (react_1.default.createElement(Layer_1.Layer, { key: `recharts-treemap-node-${nodeProps.x}-${nodeProps.y}-${nodeProps.name}`, className: `recharts-treemap-depth-${node.depth}` },
            this.renderItem(content, nodeProps, isLeaf),
            node.children && node.children.length
                ? node.children.map((child) => this.renderNode(node, child))
                : null));
    }
    renderAllNodes() {
        const { formatRoot } = this.state;
        if (!formatRoot) {
            return null;
        }
        return this.renderNode(formatRoot, formatRoot);
    }
    renderNestIndex() {
        const { nameKey, nestIndexContent } = this.props;
        const { nestIndex } = this.state;
        return (react_1.default.createElement("div", { className: "recharts-treemap-nest-index-wrapper", style: { marginTop: '8px', textAlign: 'center' } }, nestIndex.map((item, i) => {
            const name = (0, get_1.default)(item, nameKey, 'root');
            let content = null;
            if (react_1.default.isValidElement(nestIndexContent)) {
                content = react_1.default.cloneElement(nestIndexContent, item, i);
            }
            if ((0, isFunction_1.default)(nestIndexContent)) {
                content = nestIndexContent(item, i);
            }
            else {
                content = name;
            }
            return (react_1.default.createElement("div", { onClick: this.handleNestIndex.bind(this, item, i), key: `nest-index-${(0, DataUtils_1.uniqueId)()}`, className: "recharts-treemap-nest-index-box", style: {
                    cursor: 'pointer',
                    display: 'inline-block',
                    padding: '0 7px',
                    background: '#000',
                    color: '#fff',
                    marginRight: '3px',
                } }, content));
        })));
    }
    getTooltipContext() {
        const { nameKey } = this.props;
        const { isTooltipActive, activeNode } = this.state;
        const coordinate = activeNode
            ? {
                x: activeNode.x + activeNode.width / 2,
                y: activeNode.y + activeNode.height / 2,
            }
            : null;
        const payload = isTooltipActive && activeNode
            ? [
                {
                    payload: activeNode,
                    name: (0, ChartUtils_1.getValueByDataKey)(activeNode, nameKey, ''),
                    value: (0, ChartUtils_1.getValueByDataKey)(activeNode, NODE_VALUE_KEY),
                },
            ]
            : [];
        return {
            active: isTooltipActive,
            coordinate,
            label: '',
            payload,
            index: 0,
        };
    }
    render() {
        if (!(0, ReactUtils_1.validateWidthHeight)(this)) {
            return null;
        }
        const _a = this.props, { width, height, className, style, children, type } = _a, others = __rest(_a, ["width", "height", "className", "style", "children", "type"]);
        const attrs = (0, ReactUtils_1.filterProps)(others, false);
        const viewBox = { x: 0, y: 0, width, height };
        return (react_1.default.createElement(chartLayoutContext_1.ViewBoxContext.Provider, { value: viewBox },
            react_1.default.createElement(tooltipContext_1.TooltipContextProvider, { value: this.getTooltipContext() },
                react_1.default.createElement("div", { className: (0, clsx_1.default)('recharts-wrapper', className), style: Object.assign(Object.assign({}, style), { position: 'relative', cursor: 'default', width, height }), role: "region" },
                    react_1.default.createElement(Surface_1.Surface, Object.assign({}, attrs, { width: width, height: type === 'nest' ? height - 30 : height }),
                        this.renderAllNodes(),
                        children),
                    type === 'nest' && this.renderNestIndex()))));
    }
}
exports.Treemap = Treemap;
Treemap.displayName = 'Treemap';
Treemap.defaultProps = {
    aspectRatio: 0.5 * (1 + Math.sqrt(5)),
    dataKey: 'value',
    type: 'flat',
    isAnimationActive: !Global_1.Global.isSsr,
    isUpdateAnimationActive: !Global_1.Global.isSsr,
    animationBegin: 0,
    animationDuration: 1500,
    animationEasing: 'linear',
};
//# sourceMappingURL=Treemap.js.map