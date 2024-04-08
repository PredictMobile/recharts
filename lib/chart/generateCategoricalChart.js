"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAxisMapByAxes = exports.generateCategoricalChart = exports.createDefaultState = void 0;
var _react = _interopRequireWildcard(require("react"));
var _isNil = _interopRequireDefault(require("lodash/isNil"));
var _isFunction = _interopRequireDefault(require("lodash/isFunction"));
var _range = _interopRequireDefault(require("lodash/range"));
var _get = _interopRequireDefault(require("lodash/get"));
var _sortBy = _interopRequireDefault(require("lodash/sortBy"));
var _throttle = _interopRequireDefault(require("lodash/throttle"));
var _clsx = _interopRequireDefault(require("clsx"));
var _tinyInvariant = _interopRequireDefault(require("tiny-invariant"));
var _Surface = require("../container/Surface");
var _Layer = require("../container/Layer");
var _Tooltip = require("../component/Tooltip");
var _Legend = require("../component/Legend");
var _Dot = require("../shape/Dot");
var _Rectangle = require("../shape/Rectangle");
var _ReactUtils = require("../util/ReactUtils");
var _Brush = require("../cartesian/Brush");
var _DOMUtils = require("../util/DOMUtils");
var _DataUtils = require("../util/DataUtils");
var _ChartUtils = require("../util/ChartUtils");
var _DetectReferenceElementsDomain = require("../util/DetectReferenceElementsDomain");
var _PolarUtils = require("../util/PolarUtils");
var _ShallowEqual = require("../util/ShallowEqual");
var _Events = require("../util/Events");
var _types = require("../util/types");
var _AccessibilityManager = require("./AccessibilityManager");
var _isDomainSpecifiedByUser = require("../util/isDomainSpecifiedByUser");
var _ActiveShapeUtils = require("../util/ActiveShapeUtils");
var _Cursor = require("../component/Cursor");
var _chartLayoutContext = require("../context/chartLayoutContext");
var _accessibilityContext = require("../context/accessibilityContext");
var _legendBoundingBoxContext = require("../context/legendBoundingBoxContext");
var _chartDataContext = require("../context/chartDataContext");
var _brushUpdateContext = require("../context/brushUpdateContext");
var _ClipPath = require("../container/ClipPath");
var _excluded = ["children", "className", "width", "height", "style", "compact", "title", "desc"];
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
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } // eslint-disable-next-line no-restricted-imports
var ORIENT_MAP = {
  xAxis: ['bottom', 'top'],
  yAxis: ['left', 'right']
};
var FULL_WIDTH_AND_HEIGHT = {
  width: '100%',
  height: '100%'
};
var originCoordinate = {
  x: 0,
  y: 0
};

/**
 * This function exists as a temporary workaround.
 *
 * Why? generateCategoricalChart does not render `{children}` directly;
 * instead it passes them through `renderByOrder` function which reads their handlers.
 *
 * So, this is a handler that does nothing.
 * Once we get rid of `renderByOrder` and switch to JSX only, we can get rid of this handler too.
 *
 * @param {JSX} element as is in JSX
 * @returns {JSX} the same element
 */
function renderAsIs(element) {
  return element;
}
var calculateTooltipPos = (rangeObj, layout) => {
  if (layout === 'horizontal') {
    return rangeObj.x;
  }
  if (layout === 'vertical') {
    return rangeObj.y;
  }
  if (layout === 'centric') {
    return rangeObj.angle;
  }
  return rangeObj.radius;
};
var getActiveCoordinate = (layout, tooltipTicks, activeIndex, rangeObj) => {
  var entry = tooltipTicks.find(tick => tick && tick.index === activeIndex);
  if (entry) {
    if (layout === 'horizontal') {
      return {
        x: entry.coordinate,
        y: rangeObj.y
      };
    }
    if (layout === 'vertical') {
      return {
        x: rangeObj.x,
        y: entry.coordinate
      };
    }
    if (layout === 'centric') {
      var _angle = entry.coordinate;
      var {
        radius: _radius
      } = rangeObj;
      return _objectSpread(_objectSpread(_objectSpread({}, rangeObj), (0, _PolarUtils.polarToCartesian)(rangeObj.cx, rangeObj.cy, _radius, _angle)), {}, {
        angle: _angle,
        radius: _radius
      });
    }
    var radius = entry.coordinate;
    var {
      angle
    } = rangeObj;
    return _objectSpread(_objectSpread(_objectSpread({}, rangeObj), (0, _PolarUtils.polarToCartesian)(rangeObj.cx, rangeObj.cy, radius, angle)), {}, {
      angle,
      radius
    });
  }
  return originCoordinate;
};
var getDisplayedData = (data, _ref) => {
  var {
    graphicalItems,
    dataStartIndex,
    dataEndIndex
  } = _ref;
  var itemsData = (graphicalItems !== null && graphicalItems !== void 0 ? graphicalItems : []).reduce((result, child) => {
    var itemData = child.props.data;
    if (itemData && itemData.length) {
      return [...result, ...itemData];
    }
    return result;
  }, []);
  if (itemsData.length > 0) {
    return itemsData;
  }
  if (data && data.length && (0, _DataUtils.isNumber)(dataStartIndex) && (0, _DataUtils.isNumber)(dataEndIndex)) {
    return data.slice(dataStartIndex, dataEndIndex + 1);
  }
  return [];
};
function getDefaultDomainByAxisType(axisType) {
  return axisType === 'number' ? [0, 'auto'] : undefined;
}

/**
 * Get the content to be displayed in the tooltip
 * @param  {Object} state          Current state
 * @param  {Array}  chartData      The data defined in chart
 * @param  {Number} activeIndex    Active index of data
 * @param  {String} activeLabel    Active label of data
 * @return {Array}                 The content of tooltip
 */
var getTooltipContent = (state, chartData, activeIndex, activeLabel) => {
  var {
    graphicalItems,
    tooltipAxis
  } = state;
  var displayedData = getDisplayedData(chartData, state);
  if (activeIndex < 0 || !graphicalItems || !graphicalItems.length || activeIndex >= displayedData.length) {
    return null;
  }
  // get data by activeIndex when the axis don't allow duplicated category
  return graphicalItems.reduce((result, child) => {
    var _child$props$data;
    /**
     * Fixes: https://github.com/recharts/recharts/issues/3669
     * Defaulting to chartData below to fix an edge case where the tooltip does not include data from all charts
     * when a separate dataset is passed to chart prop data and specified on Line/Area/etc prop data
     */
    var data = (_child$props$data = child.props.data) !== null && _child$props$data !== void 0 ? _child$props$data : chartData;
    if (data && state.dataStartIndex + state.dataEndIndex !== 0) {
      data = data.slice(state.dataStartIndex, state.dataEndIndex + 1);
    }
    var payload;
    if (tooltipAxis.dataKey && !tooltipAxis.allowDuplicatedCategory) {
      // graphic child has data props
      var entries = data === undefined ? displayedData : data;
      payload = (0, _DataUtils.findEntryInArray)(entries, tooltipAxis.dataKey, activeLabel);
    } else {
      payload = data && data[activeIndex] || displayedData[activeIndex];
    }
    if (!payload) {
      return result;
    }

    // @ts-expect-error missing types
    return [...result, (0, _ChartUtils.getTooltipItem)(child, payload)];
  }, []);
};

/**
 * Returns tooltip data based on a mouse position (as a parameter or in state)
 * @param  state      current state
 * @param  chartData  the data defined in chart
 * @param  layout     The layout type of chart
 * @param  rangeObj   coordinates
 * @return            Tooltip data
 */
var getTooltipData = (state, chartData, layout, rangeObj) => {
  var rangeData = rangeObj || {
    x: state.chartX,
    y: state.chartY
  };
  var pos = calculateTooltipPos(rangeData, layout);
  var {
    orderedTooltipTicks: ticks,
    tooltipAxis: axis,
    tooltipTicks
  } = state;
  var activeIndex = (0, _ChartUtils.calculateActiveTickIndex)(pos, ticks, tooltipTicks, axis);
  if (activeIndex >= 0 && tooltipTicks) {
    var activeLabel = tooltipTicks[activeIndex] && tooltipTicks[activeIndex].value;
    var activePayload = getTooltipContent(state, chartData, activeIndex, activeLabel);
    var activeCoordinate = getActiveCoordinate(layout, ticks, activeIndex, rangeData);
    return {
      activeTooltipIndex: activeIndex,
      activeLabel,
      activePayload,
      activeCoordinate
    };
  }
  return null;
};

/**
 * Get the configuration of axis by the options of axis instance
 * @param  {Object} props         Latest props
 * @param {Array}  axes           The instance of axes
 * @param  {Array} graphicalItems The instances of item
 * @param  {String} axisType      The type of axis, xAxis - x-axis, yAxis - y-axis
 * @param  {String} axisIdKey     The unique id of an axis
 * @param  {Object} stackGroups   The items grouped by axisId and stackId
 * @param {Number} dataStartIndex The start index of the data series when a brush is applied
 * @param {Number} dataEndIndex   The end index of the data series when a brush is applied
 * @return {Object}      Configuration
 */
var getAxisMapByAxes = (props, _ref2) => {
  var {
    axes,
    graphicalItems,
    axisType,
    axisIdKey,
    stackGroups,
    dataStartIndex,
    dataEndIndex
  } = _ref2;
  var {
    layout,
    children,
    stackOffset
  } = props;
  var isCategorical = (0, _ChartUtils.isCategoricalAxis)(layout, axisType);

  // Eliminate duplicated axes
  return axes.reduce((result, child) => {
    var _child$props$domain2;
    var {
      type,
      dataKey,
      allowDataOverflow,
      allowDuplicatedCategory,
      scale,
      ticks,
      includeHidden
    } = child.props;
    var axisId = child.props[axisIdKey];
    if (result[axisId]) {
      return result;
    }
    var displayedData = getDisplayedData(props.data, {
      graphicalItems: graphicalItems.filter(item => item.props[axisIdKey] === axisId),
      dataStartIndex,
      dataEndIndex
    });
    var len = displayedData.length;
    var domain, duplicateDomain, categoricalDomain;

    /*
     * This is a hack to short-circuit the domain creation here to enhance performance.
     * Usually, the data is used to determine the domain, but when the user specifies
     * a domain upfront (via props), there is no need to calculate the domain start and end,
     * which is very expensive for a larger amount of data.
     * The only thing that would prohibit short-circuiting is when the user doesn't allow data overflow,
     * because the axis is supposed to ignore the specified domain that way.
     */
    if ((0, _isDomainSpecifiedByUser.isDomainSpecifiedByUser)(child.props.domain, allowDataOverflow, type)) {
      domain = (0, _ChartUtils.parseSpecifiedDomain)(child.props.domain, null, allowDataOverflow);
      /* The chart can be categorical and have the domain specified in numbers
       * we still need to calculate the categorical domain
       * TODO: refactor this more
       */
      if (isCategorical && (type === 'number' || scale !== 'auto')) {
        categoricalDomain = (0, _ChartUtils.getDomainOfDataByKey)(displayedData, dataKey, 'category');
      }
    }

    // if the domain is defaulted we need this for `originalDomain` as well
    var defaultDomain = getDefaultDomainByAxisType(type);

    // we didn't create the domain from user's props above, so we need to calculate it
    if (!domain || domain.length === 0) {
      var _child$props$domain;
      var childDomain = (_child$props$domain = child.props.domain) !== null && _child$props$domain !== void 0 ? _child$props$domain : defaultDomain;
      if (dataKey) {
        // has dataKey in <Axis />
        domain = (0, _ChartUtils.getDomainOfDataByKey)(displayedData, dataKey, type);
        if (type === 'category' && isCategorical) {
          // the field type is category data and this axis is categorical axis
          var duplicate = (0, _DataUtils.hasDuplicate)(domain);
          if (allowDuplicatedCategory && duplicate) {
            duplicateDomain = domain;
            // When category axis has duplicated text, serial numbers are used to generate scale
            domain = (0, _range.default)(0, len);
          } else if (!allowDuplicatedCategory) {
            // remove duplicated category
            domain = (0, _ChartUtils.parseDomainOfCategoryAxis)(childDomain, domain, child).reduce((finalDomain, entry) => finalDomain.indexOf(entry) >= 0 ? finalDomain : [...finalDomain, entry], []);
          }
        } else if (type === 'category') {
          // the field type is category data and this axis is numerical axis
          if (!allowDuplicatedCategory) {
            domain = (0, _ChartUtils.parseDomainOfCategoryAxis)(childDomain, domain, child).reduce((finalDomain, entry) => finalDomain.indexOf(entry) >= 0 || entry === '' || (0, _isNil.default)(entry) ? finalDomain : [...finalDomain, entry], []);
          } else {
            // eliminate undefined or null or empty string
            domain = domain.filter(entry => entry !== '' && !(0, _isNil.default)(entry));
          }
        } else if (type === 'number') {
          // the field type is numerical
          var errorBarsDomain = (0, _ChartUtils.parseErrorBarsOfAxis)(displayedData, graphicalItems.filter(item => item.props[axisIdKey] === axisId && (includeHidden || !item.props.hide)), dataKey, axisType, layout);
          if (errorBarsDomain) {
            domain = errorBarsDomain;
          }
        }
        if (isCategorical && (type === 'number' || scale !== 'auto')) {
          categoricalDomain = (0, _ChartUtils.getDomainOfDataByKey)(displayedData, dataKey, 'category');
        }
      } else if (isCategorical) {
        // the axis is a categorical axis
        domain = (0, _range.default)(0, len);
      } else if (stackGroups && stackGroups[axisId] && stackGroups[axisId].hasStack && type === 'number') {
        // when stackOffset is 'expand', the domain may be calculated as [0, 1.000000000002]
        domain = stackOffset === 'expand' ? [0, 1] : (0, _ChartUtils.getDomainOfStackGroups)(stackGroups[axisId].stackGroups, dataStartIndex, dataEndIndex);
      } else {
        domain = (0, _ChartUtils.getDomainOfItemsWithSameAxis)(displayedData, graphicalItems.filter(item => item.props[axisIdKey] === axisId && (includeHidden || !item.props.hide)), type, layout, true);
      }
      if (type === 'number') {
        // To detect wether there is any reference lines whose props ifOverflow is extendDomain
        domain = (0, _DetectReferenceElementsDomain.detectReferenceElementsDomain)(children, domain, axisId, axisType, ticks);
        if (childDomain) {
          domain = (0, _ChartUtils.parseSpecifiedDomain)(childDomain, domain, allowDataOverflow);
        }
      } else if (type === 'category' && childDomain) {
        var axisDomain = childDomain;
        var isDomainValid = domain.every(entry => axisDomain.indexOf(entry) >= 0);
        if (isDomainValid) {
          domain = axisDomain;
        }
      }
    }
    return _objectSpread(_objectSpread({}, result), {}, {
      [axisId]: _objectSpread(_objectSpread({}, child.props), {}, {
        axisType,
        domain,
        categoricalDomain,
        duplicateDomain,
        originalDomain: (_child$props$domain2 = child.props.domain) !== null && _child$props$domain2 !== void 0 ? _child$props$domain2 : defaultDomain,
        isCategorical,
        layout
      })
    });
  }, {});
};

/**
 * Get the configuration of axis by the options of item,
 * this kind of axis does not display in chart
 * @param  {Object} props         Latest props
 * @param  {Array} graphicalItems The instances of item
 * @param  {ReactElement} Axis    Axis Component
 * @param  {String} axisType      The type of axis, xAxis - x-axis, yAxis - y-axis
 * @param  {String} axisIdKey     The unique id of an axis
 * @param  {Object} stackGroups   The items grouped by axisId and stackId
 * @param {Number} dataStartIndex The start index of the data series when a brush is applied
 * @param {Number} dataEndIndex   The end index of the data series when a brush is applied
 * @return {Object}               Configuration
 */
exports.getAxisMapByAxes = getAxisMapByAxes;
var getAxisMapByItems = (props, _ref3) => {
  var {
    graphicalItems,
    Axis,
    axisType,
    axisIdKey,
    stackGroups,
    dataStartIndex,
    dataEndIndex
  } = _ref3;
  var {
    layout,
    children
  } = props;
  var displayedData = getDisplayedData(props.data, {
    graphicalItems,
    dataStartIndex,
    dataEndIndex
  });
  var len = displayedData.length;
  var isCategorical = (0, _ChartUtils.isCategoricalAxis)(layout, axisType);
  var index = -1;

  // The default type of x-axis is category axis,
  // The default contents of x-axis is the serial numbers of data
  // The default type of y-axis is number axis
  // The default contents of y-axis is the domain of data
  return graphicalItems.reduce((result, child) => {
    var axisId = child.props[axisIdKey];
    var originalDomain = getDefaultDomainByAxisType('number');
    if (!result[axisId]) {
      index++;
      var domain;
      if (isCategorical) {
        domain = (0, _range.default)(0, len);
      } else if (stackGroups && stackGroups[axisId] && stackGroups[axisId].hasStack) {
        domain = (0, _ChartUtils.getDomainOfStackGroups)(stackGroups[axisId].stackGroups, dataStartIndex, dataEndIndex);
        domain = (0, _DetectReferenceElementsDomain.detectReferenceElementsDomain)(children, domain, axisId, axisType);
      } else {
        domain = (0, _ChartUtils.parseSpecifiedDomain)(originalDomain, (0, _ChartUtils.getDomainOfItemsWithSameAxis)(displayedData, graphicalItems.filter(item => item.props[axisIdKey] === axisId && !item.props.hide), 'number', layout), Axis.defaultProps.allowDataOverflow);
        domain = (0, _DetectReferenceElementsDomain.detectReferenceElementsDomain)(children, domain, axisId, axisType);
      }
      return _objectSpread(_objectSpread({}, result), {}, {
        [axisId]: _objectSpread(_objectSpread({
          axisType
        }, Axis.defaultProps), {}, {
          hide: true,
          orientation: (0, _get.default)(ORIENT_MAP, "".concat(axisType, ".").concat(index % 2), null),
          domain,
          originalDomain,
          isCategorical,
          layout
          // specify scale when no Axis
          // scale: isCategorical ? 'band' : 'linear',
        })
      });
    }
    return result;
  }, {});
};

/**
 * Get the configuration of all x-axis or y-axis
 * @param  {Object} props          Latest props
 * @param  {String} axisType       The type of axis
 * @param  {React.ComponentType}  [AxisComp]      Axis Component
 * @param  {Array}  graphicalItems The instances of item
 * @param  {Object} stackGroups    The items grouped by axisId and stackId
 * @param {Number} dataStartIndex  The start index of the data series when a brush is applied
 * @param {Number} dataEndIndex    The end index of the data series when a brush is applied
 * @return {Object}          Configuration
 */
var getAxisMap = (props, _ref4) => {
  var {
    axisType = 'xAxis',
    AxisComp,
    graphicalItems,
    stackGroups,
    dataStartIndex,
    dataEndIndex
  } = _ref4;
  var {
    children
  } = props;
  var axisIdKey = "".concat(axisType, "Id");
  // Get all the instance of Axis
  var axes = (0, _ReactUtils.findAllByType)(children, AxisComp);
  var axisMap = {};
  if (axes && axes.length) {
    axisMap = getAxisMapByAxes(props, {
      axes,
      graphicalItems,
      axisType,
      axisIdKey,
      stackGroups,
      dataStartIndex,
      dataEndIndex
    });
  } else if (graphicalItems && graphicalItems.length) {
    axisMap = getAxisMapByItems(props, {
      Axis: AxisComp,
      graphicalItems,
      axisType,
      axisIdKey,
      stackGroups,
      dataStartIndex,
      dataEndIndex
    });
  }
  return axisMap;
};
var tooltipTicksGenerator = axisMap => {
  var axis = (0, _DataUtils.getAnyElementOfObject)(axisMap);
  var tooltipTicks = (0, _ChartUtils.getTicksOfAxis)(axis, false, true);
  return {
    tooltipTicks,
    orderedTooltipTicks: (0, _sortBy.default)(tooltipTicks, o => o.coordinate),
    tooltipAxis: axis,
    tooltipAxisBandSize: (0, _ChartUtils.getBandSizeOfAxis)(axis, tooltipTicks)
  };
};

/**
 * Returns default, reset state for the categorical chart.
 * @param {Object} props Props object to use when creating the default state
 * @return {Object} Whole new state
 */
var createDefaultState = props => {
  var {
    children,
    defaultShowTooltip
  } = props;
  var brushItem = (0, _ReactUtils.findChildByType)(children, _Brush.Brush);
  var startIndex = 0;
  var endIndex = 0;
  if (props.data && props.data.length !== 0) {
    endIndex = props.data.length - 1;
  }
  if (brushItem && brushItem.props) {
    if (brushItem.props.startIndex >= 0) {
      startIndex = brushItem.props.startIndex;
    }
    if (brushItem.props.endIndex >= 0) {
      endIndex = brushItem.props.endIndex;
    }
  }
  return {
    chartX: 0,
    chartY: 0,
    dataStartIndex: startIndex,
    dataEndIndex: endIndex,
    activeTooltipIndex: -1,
    isTooltipActive: Boolean(defaultShowTooltip)
  };
};
exports.createDefaultState = createDefaultState;
var hasGraphicalBarItem = graphicalItems => {
  if (!graphicalItems || !graphicalItems.length) {
    return false;
  }
  return graphicalItems.some(item => {
    var name = (0, _ReactUtils.getDisplayName)(item && item.type);
    return name && name.indexOf('Bar') >= 0;
  });
};
var getAxisNameByLayout = layout => {
  if (layout === 'horizontal') {
    return {
      numericAxisName: 'yAxis',
      cateAxisName: 'xAxis'
    };
  }
  if (layout === 'vertical') {
    return {
      numericAxisName: 'xAxis',
      cateAxisName: 'yAxis'
    };
  }
  if (layout === 'centric') {
    return {
      numericAxisName: 'radiusAxis',
      cateAxisName: 'angleAxis'
    };
  }
  return {
    numericAxisName: 'angleAxis',
    cateAxisName: 'radiusAxis'
  };
};

/**
 * Calculate the offset of main part in the svg element
 * @param  {Object} params.props          Latest props
 * @param  {Array}  params.graphicalItems The instances of item
 * @param  {Object} params.xAxisMap       The configuration of x-axis
 * @param  {Object} params.yAxisMap       The configuration of y-axis
 * @param  {Object} prevLegendBBox        The boundary box of legend
 * @return {Object} The offset of main part in the svg element
 */
var calculateOffset = (_ref5, prevLegendBBox) => {
  var {
    props,
    xAxisMap = {},
    yAxisMap = {}
  } = _ref5;
  var {
    width,
    height,
    children
  } = props;
  var margin = props.margin || {};
  var brushItem = (0, _ReactUtils.findChildByType)(children, _Brush.Brush);
  var legendItem = (0, _ReactUtils.findChildByType)(children, _Legend.Legend);
  var offsetH = Object.keys(yAxisMap).reduce((result, id) => {
    var entry = yAxisMap[id];
    var {
      orientation
    } = entry;
    if (!entry.mirror && !entry.hide) {
      return _objectSpread(_objectSpread({}, result), {}, {
        [orientation]: result[orientation] + entry.width
      });
    }
    return result;
  }, {
    left: margin.left || 0,
    right: margin.right || 0
  });
  var offsetV = Object.keys(xAxisMap).reduce((result, id) => {
    var entry = xAxisMap[id];
    var {
      orientation
    } = entry;
    if (!entry.mirror && !entry.hide) {
      return _objectSpread(_objectSpread({}, result), {}, {
        [orientation]: (0, _get.default)(result, "".concat(orientation)) + entry.height
      });
    }
    return result;
  }, {
    top: margin.top || 0,
    bottom: margin.bottom || 0
  });
  var offset = _objectSpread(_objectSpread({}, offsetV), offsetH);
  var brushBottom = offset.bottom;
  if (brushItem) {
    offset.bottom += brushItem.props.height || _Brush.Brush.defaultProps.height;
  }
  if (legendItem && prevLegendBBox) {
    // @ts-expect-error margin is optional in props but required in appendOffsetOfLegend
    offset = (0, _ChartUtils.appendOffsetOfLegend)(offset, props, prevLegendBBox);
  }
  var offsetWidth = width - offset.left - offset.right;
  var offsetHeight = height - offset.top - offset.bottom;
  return _objectSpread(_objectSpread({
    brushBottom
  }, offset), {}, {
    // never return negative values for height and width
    width: Math.max(offsetWidth, 0),
    height: Math.max(offsetHeight, 0)
  });
};
var generateCategoricalChart = _ref6 => {
  var _CategoricalChartWrapper;
  var {
    chartName,
    GraphicalChild,
    defaultTooltipEventType = 'axis',
    validateTooltipEventTypes = ['axis'],
    axisComponents,
    formatAxisMap,
    defaultProps
  } = _ref6;
  var getFormatItems = (props, currentState) => {
    var {
      graphicalItems,
      stackGroups,
      offset,
      updateId,
      dataStartIndex,
      dataEndIndex
    } = currentState;
    var {
      barSize,
      layout,
      barGap,
      barCategoryGap,
      maxBarSize: globalMaxBarSize
    } = props;
    var {
      numericAxisName,
      cateAxisName
    } = getAxisNameByLayout(layout);
    var hasBar = hasGraphicalBarItem(graphicalItems);
    var sizeList = hasBar && (0, _ChartUtils.getBarSizeList)({
      barSize,
      stackGroups
    });
    var formattedItems = [];
    graphicalItems.forEach((item, index) => {
      var displayedData = getDisplayedData(props.data, {
        graphicalItems: [item],
        dataStartIndex,
        dataEndIndex
      });
      var {
        dataKey,
        maxBarSize: childMaxBarSize
      } = item.props;
      // axisId of the numerical axis
      var numericAxisId = item.props["".concat(numericAxisName, "Id")];
      // axisId of the categorical axis
      var cateAxisId = item.props["".concat(cateAxisName, "Id")];
      var axisObjInitialValue = {};
      var axisObj = axisComponents.reduce((result, entry) => {
        var _item$type$displayNam, _item$type;
        // map of axisId to axis for a specific axis type
        var axisMap = currentState["".concat(entry.axisType, "Map")];
        // axisId of axis we are currently computing
        var id = item.props["".concat(entry.axisType, "Id")];

        /**
         * tell the user in dev mode that their configuration is incorrect if we cannot find a match between
         * axisId on the chart and axisId on the axis. zAxis does not get passed in the map for ComposedChart,
         * leave it out of the check for now.
         */
        !(axisMap && axisMap[id] || entry.axisType === 'zAxis') ? process.env.NODE_ENV !== "production" ? (0, _tinyInvariant.default)(false, "Specifying a(n) ".concat(entry.axisType, "Id requires a corresponding ").concat(entry.axisType
        // @ts-expect-error we should stop reading data from ReactElements
        , "Id on the targeted graphical component ").concat((_item$type$displayNam = item === null || item === void 0 || (_item$type = item.type) === null || _item$type === void 0 ? void 0 : _item$type.displayName) !== null && _item$type$displayNam !== void 0 ? _item$type$displayNam : '')) : (0, _tinyInvariant.default)(false) : void 0;

        // the axis we are currently formatting
        var axis = axisMap[id];
        return _objectSpread(_objectSpread({}, result), {}, {
          [entry.axisType]: axis,
          ["".concat(entry.axisType, "Ticks")]: (0, _ChartUtils.getTicksOfAxis)(axis)
        });
      }, axisObjInitialValue);
      var cateAxis = axisObj[cateAxisName];
      var cateTicks = axisObj["".concat(cateAxisName, "Ticks")];
      var stackedData = stackGroups && stackGroups[numericAxisId] && stackGroups[numericAxisId].hasStack && (0, _ChartUtils.getStackedDataOfItem)(item, stackGroups[numericAxisId].stackGroups);
      var itemIsBar = (0, _ReactUtils.getDisplayName)(item.type).indexOf('Bar') >= 0;
      var bandSize = (0, _ChartUtils.getBandSizeOfAxis)(cateAxis, cateTicks);
      var barPosition = [];
      if (itemIsBar) {
        var _ref7, _getBandSizeOfAxis;
        // 如果是bar，计算bar的位置
        var maxBarSize = (0, _isNil.default)(childMaxBarSize) ? globalMaxBarSize : childMaxBarSize;
        var barBandSize = (_ref7 = (_getBandSizeOfAxis = (0, _ChartUtils.getBandSizeOfAxis)(cateAxis, cateTicks, true)) !== null && _getBandSizeOfAxis !== void 0 ? _getBandSizeOfAxis : maxBarSize) !== null && _ref7 !== void 0 ? _ref7 : 0;
        barPosition = (0, _ChartUtils.getBarPosition)({
          barGap,
          barCategoryGap,
          bandSize: barBandSize !== bandSize ? barBandSize : bandSize,
          sizeList: sizeList[cateAxisId],
          maxBarSize
        });
        if (barBandSize !== bandSize) {
          barPosition = barPosition.map(pos => _objectSpread(_objectSpread({}, pos), {}, {
            position: _objectSpread(_objectSpread({}, pos.position), {}, {
              offset: pos.position.offset - barBandSize / 2
            })
          }));
        }
      }
      // @ts-expect-error we should stop reading data from ReactElements
      var composedFn = item && item.type && item.type.getComposedData;
      if (composedFn) {
        formattedItems.push({
          props: _objectSpread(_objectSpread({}, composedFn(_objectSpread(_objectSpread({}, axisObj), {}, {
            displayedData,
            props,
            dataKey,
            item,
            bandSize,
            barPosition,
            offset,
            stackedData,
            layout,
            dataStartIndex,
            dataEndIndex
          }))), {}, {
            key: item.key || "item-".concat(index),
            [numericAxisName]: axisObj[numericAxisName],
            [cateAxisName]: axisObj[cateAxisName],
            animationId: updateId
          }),
          childIndex: (0, _ReactUtils.parseChildIndex)(item, props.children),
          item
        });
      }
    });
    return formattedItems;
  };

  /**
   * The AxisMaps are expensive to render on large data sets
   * so provide the ability to store them in state and only update them when necessary
   * they are dependent upon the start and end index of
   * the brush so it's important that this method is called _after_
   * the state is updated with any new start/end indices
   *
   * @param {Object} props          The props object to be used for updating the axismaps
   * dataStartIndex: The start index of the data series when a brush is applied
   * dataEndIndex: The end index of the data series when a brush is applied
   * updateId: The update id
   * @param {Object} prevState      Prev state
   * @return {Object} state New state to set
   */
  var updateStateOfAxisMapsOffsetAndStackGroups = (_ref8, prevState) => {
    var {
      props,
      dataStartIndex,
      dataEndIndex,
      updateId
    } = _ref8;
    if (!(0, _ReactUtils.validateWidthHeight)({
      props
    })) {
      return null;
    }
    var {
      children,
      layout,
      stackOffset,
      data,
      reverseStackOrder
    } = props;
    var {
      numericAxisName,
      cateAxisName
    } = getAxisNameByLayout(layout);
    var graphicalItems = (0, _ReactUtils.findAllByType)(children, GraphicalChild);
    var stackGroups = (0, _ChartUtils.getStackGroupsByAxisId)(data, graphicalItems, "".concat(numericAxisName, "Id"), "".concat(cateAxisName, "Id"), stackOffset, reverseStackOrder);
    var axisObj = axisComponents.reduce((result, entry) => {
      var name = "".concat(entry.axisType, "Map");
      return _objectSpread(_objectSpread({}, result), {}, {
        [name]: getAxisMap(props, _objectSpread(_objectSpread({}, entry), {}, {
          graphicalItems,
          stackGroups: entry.axisType === numericAxisName && stackGroups,
          dataStartIndex,
          dataEndIndex
        }))
      });
    }, {});
    var offset = calculateOffset(_objectSpread(_objectSpread({}, axisObj), {}, {
      props
    }), prevState === null || prevState === void 0 ? void 0 : prevState.legendBBox);
    Object.keys(axisObj).forEach(key => {
      axisObj[key] = formatAxisMap(props, axisObj[key], offset, key.replace('Map', ''), chartName);
    });
    var cateAxisMap = axisObj["".concat(cateAxisName, "Map")];
    var ticksObj = tooltipTicksGenerator(cateAxisMap);
    var formattedGraphicalItems = getFormatItems(props, _objectSpread(_objectSpread({}, axisObj), {}, {
      dataStartIndex,
      dataEndIndex,
      updateId,
      graphicalItems,
      stackGroups,
      offset
    }));
    return _objectSpread(_objectSpread({
      formattedGraphicalItems,
      graphicalItems,
      offset,
      stackGroups
    }, ticksObj), axisObj);
  };
  return _CategoricalChartWrapper = class CategoricalChartWrapper extends _react.Component {
    constructor(props) {
      var _props$id, _props$throttleDelay;
      super(props);
      _defineProperty(this, "eventEmitterSymbol", Symbol('rechartsEventEmitter'));
      _defineProperty(this, "accessibilityManager", new _AccessibilityManager.AccessibilityManager());
      _defineProperty(this, "handleLegendBBoxUpdate", box => {
        if (box) {
          var {
            dataStartIndex,
            dataEndIndex,
            updateId
          } = this.state;
          this.setState(_objectSpread({
            legendBBox: box
          }, updateStateOfAxisMapsOffsetAndStackGroups({
            props: this.props,
            dataStartIndex,
            dataEndIndex,
            updateId
          }, _objectSpread(_objectSpread({}, this.state), {}, {
            legendBBox: box
          }))));
        }
      });
      _defineProperty(this, "handleReceiveSyncEvent", (cId, data, emitter) => {
        if (this.props.syncId === cId) {
          if (emitter === this.eventEmitterSymbol && typeof this.props.syncMethod !== 'function') {
            return;
          }
          this.applySyncEvent(data);
        }
      });
      _defineProperty(this, "handleBrushChange", _ref9 => {
        var {
          startIndex,
          endIndex
        } = _ref9;
        // Only trigger changes if the extents of the brush have actually changed
        if (startIndex !== this.state.dataStartIndex || endIndex !== this.state.dataEndIndex) {
          var {
            updateId
          } = this.state;
          this.setState(() => _objectSpread({
            dataStartIndex: startIndex,
            dataEndIndex: endIndex
          }, updateStateOfAxisMapsOffsetAndStackGroups({
            props: this.props,
            dataStartIndex: startIndex,
            dataEndIndex: endIndex,
            updateId
          }, this.state)));
          this.triggerSyncEvent({
            dataStartIndex: startIndex,
            dataEndIndex: endIndex
          });
        }
      });
      /**
       * The handler of mouse entering chart
       * @param  {Object} e              Event object
       * @return {Null}                  null
       */
      _defineProperty(this, "handleMouseEnter", e => {
        var mouse = this.getMouseInfo(e);
        if (mouse) {
          var _nextState = _objectSpread(_objectSpread({}, mouse), {}, {
            isTooltipActive: true
          });
          this.setState(_nextState);
          this.triggerSyncEvent(_nextState);
          var {
            onMouseEnter
          } = this.props;
          if ((0, _isFunction.default)(onMouseEnter)) {
            onMouseEnter(_nextState, e);
          }
        }
      });
      _defineProperty(this, "triggeredAfterMouseMove", e => {
        var mouse = this.getMouseInfo(e);
        var nextState = mouse ? _objectSpread(_objectSpread({}, mouse), {}, {
          isTooltipActive: true
        }) : {
          isTooltipActive: false
        };
        this.setState(nextState);
        this.triggerSyncEvent(nextState);
        var {
          onMouseMove
        } = this.props;
        if ((0, _isFunction.default)(onMouseMove)) {
          onMouseMove(nextState, e);
        }
      });
      /**
       * The handler of mouse entering a scatter
       * @param {Object} el The active scatter
       * @return {Object} no return
       */
      _defineProperty(this, "handleItemMouseEnter", el => {
        this.setState(() => ({
          isTooltipActive: true,
          activeItem: el,
          activePayload: el.tooltipPayload,
          activeCoordinate: el.tooltipPosition || {
            x: el.cx,
            y: el.cy
          }
        }));
      });
      /**
       * The handler of mouse leaving a scatter
       * @return {Object} no return
       */
      _defineProperty(this, "handleItemMouseLeave", () => {
        this.setState(() => ({
          isTooltipActive: false
        }));
      });
      /**
       * The handler of mouse moving in chart
       * @param  {React.MouseEvent} e        Event object
       * @return {void} no return
       */
      _defineProperty(this, "handleMouseMove", e => {
        e.persist();
        this.throttleTriggeredAfterMouseMove(e);
      });
      /**
       * The handler if mouse leaving chart
       * @param {Object} e Event object
       * @return {Null} no return
       */
      _defineProperty(this, "handleMouseLeave", e => {
        this.throttleTriggeredAfterMouseMove.cancel();
        var nextState = {
          isTooltipActive: false
        };
        this.setState(nextState);
        this.triggerSyncEvent(nextState);
        var {
          onMouseLeave
        } = this.props;
        if ((0, _isFunction.default)(onMouseLeave)) {
          onMouseLeave(nextState, e);
        }
      });
      _defineProperty(this, "handleOuterEvent", e => {
        var eventName = (0, _ReactUtils.getReactEventByType)(e);
        var event = (0, _get.default)(this.props, "".concat(eventName));
        if (eventName && (0, _isFunction.default)(event)) {
          var _mouse;
          var mouse;
          if (/.*touch.*/i.test(eventName)) {
            mouse = this.getMouseInfo(e.changedTouches[0]);
          } else {
            mouse = this.getMouseInfo(e);
          }
          event((_mouse = mouse) !== null && _mouse !== void 0 ? _mouse : {}, e);
        }
      });
      _defineProperty(this, "handleClick", e => {
        var mouse = this.getMouseInfo(e);
        if (mouse) {
          var _nextState2 = _objectSpread(_objectSpread({}, mouse), {}, {
            isTooltipActive: true
          });
          this.setState(_nextState2);
          this.triggerSyncEvent(_nextState2);
          var {
            onClick
          } = this.props;
          if ((0, _isFunction.default)(onClick)) {
            onClick(_nextState2, e);
          }
        }
      });
      _defineProperty(this, "handleMouseDown", e => {
        var {
          onMouseDown
        } = this.props;
        if ((0, _isFunction.default)(onMouseDown)) {
          var _nextState3 = this.getMouseInfo(e);
          onMouseDown(_nextState3, e);
        }
      });
      _defineProperty(this, "handleMouseUp", e => {
        var {
          onMouseUp
        } = this.props;
        if ((0, _isFunction.default)(onMouseUp)) {
          var _nextState4 = this.getMouseInfo(e);
          onMouseUp(_nextState4, e);
        }
      });
      _defineProperty(this, "handleTouchMove", e => {
        if (e.changedTouches != null && e.changedTouches.length > 0) {
          this.throttleTriggeredAfterMouseMove(e.changedTouches[0]);
        }
      });
      _defineProperty(this, "handleTouchStart", e => {
        if (e.changedTouches != null && e.changedTouches.length > 0) {
          this.handleMouseDown(e.changedTouches[0]);
        }
      });
      _defineProperty(this, "handleTouchEnd", e => {
        if (e.changedTouches != null && e.changedTouches.length > 0) {
          this.handleMouseUp(e.changedTouches[0]);
        }
      });
      _defineProperty(this, "triggerSyncEvent", data => {
        if (this.props.syncId !== undefined) {
          _Events.eventCenter.emit(_Events.SYNC_EVENT, this.props.syncId, data, this.eventEmitterSymbol);
        }
      });
      _defineProperty(this, "applySyncEvent", data => {
        var {
          layout,
          syncMethod
        } = this.props;
        var {
          updateId
        } = this.state;
        var {
          dataStartIndex,
          dataEndIndex
        } = data;
        if (data.dataStartIndex !== undefined || data.dataEndIndex !== undefined) {
          this.setState(_objectSpread({
            dataStartIndex,
            dataEndIndex
          }, updateStateOfAxisMapsOffsetAndStackGroups({
            props: this.props,
            dataStartIndex,
            dataEndIndex,
            updateId
          }, this.state)));
        } else if (data.activeTooltipIndex !== undefined) {
          var {
            chartX,
            chartY
          } = data;
          var {
            activeTooltipIndex
          } = data;
          var {
            offset,
            tooltipTicks
          } = this.state;
          if (!offset) {
            return;
          }
          if (typeof syncMethod === 'function') {
            // Call a callback function. If there is an application specific algorithm
            activeTooltipIndex = syncMethod(tooltipTicks, data);
          } else if (syncMethod === 'value') {
            // Set activeTooltipIndex to the index with the same value as data.activeLabel
            // For loop instead of findIndex because the latter is very slow in some browsers
            activeTooltipIndex = -1; // in case we cannot find the element
            for (var i = 0; i < tooltipTicks.length; i++) {
              if (tooltipTicks[i].value === data.activeLabel) {
                activeTooltipIndex = i;
                break;
              }
            }
          }
          var viewBox = _objectSpread(_objectSpread({}, offset), {}, {
            x: offset.left,
            y: offset.top
          });
          // When a categorical chart is combined with another chart, the value of chartX
          // and chartY may beyond the boundaries.
          var validateChartX = Math.min(chartX, viewBox.x + viewBox.width);
          var validateChartY = Math.min(chartY, viewBox.y + viewBox.height);
          var activeLabel = tooltipTicks[activeTooltipIndex] && tooltipTicks[activeTooltipIndex].value;
          var activePayload = getTooltipContent(this.state, this.props.data, activeTooltipIndex);
          var activeCoordinate = tooltipTicks[activeTooltipIndex] ? {
            x: layout === 'horizontal' ? tooltipTicks[activeTooltipIndex].coordinate : validateChartX,
            y: layout === 'horizontal' ? validateChartY : tooltipTicks[activeTooltipIndex].coordinate
          } : originCoordinate;
          this.setState(_objectSpread(_objectSpread({}, data), {}, {
            activeLabel,
            activeCoordinate,
            activePayload,
            activeTooltipIndex
          }));
        } else {
          this.setState(data);
        }
      });
      _defineProperty(this, "renderCursor", element => {
        var {
          tooltipAxisBandSize
        } = this.state;
        var tooltipEventType = this.getTooltipEventType();
        var {
          layout
        } = this.props;
        var key = element.key || '_recharts-cursor';
        return /*#__PURE__*/_react.default.createElement(_Cursor.Cursor, {
          key: key,
          chartName: chartName,
          element: element,
          layout: layout,
          tooltipAxisBandSize: tooltipAxisBandSize,
          tooltipEventType: tooltipEventType
        });
      });
      /**
       * Draw Tooltip
       * @return {ReactElement}  The instance of Tooltip
       */
      _defineProperty(this, "renderTooltip", () => {
        var {
          children
        } = this.props;
        var tooltipItem = (0, _ReactUtils.findChildByType)(children, _Tooltip.Tooltip);
        return tooltipItem;
      });
      _defineProperty(this, "renderActivePoints", _ref10 => {
        var {
          item,
          activePoint,
          basePoint,
          childIndex,
          isRange
        } = _ref10;
        var result = [];
        // item.props is whatever getComposedData returns
        var {
          key
        } = item.props;
        // item.item.props are the original props on the DOM element
        var {
          activeDot,
          dataKey
        } = item.item.props;
        var dotProps = _objectSpread(_objectSpread({
          index: childIndex,
          dataKey,
          cx: activePoint.x,
          cy: activePoint.y,
          r: 4,
          fill: (0, _ChartUtils.getMainColorOfGraphicItem)(item.item),
          strokeWidth: 2,
          stroke: '#fff',
          payload: activePoint.payload,
          value: activePoint.value,
          key: "".concat(key, "-activePoint-").concat(childIndex)
        }, (0, _ReactUtils.filterProps)(activeDot, false)), (0, _types.adaptEventHandlers)(activeDot));
        result.push(CategoricalChartWrapper.renderActiveDot(activeDot, dotProps));
        if (basePoint) {
          result.push(CategoricalChartWrapper.renderActiveDot(activeDot, _objectSpread(_objectSpread({}, dotProps), {}, {
            cx: basePoint.x,
            cy: basePoint.y,
            key: "".concat(key, "-basePoint-").concat(childIndex)
          })));
        } else if (isRange) {
          result.push(null);
        }
        return result;
      });
      _defineProperty(this, "renderGraphicChild", (element, displayName, index) => {
        var item = this.filterFormatItem(element, displayName, index);
        if (!item) {
          return null;
        }
        var tooltipEventType = this.getTooltipEventType();
        var {
          isTooltipActive,
          tooltipAxis,
          activeTooltipIndex,
          activeLabel
        } = this.state;
        var {
          children
        } = this.props;
        var tooltipItem = (0, _ReactUtils.findChildByType)(children, _Tooltip.Tooltip);
        var {
          points,
          isRange,
          baseLine
        } = item.props;
        var {
          activeDot,
          hide,
          activeBar,
          activeShape
        } = item.item.props;
        var hasActive = Boolean(!hide && isTooltipActive && tooltipItem && (activeDot || activeBar || activeShape));
        var itemEvents = {};
        if (tooltipEventType !== 'axis' && tooltipItem && tooltipItem.props.trigger === 'click') {
          itemEvents = {
            onClick: (0, _ChartUtils.combineEventHandlers)(this.handleItemMouseEnter, element.props.onClick)
          };
        } else if (tooltipEventType !== 'axis') {
          itemEvents = {
            onMouseLeave: (0, _ChartUtils.combineEventHandlers)(this.handleItemMouseLeave, element.props.onMouseLeave),
            onMouseEnter: (0, _ChartUtils.combineEventHandlers)(this.handleItemMouseEnter, element.props.onMouseEnter)
          };
        }
        var graphicalItem = /*#__PURE__*/(0, _react.cloneElement)(element, _objectSpread(_objectSpread({}, item.props), itemEvents));
        function findWithPayload(entry) {
          // TODO needs to verify dataKey is Function
          return typeof tooltipAxis.dataKey === 'function' ? tooltipAxis.dataKey(entry.payload) : null;
        }
        if (hasActive) {
          if (activeTooltipIndex >= 0) {
            var activePoint, basePoint;
            if (tooltipAxis.dataKey && !tooltipAxis.allowDuplicatedCategory) {
              // number transform to string
              var specifiedKey = typeof tooltipAxis.dataKey === 'function' ? findWithPayload : 'payload.'.concat(tooltipAxis.dataKey.toString());
              activePoint = (0, _DataUtils.findEntryInArray)(points, specifiedKey, activeLabel);
              basePoint = isRange && baseLine && (0, _DataUtils.findEntryInArray)(baseLine, specifiedKey, activeLabel);
            } else {
              activePoint = points === null || points === void 0 ? void 0 : points[activeTooltipIndex];
              basePoint = isRange && baseLine && baseLine[activeTooltipIndex];
            }
            if (activeShape || activeBar) {
              var activeIndex = element.props.activeIndex !== undefined ? element.props.activeIndex : activeTooltipIndex;
              return [/*#__PURE__*/(0, _react.cloneElement)(element, _objectSpread(_objectSpread(_objectSpread({}, item.props), itemEvents), {}, {
                activeIndex
              })), null, null];
            }
            if (!(0, _isNil.default)(activePoint)) {
              return [graphicalItem, ...this.renderActivePoints({
                item,
                activePoint,
                basePoint,
                childIndex: activeTooltipIndex,
                isRange
              })];
            }
          } else {
            var _this$getItemByXY;
            /**
             * We hit this block if consumer uses a Tooltip without XAxis and/or YAxis.
             * In which case, this.state.activeTooltipIndex never gets set
             * because the mouse events that trigger that value getting set never get trigged without the axis components.
             *
             * An example usage case is a FunnelChart
             */
            var {
              graphicalItem: {
                item: xyItem = element,
                childIndex
              }
            } = (_this$getItemByXY = this.getItemByXY(this.state.activeCoordinate)) !== null && _this$getItemByXY !== void 0 ? _this$getItemByXY : {
              graphicalItem
            };
            var elementProps = _objectSpread(_objectSpread(_objectSpread({}, item.props), itemEvents), {}, {
              activeIndex: childIndex
            });
            return [/*#__PURE__*/(0, _react.cloneElement)(xyItem, elementProps), null, null];
          }
        }
        if (isRange) {
          return [graphicalItem, null, null];
        }
        return [graphicalItem, null];
      });
      _defineProperty(this, "renderCustomized", (element, displayName, index) => /*#__PURE__*/(0, _react.cloneElement)(element, _objectSpread(_objectSpread({
        key: "recharts-customized-".concat(index)
      }, this.props), this.state)));
      _defineProperty(this, "renderMap", {
        CartesianGrid: {
          handler: renderAsIs,
          once: true
        },
        ReferenceArea: {
          handler: renderAsIs
        },
        ReferenceLine: {
          handler: renderAsIs
        },
        ReferenceDot: {
          handler: renderAsIs
        },
        XAxis: {
          handler: renderAsIs
        },
        YAxis: {
          handler: renderAsIs
        },
        Brush: {
          handler: renderAsIs
        },
        Bar: {
          handler: this.renderGraphicChild
        },
        Line: {
          handler: this.renderGraphicChild
        },
        Area: {
          handler: this.renderGraphicChild
        },
        Radar: {
          handler: this.renderGraphicChild
        },
        RadialBar: {
          handler: this.renderGraphicChild
        },
        Scatter: {
          handler: this.renderGraphicChild
        },
        Pie: {
          handler: this.renderGraphicChild
        },
        Funnel: {
          handler: this.renderGraphicChild
        },
        Tooltip: {
          handler: this.renderCursor,
          once: true
        },
        PolarGrid: {
          handler: renderAsIs,
          once: true
        },
        PolarAngleAxis: {
          handler: renderAsIs
        },
        PolarRadiusAxis: {
          handler: renderAsIs
        },
        Customized: {
          handler: this.renderCustomized
        },
        Legend: {
          handler: renderAsIs
        }
      });
      this.clipPathId = "".concat((_props$id = props.id) !== null && _props$id !== void 0 ? _props$id : (0, _DataUtils.uniqueId)('recharts'), "-clip");

      // trigger 60fps
      this.throttleTriggeredAfterMouseMove = (0, _throttle.default)(this.triggeredAfterMouseMove, (_props$throttleDelay = props.throttleDelay) !== null && _props$throttleDelay !== void 0 ? _props$throttleDelay : 1000 / 60);
      this.state = {};
    }
    componentDidMount() {
      var _this$props$margin$le, _this$props$margin$to;
      this.addListener();
      this.accessibilityManager.setDetails({
        container: this.container,
        offset: {
          left: (_this$props$margin$le = this.props.margin.left) !== null && _this$props$margin$le !== void 0 ? _this$props$margin$le : 0,
          top: (_this$props$margin$to = this.props.margin.top) !== null && _this$props$margin$to !== void 0 ? _this$props$margin$to : 0
        },
        coordinateList: this.state.tooltipTicks,
        mouseHandlerCallback: this.triggeredAfterMouseMove,
        layout: this.props.layout,
        // Check all (0+) <XAxis /> elements to see if ANY have reversed={true}. If so, this will be treated as an RTL chart
        ltr: (0, _ChartUtils.isAxisLTR)(this.state.xAxisMap)
      });
      this.displayDefaultTooltip();
    }
    displayDefaultTooltip() {
      var {
        children,
        data,
        height,
        layout
      } = this.props;
      var tooltipElem = (0, _ReactUtils.findChildByType)(children, _Tooltip.Tooltip);
      // If the chart doesn't include a <Tooltip /> element, there's no tooltip to display
      if (!tooltipElem) {
        return;
      }
      var {
        defaultIndex
      } = tooltipElem.props;

      // Protect against runtime errors
      if (typeof defaultIndex !== 'number' || defaultIndex < 0 || defaultIndex > this.state.tooltipTicks.length) {
        return;
      }
      var activeLabel = this.state.tooltipTicks[defaultIndex] && this.state.tooltipTicks[defaultIndex].value;
      var activePayload = getTooltipContent(this.state, data, defaultIndex, activeLabel);
      var independentAxisCoord = this.state.tooltipTicks[defaultIndex].coordinate;
      var dependentAxisCoord = (this.state.offset.top + height) / 2;
      var isHorizontal = layout === 'horizontal';
      var activeCoordinate = isHorizontal ? {
        x: independentAxisCoord,
        y: dependentAxisCoord
      } : {
        y: independentAxisCoord,
        x: dependentAxisCoord
      };

      // Unlike other chart types, scatter plot's tooltip positions rely on both X and Y coordinates. Only the scatter plot
      // element knows its own Y coordinates.
      // If there's a scatter plot, we'll want to grab that element for an interrogation.
      var scatterPlotElement = this.state.formattedGraphicalItems.find(_ref11 => {
        var {
          item
        } = _ref11;
        return item.type.name === 'Scatter';
      });
      if (scatterPlotElement) {
        activeCoordinate = _objectSpread(_objectSpread({}, activeCoordinate), scatterPlotElement.props.points[defaultIndex].tooltipPosition);
        activePayload = scatterPlotElement.props.points[defaultIndex].tooltipPayload;
      }
      var nextState = {
        activeTooltipIndex: defaultIndex,
        isTooltipActive: true,
        activeLabel,
        activePayload,
        activeCoordinate
      };
      this.setState(nextState);
      this.renderCursor(tooltipElem);

      // Make sure that anyone who keyboard-only users who tab to the chart will start their
      // cursors at defaultIndex
      this.accessibilityManager.setIndex(defaultIndex);
    }
    getSnapshotBeforeUpdate(prevProps, prevState) {
      if (!this.props.accessibilityLayer) {
        return null;
      }
      if (this.state.tooltipTicks !== prevState.tooltipTicks) {
        this.accessibilityManager.setDetails({
          coordinateList: this.state.tooltipTicks
        });
      }
      if (this.state.xAxisMap !== prevState.xAxisMap) {
        this.accessibilityManager.setDetails({
          ltr: (0, _ChartUtils.isAxisLTR)(this.state.xAxisMap)
        });
      }
      if (this.props.layout !== prevProps.layout) {
        this.accessibilityManager.setDetails({
          layout: this.props.layout
        });
      }
      if (this.props.margin !== prevProps.margin) {
        var _this$props$margin$le2, _this$props$margin$to2;
        this.accessibilityManager.setDetails({
          offset: {
            left: (_this$props$margin$le2 = this.props.margin.left) !== null && _this$props$margin$le2 !== void 0 ? _this$props$margin$le2 : 0,
            top: (_this$props$margin$to2 = this.props.margin.top) !== null && _this$props$margin$to2 !== void 0 ? _this$props$margin$to2 : 0
          }
        });
      }

      // Something has to be returned for getSnapshotBeforeUpdate
      return null;
    }
    componentDidUpdate(prevProps) {
      // Check to see if the Tooltip updated. If so, re-check default tooltip position
      if (!(0, _ReactUtils.isChildrenEqual)([(0, _ReactUtils.findChildByType)(prevProps.children, _Tooltip.Tooltip)], [(0, _ReactUtils.findChildByType)(this.props.children, _Tooltip.Tooltip)])) {
        this.displayDefaultTooltip();
      }
    }
    componentWillUnmount() {
      this.removeListener();
      this.throttleTriggeredAfterMouseMove.cancel();
    }
    getTooltipEventType() {
      var tooltipItem = (0, _ReactUtils.findChildByType)(this.props.children, _Tooltip.Tooltip);
      if (tooltipItem && typeof tooltipItem.props.shared === 'boolean') {
        var eventType = tooltipItem.props.shared ? 'axis' : 'item';
        return validateTooltipEventTypes.indexOf(eventType) >= 0 ? eventType : defaultTooltipEventType;
      }
      return defaultTooltipEventType;
    }

    /**
     * Get the information of mouse in chart, return null when the mouse is not in the chart
     * @param  {MousePointer} event    The event object
     * @return Monster object with a little bit of everything in it
     */
    getMouseInfo(event) {
      if (!this.container) {
        return null;
      }
      var element = this.container;
      var boundingRect = element.getBoundingClientRect();
      var containerOffset = (0, _DOMUtils.getOffset)(boundingRect);
      var e = {
        chartX: Math.round(event.pageX - containerOffset.left),
        chartY: Math.round(event.pageY - containerOffset.top)
      };
      var scale = boundingRect.width / element.offsetWidth || 1;
      var rangeObj = this.inRange(e.chartX, e.chartY, scale);
      if (!rangeObj) {
        return null;
      }
      var {
        xAxisMap,
        yAxisMap
      } = this.state;
      var tooltipEventType = this.getTooltipEventType();
      if (tooltipEventType !== 'axis' && xAxisMap && yAxisMap) {
        var xScale = (0, _DataUtils.getAnyElementOfObject)(xAxisMap).scale;
        var yScale = (0, _DataUtils.getAnyElementOfObject)(yAxisMap).scale;
        var xValue = xScale && xScale.invert ? xScale.invert(e.chartX) : null;
        var yValue = yScale && yScale.invert ? yScale.invert(e.chartY) : null;
        return _objectSpread(_objectSpread({}, e), {}, {
          xValue,
          yValue
        });
      }
      var toolTipData = getTooltipData(this.state, this.props.data, this.props.layout, rangeObj);
      if (toolTipData) {
        return _objectSpread(_objectSpread({}, e), toolTipData);
      }
      return null;
    }
    inRange(x, y) {
      var scale = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
      var {
        layout
      } = this.props;
      var [scaledX, scaledY] = [x / scale, y / scale];
      if (layout === 'horizontal' || layout === 'vertical') {
        var {
          offset
        } = this.state;
        var isInRange = scaledX >= offset.left && scaledX <= offset.left + offset.width && scaledY >= offset.top && scaledY <= offset.top + offset.height;
        return isInRange ? {
          x: scaledX,
          y: scaledY
        } : null;
      }
      var {
        angleAxisMap,
        radiusAxisMap
      } = this.state;
      if (angleAxisMap && radiusAxisMap) {
        var angleAxis = (0, _DataUtils.getAnyElementOfObject)(angleAxisMap);
        return (0, _PolarUtils.inRangeOfSector)({
          x: scaledX,
          y: scaledY
        }, angleAxis);
      }
      return null;
    }
    parseEventsOfWrapper() {
      var {
        children
      } = this.props;
      var tooltipEventType = this.getTooltipEventType();
      var tooltipItem = (0, _ReactUtils.findChildByType)(children, _Tooltip.Tooltip);
      var tooltipEvents = {};
      if (tooltipItem && tooltipEventType === 'axis') {
        if (tooltipItem.props.trigger === 'click') {
          tooltipEvents = {
            onClick: this.handleClick
          };
        } else {
          tooltipEvents = {
            onMouseEnter: this.handleMouseEnter,
            onMouseMove: this.handleMouseMove,
            onMouseLeave: this.handleMouseLeave,
            onTouchMove: this.handleTouchMove,
            onTouchStart: this.handleTouchStart,
            onTouchEnd: this.handleTouchEnd
          };
        }
      }

      // @ts-expect-error adaptEventHandlers expects DOM Event but generateCategoricalChart works with React UIEvents
      var outerEvents = (0, _types.adaptEventHandlers)(this.props, this.handleOuterEvent);
      return _objectSpread(_objectSpread({}, outerEvents), tooltipEvents);
    }
    addListener() {
      _Events.eventCenter.on(_Events.SYNC_EVENT, this.handleReceiveSyncEvent);
    }
    removeListener() {
      _Events.eventCenter.removeListener(_Events.SYNC_EVENT, this.handleReceiveSyncEvent);
    }
    /**
     * Only used by renderGraphicChild.
     * @deprecated use a Context-based approach instead
     * @param item do not use
     * @param displayName do not use
     * @param childIndex do not use
     * @returns do not use
     */
    filterFormatItem(item, displayName, childIndex) {
      var {
        formattedGraphicalItems
      } = this.state;
      for (var i = 0, len = formattedGraphicalItems.length; i < len; i++) {
        var entry = formattedGraphicalItems[i];
        if (entry.item === item || entry.props.key === item.key || displayName === (0, _ReactUtils.getDisplayName)(entry.item.type) && childIndex === entry.childIndex) {
          return entry;
        }
      }
      return null;
    }
    getItemByXY(chartXY) {
      var {
        formattedGraphicalItems,
        activeItem
      } = this.state;
      if (formattedGraphicalItems && formattedGraphicalItems.length) {
        for (var i = 0, len = formattedGraphicalItems.length; i < len; i++) {
          var graphicalItem = formattedGraphicalItems[i];
          var {
            props,
            item
          } = graphicalItem;
          var itemDisplayName = (0, _ReactUtils.getDisplayName)(item.type);
          if (itemDisplayName === 'Bar') {
            var activeBarItem = (props.data || []).find(entry => {
              return (0, _Rectangle.isInRectangle)(chartXY, entry);
            });
            if (activeBarItem) {
              return {
                graphicalItem,
                payload: activeBarItem
              };
            }
          } else if (itemDisplayName === 'RadialBar') {
            var _activeBarItem = (props.data || []).find(entry => {
              return (0, _PolarUtils.inRangeOfSector)(chartXY, entry);
            });
            if (_activeBarItem) {
              return {
                graphicalItem,
                payload: _activeBarItem
              };
            }
          } else if ((0, _ActiveShapeUtils.isFunnel)(graphicalItem, activeItem) || (0, _ActiveShapeUtils.isPie)(graphicalItem, activeItem) || (0, _ActiveShapeUtils.isScatter)(graphicalItem, activeItem)) {
            var activeIndex = (0, _ActiveShapeUtils.getActiveShapeIndexForTooltip)({
              graphicalItem,
              activeTooltipItem: activeItem,
              itemData: item.props.data
            });
            var childIndex = item.props.activeIndex === undefined ? activeIndex : item.props.activeIndex;
            return {
              graphicalItem: _objectSpread(_objectSpread({}, graphicalItem), {}, {
                childIndex
              }),
              payload: (0, _ActiveShapeUtils.isScatter)(graphicalItem, activeItem) ? item.props.data[activeIndex] : graphicalItem.props.data[activeIndex]
            };
          }
        }
      }
      return null;
    }
    render() {
      if (!(0, _ReactUtils.validateWidthHeight)(this)) {
        return null;
      }
      var _this$props = this.props,
        {
          children,
          className,
          width,
          height,
          style,
          compact,
          title,
          desc
        } = _this$props,
        others = _objectWithoutProperties(_this$props, _excluded);
      var attrs = (0, _ReactUtils.filterProps)(others, false);

      // The "compact" mode is mainly used as the panorama within Brush
      if (compact) {
        return /*#__PURE__*/_react.default.createElement(_chartLayoutContext.ChartLayoutContextProvider, {
          state: this.state,
          width: this.props.width,
          height: this.props.height,
          clipPathId: this.clipPathId,
          margin: this.props.margin
        }, /*#__PURE__*/_react.default.createElement(_Surface.Surface, _extends({}, attrs, {
          width: width,
          height: height,
          title: title,
          desc: desc
        }), /*#__PURE__*/_react.default.createElement(_ClipPath.ClipPath, {
          clipPathId: this.clipPathId,
          offset: this.state.offset
        }), (0, _ReactUtils.renderByOrder)(children, this.renderMap)));
      }
      if (this.props.accessibilityLayer) {
        var _this$props$tabIndex, _this$props$role;
        // Set tabIndex to 0 by default (can be overwritten)
        attrs.tabIndex = (_this$props$tabIndex = this.props.tabIndex) !== null && _this$props$tabIndex !== void 0 ? _this$props$tabIndex : 0;
        // Set role to img by default (can be overwritten)
        attrs.role = (_this$props$role = this.props.role) !== null && _this$props$role !== void 0 ? _this$props$role : 'application';
        attrs.onKeyDown = e => {
          this.accessibilityManager.keyboardEvent(e);
          // 'onKeyDown' is not currently a supported prop that can be passed through
          // if it's added, this should be added: this.props.onKeyDown(e);
        };
        attrs.onFocus = () => {
          this.accessibilityManager.focus();
          // 'onFocus' is not currently a supported prop that can be passed through
          // if it's added, the focus event should be forwarded to the prop
        };
      }
      var events = this.parseEventsOfWrapper();
      return /*#__PURE__*/_react.default.createElement(_chartDataContext.ChartDataContextProvider, {
        value: this.props.data
      }, /*#__PURE__*/_react.default.createElement(_legendBoundingBoxContext.LegendBoundingBoxContext.Provider, {
        value: this.handleLegendBBoxUpdate
      }, /*#__PURE__*/_react.default.createElement(_brushUpdateContext.BrushUpdateDispatchContext.Provider, {
        value: this.handleBrushChange
      }, /*#__PURE__*/_react.default.createElement(_accessibilityContext.AccessibilityContextProvider, {
        value: this.props.accessibilityLayer
      }, /*#__PURE__*/_react.default.createElement(_chartLayoutContext.ChartLayoutContextProvider, {
        state: this.state,
        width: this.props.width,
        height: this.props.height,
        clipPathId: this.clipPathId,
        margin: this.props.margin
      }, /*#__PURE__*/_react.default.createElement("div", _extends({
        className: (0, _clsx.default)('recharts-wrapper', className),
        style: _objectSpread({
          position: 'relative',
          cursor: 'default',
          width,
          height
        }, style)
      }, events, {
        ref: node => {
          this.container = node;
        }
      }), /*#__PURE__*/_react.default.createElement(_Surface.Surface, _extends({}, attrs, {
        width: width,
        height: height,
        title: title,
        desc: desc,
        style: FULL_WIDTH_AND_HEIGHT
      }), /*#__PURE__*/_react.default.createElement(_ClipPath.ClipPath, {
        clipPathId: this.clipPathId,
        offset: this.state.offset
      }), (0, _ReactUtils.renderByOrder)(children, this.renderMap)), this.renderTooltip()))))));
    }
  }, _defineProperty(_CategoricalChartWrapper, "displayName", chartName), _defineProperty(_CategoricalChartWrapper, "defaultProps", _objectSpread({
    layout: 'horizontal',
    stackOffset: 'none',
    barCategoryGap: '10%',
    barGap: 4,
    margin: {
      top: 5,
      right: 5,
      bottom: 5,
      left: 5
    },
    reverseStackOrder: false,
    syncMethod: 'index'
  }, defaultProps)), _defineProperty(_CategoricalChartWrapper, "getDerivedStateFromProps", (nextProps, prevState) => {
    var {
      dataKey,
      data,
      children,
      width,
      height,
      layout,
      stackOffset,
      margin
    } = nextProps;
    var {
      dataStartIndex,
      dataEndIndex
    } = prevState;
    if (prevState.updateId === undefined) {
      var defaultState = createDefaultState(nextProps);
      return _objectSpread(_objectSpread(_objectSpread({}, defaultState), {}, {
        updateId: 0
      }, updateStateOfAxisMapsOffsetAndStackGroups(_objectSpread(_objectSpread({
        props: nextProps
      }, defaultState), {}, {
        updateId: 0
      }), prevState)), {}, {
        prevDataKey: dataKey,
        prevData: data,
        prevWidth: width,
        prevHeight: height,
        prevLayout: layout,
        prevStackOffset: stackOffset,
        prevMargin: margin,
        prevChildren: children
      });
    }
    if (dataKey !== prevState.prevDataKey || data !== prevState.prevData || width !== prevState.prevWidth || height !== prevState.prevHeight || layout !== prevState.prevLayout || stackOffset !== prevState.prevStackOffset || !(0, _ShallowEqual.shallowEqual)(margin, prevState.prevMargin)) {
      var _defaultState = createDefaultState(nextProps);

      // Fixes https://github.com/recharts/recharts/issues/2143
      var keepFromPrevState = {
        // (chartX, chartY) are (0,0) in default state, but we want to keep the last mouse position to avoid
        // any flickering
        chartX: prevState.chartX,
        chartY: prevState.chartY,
        // The tooltip should stay active when it was active in the previous render. If this is not
        // the case, the tooltip disappears and immediately re-appears, causing a flickering effect
        isTooltipActive: prevState.isTooltipActive
      };
      var updatesToState = _objectSpread(_objectSpread({}, getTooltipData(prevState, data, layout)), {}, {
        updateId: prevState.updateId + 1
      });
      var newState = _objectSpread(_objectSpread(_objectSpread({}, _defaultState), keepFromPrevState), updatesToState);
      return _objectSpread(_objectSpread(_objectSpread({}, newState), updateStateOfAxisMapsOffsetAndStackGroups(_objectSpread({
        props: nextProps
      }, newState), prevState)), {}, {
        prevDataKey: dataKey,
        prevData: data,
        prevWidth: width,
        prevHeight: height,
        prevLayout: layout,
        prevStackOffset: stackOffset,
        prevMargin: margin,
        prevChildren: children
      });
    }
    if (!(0, _ReactUtils.isChildrenEqual)(children, prevState.prevChildren)) {
      var _brush$props$startInd, _brush$props, _brush$props$endIndex, _brush$props2;
      // specifically check for Brush - if it exists and the start and end indexes are different, re-render with the new ones
      var brush = (0, _ReactUtils.findChildByType)(children, _Brush.Brush);
      var startIndex = brush ? (_brush$props$startInd = (_brush$props = brush.props) === null || _brush$props === void 0 ? void 0 : _brush$props.startIndex) !== null && _brush$props$startInd !== void 0 ? _brush$props$startInd : dataStartIndex : dataStartIndex;
      var endIndex = brush ? (_brush$props$endIndex = (_brush$props2 = brush.props) === null || _brush$props2 === void 0 ? void 0 : _brush$props2.endIndex) !== null && _brush$props$endIndex !== void 0 ? _brush$props$endIndex : dataEndIndex : dataEndIndex;
      var hasDifferentStartOrEndIndex = startIndex !== dataStartIndex || endIndex !== dataEndIndex;

      // update configuration in children
      var hasGlobalData = !(0, _isNil.default)(data);
      var newUpdateId = hasGlobalData && !hasDifferentStartOrEndIndex ? prevState.updateId : prevState.updateId + 1;
      return _objectSpread(_objectSpread({
        updateId: newUpdateId
      }, updateStateOfAxisMapsOffsetAndStackGroups(_objectSpread(_objectSpread({
        props: nextProps
      }, prevState), {}, {
        updateId: newUpdateId,
        dataStartIndex: startIndex,
        dataEndIndex: endIndex
      }), prevState)), {}, {
        prevChildren: children,
        dataStartIndex: startIndex,
        dataEndIndex: endIndex
      });
    }
    return null;
  }), _defineProperty(_CategoricalChartWrapper, "renderActiveDot", (option, props) => {
    var dot;
    if ( /*#__PURE__*/(0, _react.isValidElement)(option)) {
      dot = /*#__PURE__*/(0, _react.cloneElement)(option, props);
    } else if ((0, _isFunction.default)(option)) {
      dot = option(props);
    } else {
      dot = /*#__PURE__*/_react.default.createElement(_Dot.Dot, props);
    }
    return /*#__PURE__*/_react.default.createElement(_Layer.Layer, {
      className: "recharts-active-dot",
      key: props.key
    }, dot);
  }), _CategoricalChartWrapper;
};
exports.generateCategoricalChart = generateCategoricalChart;