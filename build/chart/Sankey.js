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
exports.Sankey = void 0;
const react_1 = __importStar(require("react"));
const maxBy_1 = __importDefault(require("lodash/maxBy"));
const min_1 = __importDefault(require("lodash/min"));
const get_1 = __importDefault(require("lodash/get"));
const sumBy_1 = __importDefault(require("lodash/sumBy"));
const isFunction_1 = __importDefault(require("lodash/isFunction"));
const clsx_1 = __importDefault(require("clsx"));
const Surface_1 = require("../container/Surface");
const Layer_1 = require("../container/Layer");
const Tooltip_1 = require("../component/Tooltip");
const Rectangle_1 = require("../shape/Rectangle");
const ShallowEqual_1 = require("../util/ShallowEqual");
const ReactUtils_1 = require("../util/ReactUtils");
const ChartUtils_1 = require("../util/ChartUtils");
const chartLayoutContext_1 = require("../context/chartLayoutContext");
const tooltipContext_1 = require("../context/tooltipContext");
const defaultCoordinateOfTooltip = { x: 0, y: 0 };
const interpolationGenerator = (a, b) => {
    const ka = +a;
    const kb = b - ka;
    return (t) => ka + kb * t;
};
const centerY = (node) => node.y + node.dy / 2;
const getValue = (entry) => (entry && entry.value) || 0;
const getSumOfIds = (links, ids) => ids.reduce((result, id) => result + getValue(links[id]), 0);
const getSumWithWeightedSource = (tree, links, ids) => ids.reduce((result, id) => {
    const link = links[id];
    const sourceNode = tree[link.source];
    return result + centerY(sourceNode) * getValue(links[id]);
}, 0);
const getSumWithWeightedTarget = (tree, links, ids) => ids.reduce((result, id) => {
    const link = links[id];
    const targetNode = tree[link.target];
    return result + centerY(targetNode) * getValue(links[id]);
}, 0);
const ascendingY = (a, b) => a.y - b.y;
const searchTargetsAndSources = (links, id) => {
    const sourceNodes = [];
    const sourceLinks = [];
    const targetNodes = [];
    const targetLinks = [];
    for (let i = 0, len = links.length; i < len; i++) {
        const link = links[i];
        if (link.source === id) {
            targetNodes.push(link.target);
            targetLinks.push(i);
        }
        if (link.target === id) {
            sourceNodes.push(link.source);
            sourceLinks.push(i);
        }
    }
    return { sourceNodes, sourceLinks, targetLinks, targetNodes };
};
const updateDepthOfTargets = (tree, curNode) => {
    const { targetNodes } = curNode;
    for (let i = 0, len = targetNodes.length; i < len; i++) {
        const target = tree[targetNodes[i]];
        if (target) {
            target.depth = Math.max(curNode.depth + 1, target.depth);
            updateDepthOfTargets(tree, target);
        }
    }
};
const getNodesTree = ({ nodes, links }, width, nodeWidth) => {
    const tree = nodes.map((entry, index) => {
        const result = searchTargetsAndSources(links, index);
        return Object.assign(Object.assign(Object.assign({}, entry), result), { value: Math.max(getSumOfIds(links, result.sourceLinks), getSumOfIds(links, result.targetLinks)), depth: 0 });
    });
    for (let i = 0, len = tree.length; i < len; i++) {
        const node = tree[i];
        if (!node.sourceNodes.length) {
            updateDepthOfTargets(tree, node);
        }
    }
    const maxDepth = (0, maxBy_1.default)(tree, (entry) => entry.depth).depth;
    if (maxDepth >= 1) {
        const childWidth = (width - nodeWidth) / maxDepth;
        for (let i = 0, len = tree.length; i < len; i++) {
            const node = tree[i];
            if (!node.targetNodes.length) {
                node.depth = maxDepth;
            }
            node.x = node.depth * childWidth;
            node.dx = nodeWidth;
        }
    }
    return { tree, maxDepth };
};
const getDepthTree = (tree) => {
    const result = [];
    for (let i = 0, len = tree.length; i < len; i++) {
        const node = tree[i];
        if (!result[node.depth]) {
            result[node.depth] = [];
        }
        result[node.depth].push(node);
    }
    return result;
};
const updateYOfTree = (depthTree, height, nodePadding, links) => {
    const yRatio = (0, min_1.default)(depthTree.map((nodes) => (height - (nodes.length - 1) * nodePadding) / (0, sumBy_1.default)(nodes, getValue)));
    for (let d = 0, maxDepth = depthTree.length; d < maxDepth; d++) {
        for (let i = 0, len = depthTree[d].length; i < len; i++) {
            const node = depthTree[d][i];
            node.y = i;
            node.dy = node.value * yRatio;
        }
    }
    return links.map((link) => (Object.assign(Object.assign({}, link), { dy: getValue(link) * yRatio })));
};
const resolveCollisions = (depthTree, height, nodePadding, sort = true) => {
    for (let i = 0, len = depthTree.length; i < len; i++) {
        const nodes = depthTree[i];
        const n = nodes.length;
        if (sort) {
            nodes.sort(ascendingY);
        }
        let y0 = 0;
        for (let j = 0; j < n; j++) {
            const node = nodes[j];
            const dy = y0 - node.y;
            if (dy > 0) {
                node.y += dy;
            }
            y0 = node.y + node.dy + nodePadding;
        }
        y0 = height + nodePadding;
        for (let j = n - 1; j >= 0; j--) {
            const node = nodes[j];
            const dy = node.y + node.dy + nodePadding - y0;
            if (dy > 0) {
                node.y -= dy;
                y0 = node.y;
            }
            else {
                break;
            }
        }
    }
};
const relaxLeftToRight = (tree, depthTree, links, alpha) => {
    for (let i = 0, maxDepth = depthTree.length; i < maxDepth; i++) {
        const nodes = depthTree[i];
        for (let j = 0, len = nodes.length; j < len; j++) {
            const node = nodes[j];
            if (node.sourceLinks.length) {
                const sourceSum = getSumOfIds(links, node.sourceLinks);
                const weightedSum = getSumWithWeightedSource(tree, links, node.sourceLinks);
                const y = weightedSum / sourceSum;
                node.y += (y - centerY(node)) * alpha;
            }
        }
    }
};
const relaxRightToLeft = (tree, depthTree, links, alpha) => {
    for (let i = depthTree.length - 1; i >= 0; i--) {
        const nodes = depthTree[i];
        for (let j = 0, len = nodes.length; j < len; j++) {
            const node = nodes[j];
            if (node.targetLinks.length) {
                const targetSum = getSumOfIds(links, node.targetLinks);
                const weightedSum = getSumWithWeightedTarget(tree, links, node.targetLinks);
                const y = weightedSum / targetSum;
                node.y += (y - centerY(node)) * alpha;
            }
        }
    }
};
const updateYOfLinks = (tree, links) => {
    for (let i = 0, len = tree.length; i < len; i++) {
        const node = tree[i];
        let sy = 0;
        let ty = 0;
        node.targetLinks.sort((a, b) => tree[links[a].target].y - tree[links[b].target].y);
        node.sourceLinks.sort((a, b) => tree[links[a].source].y - tree[links[b].source].y);
        for (let j = 0, tLen = node.targetLinks.length; j < tLen; j++) {
            const link = links[node.targetLinks[j]];
            if (link) {
                link.sy = sy;
                sy += link.dy;
            }
        }
        for (let j = 0, sLen = node.sourceLinks.length; j < sLen; j++) {
            const link = links[node.sourceLinks[j]];
            if (link) {
                link.ty = ty;
                ty += link.dy;
            }
        }
    }
};
const computeData = ({ data, width, height, iterations, nodeWidth, nodePadding, sort, }) => {
    const { links } = data;
    const { tree } = getNodesTree(data, width, nodeWidth);
    const depthTree = getDepthTree(tree);
    const newLinks = updateYOfTree(depthTree, height, nodePadding, links);
    resolveCollisions(depthTree, height, nodePadding, sort);
    let alpha = 1;
    for (let i = 1; i <= iterations; i++) {
        relaxRightToLeft(tree, depthTree, newLinks, (alpha *= 0.99));
        resolveCollisions(depthTree, height, nodePadding, sort);
        relaxLeftToRight(tree, depthTree, newLinks, alpha);
        resolveCollisions(depthTree, height, nodePadding, sort);
    }
    updateYOfLinks(tree, newLinks);
    return { nodes: tree, links: newLinks };
};
const getCoordinateOfTooltip = (el, type) => {
    if (type === 'node') {
        return { x: el.x + el.width / 2, y: el.y + el.height / 2 };
    }
    return {
        x: (el.sourceX + el.targetX) / 2,
        y: (el.sourceY + el.targetY) / 2,
    };
};
const getPayloadOfTooltip = (el, type, nameKey) => {
    const { payload } = el;
    if (type === 'node') {
        return [
            {
                payload: el,
                name: (0, ChartUtils_1.getValueByDataKey)(payload, nameKey, ''),
                value: (0, ChartUtils_1.getValueByDataKey)(payload, 'value'),
            },
        ];
    }
    if (payload.source && payload.target) {
        const sourceName = (0, ChartUtils_1.getValueByDataKey)(payload.source, nameKey, '');
        const targetName = (0, ChartUtils_1.getValueByDataKey)(payload.target, nameKey, '');
        return [
            {
                payload: el,
                name: `${sourceName} - ${targetName}`,
                value: (0, ChartUtils_1.getValueByDataKey)(payload, 'value'),
            },
        ];
    }
    return [];
};
class Sankey extends react_1.PureComponent {
    constructor() {
        super(...arguments);
        this.state = {
            activeElement: null,
            activeElementType: null,
            isTooltipActive: false,
            nodes: [],
            links: [],
        };
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        const { data, width, height, margin, iterations, nodeWidth, nodePadding, sort } = nextProps;
        if (data !== prevState.prevData ||
            width !== prevState.prevWidth ||
            height !== prevState.prevHeight ||
            !(0, ShallowEqual_1.shallowEqual)(margin, prevState.prevMargin) ||
            iterations !== prevState.prevIterations ||
            nodeWidth !== prevState.prevNodeWidth ||
            nodePadding !== prevState.prevNodePadding ||
            sort !== prevState.sort) {
            const contentWidth = width - ((margin && margin.left) || 0) - ((margin && margin.right) || 0);
            const contentHeight = height - ((margin && margin.top) || 0) - ((margin && margin.bottom) || 0);
            const { links, nodes } = computeData({
                data,
                width: contentWidth,
                height: contentHeight,
                iterations,
                nodeWidth,
                nodePadding,
                sort,
            });
            return Object.assign(Object.assign({}, prevState), { nodes,
                links, prevData: data, prevWidth: iterations, prevHeight: height, prevMargin: margin, prevNodePadding: nodePadding, prevNodeWidth: nodeWidth, prevIterations: iterations, prevSort: sort });
        }
        return null;
    }
    handleMouseEnter(el, type, e) {
        const { onMouseEnter, children } = this.props;
        const tooltipItem = (0, ReactUtils_1.findChildByType)(children, Tooltip_1.Tooltip);
        if (tooltipItem) {
            this.setState(prev => {
                if (tooltipItem.props.trigger === 'hover') {
                    return Object.assign(Object.assign({}, prev), { activeElement: el, activeElementType: type, isTooltipActive: true });
                }
                return prev;
            }, () => {
                if (onMouseEnter) {
                    onMouseEnter(el, type, e);
                }
            });
        }
        else if (onMouseEnter) {
            onMouseEnter(el, type, e);
        }
    }
    handleMouseLeave(el, type, e) {
        const { onMouseLeave, children } = this.props;
        const tooltipItem = (0, ReactUtils_1.findChildByType)(children, Tooltip_1.Tooltip);
        if (tooltipItem) {
            this.setState(prev => {
                if (tooltipItem.props.trigger === 'hover') {
                    return Object.assign(Object.assign({}, prev), { activeElement: undefined, activeElementType: undefined, isTooltipActive: false });
                }
                return prev;
            }, () => {
                if (onMouseLeave) {
                    onMouseLeave(el, type, e);
                }
            });
        }
        else if (onMouseLeave) {
            onMouseLeave(el, type, e);
        }
    }
    handleClick(el, type, e) {
        const { onClick, children } = this.props;
        const tooltipItem = (0, ReactUtils_1.findChildByType)(children, Tooltip_1.Tooltip);
        if (tooltipItem && tooltipItem.props.trigger === 'click') {
            if (this.state.isTooltipActive) {
                this.setState(prev => {
                    return Object.assign(Object.assign({}, prev), { activeElement: undefined, activeElementType: undefined, isTooltipActive: false });
                });
            }
            else {
                this.setState(prev => {
                    return Object.assign(Object.assign({}, prev), { activeElement: el, activeElementType: type, isTooltipActive: true });
                });
            }
        }
        if (onClick)
            onClick(el, type, e);
    }
    static renderLinkItem(option, props) {
        if (react_1.default.isValidElement(option)) {
            return react_1.default.cloneElement(option, props);
        }
        if ((0, isFunction_1.default)(option)) {
            return option(props);
        }
        const { sourceX, sourceY, sourceControlX, targetX, targetY, targetControlX, linkWidth } = props, others = __rest(props, ["sourceX", "sourceY", "sourceControlX", "targetX", "targetY", "targetControlX", "linkWidth"]);
        return (react_1.default.createElement("path", Object.assign({ className: "recharts-sankey-link", d: `
          M${sourceX},${sourceY}
          C${sourceControlX},${sourceY} ${targetControlX},${targetY} ${targetX},${targetY}
        `, fill: "none", stroke: "#333", strokeWidth: linkWidth, strokeOpacity: "0.2" }, (0, ReactUtils_1.filterProps)(others, false))));
    }
    renderLinks(links, nodes) {
        const { linkCurvature, link: linkContent, margin } = this.props;
        const top = (0, get_1.default)(margin, 'top') || 0;
        const left = (0, get_1.default)(margin, 'left') || 0;
        return (react_1.default.createElement(Layer_1.Layer, { className: "recharts-sankey-links", key: "recharts-sankey-links" }, links.map((link, i) => {
            const { sy: sourceRelativeY, ty: targetRelativeY, dy: linkWidth } = link;
            const source = nodes[link.source];
            const target = nodes[link.target];
            const sourceX = source.x + source.dx + left;
            const targetX = target.x + left;
            const interpolationFunc = interpolationGenerator(sourceX, targetX);
            const sourceControlX = interpolationFunc(linkCurvature);
            const targetControlX = interpolationFunc(1 - linkCurvature);
            const sourceY = source.y + sourceRelativeY + linkWidth / 2 + top;
            const targetY = target.y + targetRelativeY + linkWidth / 2 + top;
            const linkProps = Object.assign({ sourceX,
                targetX,
                sourceY,
                targetY,
                sourceControlX,
                targetControlX,
                sourceRelativeY,
                targetRelativeY,
                linkWidth, index: i, payload: Object.assign(Object.assign({}, link), { source, target }) }, (0, ReactUtils_1.filterProps)(linkContent, false));
            const events = {
                onMouseEnter: this.handleMouseEnter.bind(this, linkProps, 'link'),
                onMouseLeave: this.handleMouseLeave.bind(this, linkProps, 'link'),
                onClick: this.handleClick.bind(this, linkProps, 'link'),
            };
            return (react_1.default.createElement(Layer_1.Layer, Object.assign({ key: `link-${link.source}-${link.target}-${link.value}` }, events), this.constructor.renderLinkItem(linkContent, linkProps)));
        })));
    }
    static renderNodeItem(option, props) {
        if (react_1.default.isValidElement(option)) {
            return react_1.default.cloneElement(option, props);
        }
        if ((0, isFunction_1.default)(option)) {
            return option(props);
        }
        return (react_1.default.createElement(Rectangle_1.Rectangle, Object.assign({ className: "recharts-sankey-node", fill: "#0088fe", fillOpacity: "0.8" }, (0, ReactUtils_1.filterProps)(props, false), { role: "img" })));
    }
    renderNodes(nodes) {
        const { node: nodeContent, margin } = this.props;
        const top = (0, get_1.default)(margin, 'top') || 0;
        const left = (0, get_1.default)(margin, 'left') || 0;
        return (react_1.default.createElement(Layer_1.Layer, { className: "recharts-sankey-nodes", key: "recharts-sankey-nodes" }, nodes.map((node, i) => {
            const { x, y, dx, dy } = node;
            const nodeProps = Object.assign(Object.assign({}, (0, ReactUtils_1.filterProps)(nodeContent, false)), { x: x + left, y: y + top, width: dx, height: dy, index: i, payload: node });
            const events = {
                onMouseEnter: this.handleMouseEnter.bind(this, nodeProps, 'node'),
                onMouseLeave: this.handleMouseLeave.bind(this, nodeProps, 'node'),
                onClick: this.handleClick.bind(this, nodeProps, 'node'),
            };
            return (react_1.default.createElement(Layer_1.Layer, Object.assign({ key: `node-${node.x}-${node.y}-${node.value}` }, events), this.constructor.renderNodeItem(nodeContent, nodeProps)));
        })));
    }
    getTooltipContext() {
        const { nameKey } = this.props;
        const { isTooltipActive, activeElement, activeElementType } = this.state;
        const coordinate = activeElement
            ? getCoordinateOfTooltip(activeElement, activeElementType)
            : defaultCoordinateOfTooltip;
        const payload = activeElement ? getPayloadOfTooltip(activeElement, activeElementType, nameKey) : [];
        return {
            label: '',
            payload,
            coordinate,
            active: isTooltipActive,
            index: 0,
        };
    }
    render() {
        if (!(0, ReactUtils_1.validateWidthHeight)(this)) {
            return null;
        }
        const _a = this.props, { width, height, className, style, children } = _a, others = __rest(_a, ["width", "height", "className", "style", "children"]);
        const { links, nodes } = this.state;
        const viewBox = { x: 0, y: 0, width, height };
        const attrs = (0, ReactUtils_1.filterProps)(others, false);
        return (react_1.default.createElement(chartLayoutContext_1.ViewBoxContext.Provider, { value: viewBox },
            react_1.default.createElement(tooltipContext_1.TooltipContextProvider, { value: this.getTooltipContext() },
                react_1.default.createElement("div", { className: (0, clsx_1.default)('recharts-wrapper', className), style: Object.assign(Object.assign({}, style), { position: 'relative', cursor: 'default', width, height }), role: "region" },
                    react_1.default.createElement(Surface_1.Surface, Object.assign({}, attrs, { width: width, height: height }),
                        children,
                        this.renderLinks(links, nodes),
                        this.renderNodes(nodes))))));
    }
}
exports.Sankey = Sankey;
Sankey.displayName = 'Sankey';
Sankey.defaultProps = {
    nameKey: 'name',
    dataKey: 'value',
    nodePadding: 10,
    nodeWidth: 10,
    linkCurvature: 0.5,
    iterations: 32,
    margin: { top: 5, right: 5, bottom: 5, left: 5 },
    sort: true,
};
//# sourceMappingURL=Sankey.js.map