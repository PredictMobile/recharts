"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessibilityManager = void 0;
class AccessibilityManager {
    constructor() {
        this.activeIndex = 0;
        this.coordinateList = [];
        this.layout = 'horizontal';
        this.ltr = true;
    }
    setDetails({ coordinateList = null, container = null, layout = null, offset = null, mouseHandlerCallback = null, ltr = null, }) {
        var _a;
        this.coordinateList = (_a = coordinateList !== null && coordinateList !== void 0 ? coordinateList : this.coordinateList) !== null && _a !== void 0 ? _a : [];
        this.container = container !== null && container !== void 0 ? container : this.container;
        this.layout = layout !== null && layout !== void 0 ? layout : this.layout;
        this.offset = offset !== null && offset !== void 0 ? offset : this.offset;
        this.mouseHandlerCallback = mouseHandlerCallback !== null && mouseHandlerCallback !== void 0 ? mouseHandlerCallback : this.mouseHandlerCallback;
        this.ltr = ltr !== null && ltr !== void 0 ? ltr : this.ltr;
        this.activeIndex = Math.min(Math.max(this.activeIndex, 0), this.coordinateList.length - 1);
    }
    focus() {
        this.spoofMouse();
    }
    keyboardEvent(e) {
        if (this.coordinateList.length === 0) {
            return;
        }
        switch (`${this.ltr ? 'ltr' : 'rtl'}-${e.key}`) {
            case 'ltr-ArrowRight':
            case 'rtl-ArrowLeft': {
                if (this.layout !== 'horizontal') {
                    return;
                }
                this.activeIndex = Math.min(this.activeIndex + 1, this.coordinateList.length - 1);
                this.spoofMouse();
                break;
            }
            case 'ltr-ArrowLeft':
            case 'rtl-ArrowRight': {
                if (this.layout !== 'horizontal') {
                    return;
                }
                this.activeIndex = Math.max(this.activeIndex - 1, 0);
                this.spoofMouse();
                break;
            }
            default: {
                break;
            }
        }
    }
    setIndex(newIndex) {
        this.activeIndex = newIndex;
    }
    spoofMouse() {
        if (this.layout !== 'horizontal') {
            return;
        }
        if (this.coordinateList.length === 0) {
            return;
        }
        const { x, y, height } = this.container.getBoundingClientRect();
        const { coordinate } = this.coordinateList[this.activeIndex];
        const scrollOffsetX = (window === null || window === void 0 ? void 0 : window.scrollX) || 0;
        const scrollOffsetY = (window === null || window === void 0 ? void 0 : window.scrollY) || 0;
        const pageX = x + coordinate + scrollOffsetX;
        const pageY = y + this.offset.top + height / 2 + scrollOffsetY;
        this.mouseHandlerCallback({ pageX, pageY });
    }
}
exports.AccessibilityManager = AccessibilityManager;
//# sourceMappingURL=AccessibilityManager.js.map