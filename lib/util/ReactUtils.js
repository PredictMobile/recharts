"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filterProps = exports.SCALE_TYPES = void 0;
exports.findAllByType = findAllByType;
exports.findChildByType = findChildByType;
exports.validateWidthHeight = exports.toArray = exports.renderByOrder = exports.parseChildIndex = exports.isValidSpreadableProp = exports.isDotProps = exports.isChildrenEqual = exports.getReactEventByType = exports.getDisplayName = void 0;
var _get = _interopRequireDefault(require("lodash/get"));
var _isNil = _interopRequireDefault(require("lodash/isNil"));
var _isString = _interopRequireDefault(require("lodash/isString"));
var _isFunction = _interopRequireDefault(require("lodash/isFunction"));
var _isObject = _interopRequireDefault(require("lodash/isObject"));
var _react = require("react");
var _reactIs = require("react-is");
var _DataUtils = require("./DataUtils");
var _ShallowEqual = require("./ShallowEqual");
var _types = require("./types");
var _excluded = ["children"],
  _excluded2 = ["children"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
var REACT_BROWSER_EVENT_MAP = {
  click: 'onClick',
  mousedown: 'onMouseDown',
  mouseup: 'onMouseUp',
  mouseover: 'onMouseOver',
  mousemove: 'onMouseMove',
  mouseout: 'onMouseOut',
  mouseenter: 'onMouseEnter',
  mouseleave: 'onMouseLeave',
  touchcancel: 'onTouchCancel',
  touchend: 'onTouchEnd',
  touchmove: 'onTouchMove',
  touchstart: 'onTouchStart'
};
var SCALE_TYPES = exports.SCALE_TYPES = ['auto', 'linear', 'pow', 'sqrt', 'log', 'identity', 'time', 'band', 'point', 'ordinal', 'quantile', 'quantize', 'utc', 'sequential', 'threshold'];

/**
 * @deprecated instead find another approach that does not depend on displayName.
 * Get the display name of a component
 * @param  {Object} Comp Specified Component
 * @return {String}      Display name of Component
 */
var getDisplayName = Comp => {
  if (typeof Comp === 'string') {
    return Comp;
  }
  if (!Comp) {
    return '';
  }
  return Comp.displayName || Comp.name || 'Component';
};

// `toArray` gets called multiple times during the render
// so we can memoize last invocation (since reference to `children` is the same)
exports.getDisplayName = getDisplayName;
var lastChildren = null;
var lastResult = null;

/**
 * @deprecated instead find another approach that does not require reading React Elements from DOM.
 *
 * @param children do not use
 * @return deprecated do not use
 */
var toArray = children => {
  if (children === lastChildren && Array.isArray(lastResult)) {
    return lastResult;
  }
  var result = [];
  _react.Children.forEach(children, child => {
    if ((0, _isNil.default)(child)) return;
    if ((0, _reactIs.isFragment)(child)) {
      result = result.concat(toArray(child.props.children));
    } else {
      result.push(child);
    }
  });
  lastResult = result;
  lastChildren = children;
  return result;
};

/**
 * @deprecated instead find another approach that does not require reading React Elements from DOM.
 *
 * Find and return all matched children by type.
 * `type` must be a React.ComponentType
 *
 * @param children do not use
 * @param type do not use
 * @return deprecated do not use
 */
exports.toArray = toArray;
function findAllByType(children, type) {
  var result = [];
  var types = [];
  if (Array.isArray(type)) {
    types = type.map(t => getDisplayName(t));
  } else {
    types = [getDisplayName(type)];
  }
  toArray(children).forEach(child => {
    var childType = (0, _get.default)(child, 'type.displayName') || (0, _get.default)(child, 'type.name');
    if (types.indexOf(childType) !== -1) {
      result.push(child);
    }
  });
  return result;
}

/**
 * @deprecated instead find another approach that does not require reading React Elements from DOM.
 *
 * Return the first matched child by type, return null otherwise.
 * `type` must be a React.ComponentType
 *
 * @param children do not use
 * @param type do not use
 * @return deprecated do not use
 */
function findChildByType(children, type) {
  var result = findAllByType(children, type);
  return result && result[0];
}

/**
 * validate the width and height props of a chart element
 * @param  {Object} el A chart element
 * @return {Boolean}   true If the props width and height are number, and greater than 0
 */
var validateWidthHeight = el => {
  if (!el || !el.props) {
    return false;
  }
  var {
    width,
    height
  } = el.props;
  if (!(0, _DataUtils.isNumber)(width) || width <= 0 || !(0, _DataUtils.isNumber)(height) || height <= 0) {
    return false;
  }
  return true;
};
exports.validateWidthHeight = validateWidthHeight;
var SVG_TAGS = ['a', 'altGlyph', 'altGlyphDef', 'altGlyphItem', 'animate', 'animateColor', 'animateMotion', 'animateTransform', 'circle', 'clipPath', 'color-profile', 'cursor', 'defs', 'desc', 'ellipse', 'feBlend', 'feColormatrix', 'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap', 'feDistantLight', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR', 'feGaussianBlur', 'feImage', 'feMerge', 'feMergeNode', 'feMorphology', 'feOffset', 'fePointLight', 'feSpecularLighting', 'feSpotLight', 'feTile', 'feTurbulence', 'filter', 'font', 'font-face', 'font-face-format', 'font-face-name', 'font-face-url', 'foreignObject', 'g', 'glyph', 'glyphRef', 'hkern', 'image', 'line', 'lineGradient', 'marker', 'mask', 'metadata', 'missing-glyph', 'mpath', 'path', 'pattern', 'polygon', 'polyline', 'radialGradient', 'rect', 'script', 'set', 'stop', 'style', 'svg', 'switch', 'symbol', 'text', 'textPath', 'title', 'tref', 'tspan', 'use', 'view', 'vkern'];

/**
 * @deprecated instead find another approach that does not require reading React Elements from DOM.
 *
 * @param child do not use
 * @return deprecated do not use
 */
var isSvgElement = child => child && child.type && (0, _isString.default)(child.type) && SVG_TAGS.indexOf(child.type) >= 0;
var isDotProps = dot => dot && typeof dot === 'object' && 'cx' in dot && 'cy' in dot && 'r' in dot;

/**
 * Checks if the property is valid to spread onto an SVG element or onto a specific component
 * @param {unknown} property property value currently being compared
 * @param {string} key property key currently being compared
 * @param {boolean} includeEvents if events are included in spreadable props
 * @param {boolean} svgElementType checks against map of SVG element types to attributes
 * @returns {boolean} is prop valid
 */
exports.isDotProps = isDotProps;
var isValidSpreadableProp = (property, key, includeEvents, svgElementType) => {
  var _FilteredElementKeyMa;
  /**
   * If the svg element type is explicitly included, check against the filtered element key map
   * to determine if there are attributes that should only exist on that element type.
   * @todo Add an internal cjs version of https://github.com/wooorm/svg-element-attributes for full coverage.
   */
  var matchingElementTypeKeys = (_FilteredElementKeyMa = _types.FilteredElementKeyMap === null || _types.FilteredElementKeyMap === void 0 ? void 0 : _types.FilteredElementKeyMap[svgElementType]) !== null && _FilteredElementKeyMa !== void 0 ? _FilteredElementKeyMa : [];
  return !(0, _isFunction.default)(property) && (svgElementType && matchingElementTypeKeys.includes(key) || _types.SVGElementPropKeys.includes(key)) || includeEvents && _types.EventKeys.includes(key);
};
exports.isValidSpreadableProp = isValidSpreadableProp;
var filterProps = (props, includeEvents, svgElementType) => {
  if (!props || typeof props === 'function' || typeof props === 'boolean') {
    return null;
  }
  var inputProps = props;
  if ( /*#__PURE__*/(0, _react.isValidElement)(props)) {
    inputProps = props.props;
  }
  if (!(0, _isObject.default)(inputProps)) {
    return null;
  }
  var out = {};

  /**
   * Props are blindly spread onto SVG elements. This loop filters out properties that we don't want to spread.
   * Items filtered out are as follows:
   *   - functions in properties that are SVG attributes (functions are included when includeEvents is true)
   *   - props that are SVG attributes but don't matched the passed svgElementType
   *   - any prop that is not in SVGElementPropKeys (or in EventKeys if includeEvents is true)
   */
  Object.keys(inputProps).forEach(key => {
    var _inputProps;
    if (isValidSpreadableProp((_inputProps = inputProps) === null || _inputProps === void 0 ? void 0 : _inputProps[key], key, includeEvents, svgElementType)) {
      out[key] = inputProps[key];
    }
  });
  return out;
};

/**
 * @deprecated instead find another approach that does not require comparing React Elements.
 * Wether props of children changed
 * @param  {Object} nextChildren The latest children
 * @param  {Object} prevChildren The prev children
 * @return {Boolean}             equal or not
 */
exports.filterProps = filterProps;
var isChildrenEqual = (nextChildren, prevChildren) => {
  if (nextChildren === prevChildren) {
    return true;
  }
  var count = _react.Children.count(nextChildren);
  if (count !== _react.Children.count(prevChildren)) {
    return false;
  }
  if (count === 0) {
    return true;
  }
  if (count === 1) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return isSingleChildEqual(Array.isArray(nextChildren) ? nextChildren[0] : nextChildren, Array.isArray(prevChildren) ? prevChildren[0] : prevChildren);
  }
  for (var i = 0; i < count; i++) {
    var nextChild = nextChildren[i];
    var prevChild = prevChildren[i];
    if (Array.isArray(nextChild) || Array.isArray(prevChild)) {
      if (!isChildrenEqual(nextChild, prevChild)) {
        return false;
      }
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
    } else if (!isSingleChildEqual(nextChild, prevChild)) {
      return false;
    }
  }
  return true;
};

/**
 * @deprecated instead find another approach that does not require comparing React Elements.
 * @param nextChild do not use
 * @param prevChild do not use
 * @return deprecated do not use
 */
exports.isChildrenEqual = isChildrenEqual;
var isSingleChildEqual = (nextChild, prevChild) => {
  if ((0, _isNil.default)(nextChild) && (0, _isNil.default)(prevChild)) {
    return true;
  }
  if (!(0, _isNil.default)(nextChild) && !(0, _isNil.default)(prevChild)) {
    var _ref = nextChild.props || {},
      {
        children: nextChildren
      } = _ref,
      nextProps = _objectWithoutProperties(_ref, _excluded);
    var _ref2 = prevChild.props || {},
      {
        children: prevChildren
      } = _ref2,
      prevProps = _objectWithoutProperties(_ref2, _excluded2);
    if (nextChildren && prevChildren) {
      return (0, _ShallowEqual.shallowEqual)(nextProps, prevProps) && isChildrenEqual(nextChildren, prevChildren);
    }
    if (!nextChildren && !prevChildren) {
      return (0, _ShallowEqual.shallowEqual)(nextProps, prevProps);
    }
    return false;
  }
  return false;
};

/**
 * @deprecated instead find another approach that does not require reading React Elements from DOM.
 *
 * @param children do not use
 * @param renderMap do not use
 * @return deprecated do not use
 */
var renderByOrder = (children, renderMap) => {
  var elements = [];
  var record = {};
  toArray(children).forEach((child, index) => {
    if (isSvgElement(child)) {
      elements.push(child);
    } else if (child) {
      var displayName = getDisplayName(child.type);
      var {
        handler,
        once
      } = renderMap[displayName] || {};
      if (handler && (!once || !record[displayName])) {
        var results = handler(child, displayName, index);
        elements.push(results);
        record[displayName] = true;
      }
    }
  });
  return elements;
};
exports.renderByOrder = renderByOrder;
var getReactEventByType = e => {
  var type = e && e.type;
  if (type && REACT_BROWSER_EVENT_MAP[type]) {
    return REACT_BROWSER_EVENT_MAP[type];
  }
  return null;
};

/**
 * @deprecated instead find another approach that does not require reading React Elements from DOM.
 *
 * @param child do not use
 * @param children do not use
 * @return deprecated do not use
 */
exports.getReactEventByType = getReactEventByType;
var parseChildIndex = (child, children) => {
  return toArray(children).indexOf(child);
};
exports.parseChildIndex = parseChildIndex;