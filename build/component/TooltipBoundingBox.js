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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TooltipBoundingBox = void 0;
const react_1 = __importStar(require("react"));
const translate_1 = require("../util/tooltip/translate");
class TooltipBoundingBox extends react_1.PureComponent {
    constructor() {
        super(...arguments);
        this.state = {
            dismissed: false,
            dismissedAtCoordinate: { x: 0, y: 0 },
        };
        this.handleKeyDown = (event) => {
            var _a, _b, _c, _d;
            if (event.key === 'Escape') {
                this.setState({
                    dismissed: true,
                    dismissedAtCoordinate: {
                        x: (_b = (_a = this.props.coordinate) === null || _a === void 0 ? void 0 : _a.x) !== null && _b !== void 0 ? _b : 0,
                        y: (_d = (_c = this.props.coordinate) === null || _c === void 0 ? void 0 : _c.y) !== null && _d !== void 0 ? _d : 0,
                    },
                });
            }
        };
    }
    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyDown);
    }
    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyDown);
    }
    componentDidUpdate() {
        var _a, _b;
        if (!this.state.dismissed) {
            return;
        }
        if (((_a = this.props.coordinate) === null || _a === void 0 ? void 0 : _a.x) !== this.state.dismissedAtCoordinate.x ||
            ((_b = this.props.coordinate) === null || _b === void 0 ? void 0 : _b.y) !== this.state.dismissedAtCoordinate.y) {
            this.state.dismissed = false;
        }
    }
    render() {
        const { active, allowEscapeViewBox, animationDuration, animationEasing, children, coordinate, hasPayload, isAnimationActive, offset, position, reverseDirection, useTranslate3d, viewBox, wrapperStyle, lastBoundingBox, innerRef, } = this.props;
        const { cssClasses, cssProperties } = (0, translate_1.getTooltipTranslate)({
            allowEscapeViewBox,
            coordinate,
            offsetTopLeft: offset,
            position,
            reverseDirection,
            tooltipBox: {
                height: lastBoundingBox.height,
                width: lastBoundingBox.width,
            },
            useTranslate3d,
            viewBox,
        });
        const outerStyle = Object.assign(Object.assign(Object.assign({ transition: isAnimationActive && active ? `transform ${animationDuration}ms ${animationEasing}` : undefined }, cssProperties), { pointerEvents: 'none', visibility: !this.state.dismissed && active && hasPayload ? 'visible' : 'hidden', position: 'absolute', top: 0, left: 0 }), wrapperStyle);
        return (react_1.default.createElement("g", null,
            react_1.default.createElement("foreignObject", { x: "0", y: "0", width: "100%", height: "100%", style: { pointerEvents: 'none' } },
                react_1.default.createElement("div", { xmlns: "http://www.w3.org/1999/xhtml", tabIndex: -1, className: cssClasses, style: outerStyle, ref: innerRef }, children))));
    }
}
exports.TooltipBoundingBox = TooltipBoundingBox;
//# sourceMappingURL=TooltipBoundingBox.js.map