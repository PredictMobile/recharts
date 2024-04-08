"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LegendPayloadProvider = void 0;
exports.useLegendPayload = useLegendPayload;
exports.useLegendPayloadDispatch = useLegendPayloadDispatch;
var _react = _interopRequireWildcard(require("react"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
var LegendPayloadContext = /*#__PURE__*/(0, _react.createContext)([]);
var LegendPayloadDispatchContext = /*#__PURE__*/(0, _react.createContext)({
  addSupplier: () => {},
  removeSupplier: () => {}
});

/**
 * Use this at the root of a chart where you want to have Legend
 * @param children all of the chart goes here
 * @returns ReactNode
 */
var LegendPayloadProvider = _ref => {
  var {
    children
  } = _ref;
  var [payload, setPayload] = (0, _react.useState)([]);
  var addSupplier = (0, _react.useCallback)(payloadSupplier => setPayload(prev => [...prev, payloadSupplier]), []);
  var removeSupplier = (0, _react.useCallback)(payloadSupplier => setPayload(prev => prev.filter(p => p !== payloadSupplier)), []);
  return /*#__PURE__*/_react.default.createElement(LegendPayloadDispatchContext.Provider, {
    value: {
      addSupplier,
      removeSupplier
    }
  }, /*#__PURE__*/_react.default.createElement(LegendPayloadContext.Provider, {
    value: payload
  }, children));
};

/**
 * Use this hook in Legend, or anywhere else where you want to read the current Legend items.
 * @return all Legend items ready to be rendered
 */
exports.LegendPayloadProvider = LegendPayloadProvider;
function useLegendPayload() {
  var allSuppliers = (0, _react.useContext)(LegendPayloadContext);
  return allSuppliers.flatMap(supplier => supplier());
}

/**
 * Use this inside every component that is adding items to the legend.
 * This is a little bit convoluted because it needs to do caching and has to avoid re-renders so instead of just the array of items,
 * it accepts a function to compute the items and the input in it.
 *
 * @param computeLegendPayload function that accepts input and returns Legend payload array
 * @param input input to computeLegendPayload function
 * @returns void - this does not return anything, only use it to write legend items
 */
function useLegendPayloadDispatch(computeLegendPayload, input) {
  /*
   * So this is a bit convoluted. If you are better at React than me (many are) then please refactor.
   *
   * I tried setting the array of LegendPayload directly, but then if there are multiple Pies they will overwrite each other's legends;
   * I tried concatenating arrays of other payload with the current payload, but that leads to an infinite loop;
   * finally this approach worked.
   *
   * Each Pie (or Area, or Bar) will register a function that returns payload items,
   * and then the reading hook (presumably used in Legend) can call them.
   * That way the Pie does not have access to other Pie's Legend items,
   * which means we avoid the infinite re-render loop.
   */
  var {
    addSupplier,
    removeSupplier
  } = (0, _react.useContext)(LegendPayloadDispatchContext);
  (0, _react.useEffect)(() => {
    var supplier = () => computeLegendPayload(input);
    addSupplier(supplier);
    return () => {
      removeSupplier(supplier);
    };
  }, [input, addSupplier, removeSupplier, computeLegendPayload]);
  return null;
}