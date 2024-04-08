"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AccessibilityManager = void 0;
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
class AccessibilityManager {
  constructor() {
    _defineProperty(this, "activeIndex", 0);
    _defineProperty(this, "coordinateList", []);
    _defineProperty(this, "layout", 'horizontal');
    _defineProperty(this, "ltr", true);
  }
  setDetails(_ref) {
    var _ref2;
    var {
      coordinateList = null,
      container = null,
      layout = null,
      offset = null,
      mouseHandlerCallback = null,
      ltr = null
    } = _ref;
    this.coordinateList = (_ref2 = coordinateList !== null && coordinateList !== void 0 ? coordinateList : this.coordinateList) !== null && _ref2 !== void 0 ? _ref2 : [];
    this.container = container !== null && container !== void 0 ? container : this.container;
    this.layout = layout !== null && layout !== void 0 ? layout : this.layout;
    this.offset = offset !== null && offset !== void 0 ? offset : this.offset;
    this.mouseHandlerCallback = mouseHandlerCallback !== null && mouseHandlerCallback !== void 0 ? mouseHandlerCallback : this.mouseHandlerCallback;
    this.ltr = ltr !== null && ltr !== void 0 ? ltr : this.ltr;

    // Keep activeIndex in the bounds between 0 and the last coordinate index
    this.activeIndex = Math.min(Math.max(this.activeIndex, 0), this.coordinateList.length - 1);
  }
  focus() {
    this.spoofMouse();
  }
  keyboardEvent(e) {
    // The AccessibilityManager relies on the Tooltip component. When tooltips suddenly stop existing,
    // it can cause errors. We use this function to check. We don't want arrow keys to be processed
    // if there are no tooltips, since that will cause unexpected behavior of users.
    if (this.coordinateList.length === 0) {
      return;
    }
    switch ("".concat(this.ltr ? 'ltr' : 'rtl', "-").concat(e.key)) {
      case 'ltr-ArrowRight':
      case 'rtl-ArrowLeft':
        {
          if (this.layout !== 'horizontal') {
            return;
          }
          this.activeIndex = Math.min(this.activeIndex + 1, this.coordinateList.length - 1);
          this.spoofMouse();
          break;
        }
      case 'ltr-ArrowLeft':
      case 'rtl-ArrowRight':
        {
          if (this.layout !== 'horizontal') {
            return;
          }
          this.activeIndex = Math.max(this.activeIndex - 1, 0);
          this.spoofMouse();
          break;
        }
      default:
        {
          break;
        }
    }
  }
  setIndex(newIndex) {
    this.activeIndex = newIndex;
  }
  spoofMouse() {
    var _window, _window2;
    if (this.layout !== 'horizontal') {
      return;
    }

    // This can happen when the tooltips suddenly stop existing as children of the component
    // That update doesn't otherwise fire events, so we have to double check here.
    if (this.coordinateList.length === 0) {
      return;
    }
    var {
      x,
      y,
      height
    } = this.container.getBoundingClientRect();
    var {
      coordinate
    } = this.coordinateList[this.activeIndex];
    var scrollOffsetX = ((_window = window) === null || _window === void 0 ? void 0 : _window.scrollX) || 0;
    var scrollOffsetY = ((_window2 = window) === null || _window2 === void 0 ? void 0 : _window2.scrollY) || 0;
    var pageX = x + coordinate + scrollOffsetX;
    var pageY = y + this.offset.top + height / 2 + scrollOffsetY;
    this.mouseHandlerCallback({
      pageX,
      pageY
    });
  }
}
exports.AccessibilityManager = AccessibilityManager;