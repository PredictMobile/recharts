import React, { ReactElement } from 'react';
import type { DebouncedFunc } from 'lodash';
import { AxisStackGroups } from '../util/ChartUtils';
import { ActiveDotType, AxisType, CategoricalChartOptions, DataKey, LayoutType, Margin, MouseInfo, RangeObj, StackOffsetType, TooltipEventType } from '../util/types';
import { AccessibilityManager } from './AccessibilityManager';
import { AxisMap, CategoricalChartState } from './types';
import { BoundingBox } from '../util/useGetBoundingClientRect';
import { BrushStartEndIndex } from '../context/brushUpdateContext';
export interface MousePointer {
    pageX: number;
    pageY: number;
}
export type GraphicalItem<Props = Record<string, any>> = ReactElement<Props, string | React.JSXElementConstructor<Props>> & {
    item: ReactElement<Props, string | React.JSXElementConstructor<Props>>;
};
declare function renderAsIs(element: React.ReactElement): React.ReactElement;
export declare const getAxisMapByAxes: (props: CategoricalChartProps, { axes, graphicalItems, axisType, axisIdKey, stackGroups, dataStartIndex, dataEndIndex, }: {
    axes: ReadonlyArray<ReactElement>;
    graphicalItems: ReadonlyArray<ReactElement>;
    axisType: AxisType;
    axisIdKey: string;
    stackGroups: AxisStackGroups;
    dataStartIndex: number;
    dataEndIndex: number;
}) => AxisMap;
export declare const createDefaultState: (props: CategoricalChartProps) => CategoricalChartState;
export type CategoricalChartFunc = (nextState: CategoricalChartState, event: any) => void;
export interface CategoricalChartProps {
    syncId?: number | string;
    syncMethod?: 'index' | 'value' | Function;
    compact?: boolean;
    width?: number;
    height?: number;
    dataKey?: DataKey<any>;
    data?: any[];
    layout?: LayoutType;
    stackOffset?: StackOffsetType;
    throttleDelay?: number;
    margin?: Margin;
    barCategoryGap?: number | string;
    barGap?: number | string;
    barSize?: number | string;
    maxBarSize?: number;
    style?: any;
    className?: string;
    children?: any;
    defaultShowTooltip?: boolean;
    onClick?: CategoricalChartFunc;
    onMouseLeave?: CategoricalChartFunc;
    onMouseEnter?: CategoricalChartFunc;
    onMouseMove?: CategoricalChartFunc;
    onMouseDown?: CategoricalChartFunc;
    onMouseUp?: CategoricalChartFunc;
    reverseStackOrder?: boolean;
    id?: string;
    startAngle?: number;
    endAngle?: number;
    cx?: number | string;
    cy?: number | string;
    innerRadius?: number | string;
    outerRadius?: number | string;
    title?: string;
    desc?: string;
    accessibilityLayer?: boolean;
    role?: string;
    tabIndex?: number;
}
export declare const generateCategoricalChart: ({ chartName, GraphicalChild, defaultTooltipEventType, validateTooltipEventTypes, axisComponents, formatAxisMap, defaultProps, }: CategoricalChartOptions) => {
    new (props: CategoricalChartProps): {
        readonly eventEmitterSymbol: Symbol;
        clipPathId: string;
        accessibilityManager: AccessibilityManager;
        throttleTriggeredAfterMouseMove: DebouncedFunc<(e: MousePointer) => any>;
        container?: HTMLElement;
        componentDidMount(): void;
        displayDefaultTooltip(): void;
        getSnapshotBeforeUpdate(prevProps: Readonly<CategoricalChartProps>, prevState: Readonly<CategoricalChartState>): null;
        componentDidUpdate(prevProps: CategoricalChartProps): void;
        componentWillUnmount(): void;
        getTooltipEventType(): TooltipEventType;
        getMouseInfo(event: MousePointer): MouseInfo | null;
        inRange(x: number, y: number, scale?: number): RangeObj;
        parseEventsOfWrapper(): any;
        addListener(): void;
        removeListener(): void;
        handleLegendBBoxUpdate: (box: BoundingBox | null) => void;
        handleReceiveSyncEvent: (cId: number | string, data: CategoricalChartState, emitter: Symbol) => void;
        handleBrushChange: ({ startIndex, endIndex }: BrushStartEndIndex) => void;
        handleMouseEnter: (e: React.MouseEvent) => void;
        triggeredAfterMouseMove: (e: MousePointer) => any;
        handleItemMouseEnter: (el: any) => void;
        handleItemMouseLeave: () => void;
        handleMouseMove: (e: MousePointer & Partial<Omit<React.MouseEvent, keyof MousePointer>>) => void;
        handleMouseLeave: (e: any) => void;
        handleOuterEvent: (e: React.MouseEvent | React.TouchEvent) => void;
        handleClick: (e: React.MouseEvent) => void;
        handleMouseDown: (e: React.MouseEvent | React.Touch) => void;
        handleMouseUp: (e: React.MouseEvent | React.Touch) => void;
        handleTouchMove: (e: React.TouchEvent) => void;
        handleTouchStart: (e: React.TouchEvent) => void;
        handleTouchEnd: (e: React.TouchEvent) => void;
        triggerSyncEvent: (data: CategoricalChartState) => void;
        applySyncEvent: (data: CategoricalChartState) => void;
        filterFormatItem(item: any, displayName: any, childIndex: any): any;
        renderCursor: (element: ReactElement) => React.JSX.Element;
        renderTooltip: () => React.ReactElement;
        renderActivePoints: ({ item, activePoint, basePoint, childIndex, isRange, }: {
            item: {
                props: {
                    key: string;
                };
                item: {
                    type: {
                        displayName: string;
                    };
                    props: {
                        activeDot: ActiveDotType;
                        dataKey: DataKey<any>;
                        stroke: string;
                        fill: string;
                    };
                };
            };
            activePoint: any;
            basePoint: any;
            childIndex: number;
            isRange: boolean;
        }) => React.ReactElement<any, string | React.JSXElementConstructor<any>>[];
        renderGraphicChild: (element: React.ReactElement, displayName: string, index: number) => any[];
        renderCustomized: (element: React.ReactElement, displayName: string, index: number) => React.ReactElement;
        getItemByXY(chartXY: {
            x: number;
            y: number;
        }): {
            graphicalItem: any;
            payload: any;
        };
        renderMap: {
            CartesianGrid: {
                handler: typeof renderAsIs;
                once: boolean;
            };
            ReferenceArea: {
                handler: typeof renderAsIs;
            };
            ReferenceLine: {
                handler: typeof renderAsIs;
            };
            ReferenceDot: {
                handler: typeof renderAsIs;
            };
            XAxis: {
                handler: typeof renderAsIs;
            };
            YAxis: {
                handler: typeof renderAsIs;
            };
            Brush: {
                handler: typeof renderAsIs;
            };
            Bar: {
                handler: (element: React.ReactElement, displayName: string, index: number) => any[];
            };
            Line: {
                handler: (element: React.ReactElement, displayName: string, index: number) => any[];
            };
            Area: {
                handler: (element: React.ReactElement, displayName: string, index: number) => any[];
            };
            Radar: {
                handler: (element: React.ReactElement, displayName: string, index: number) => any[];
            };
            RadialBar: {
                handler: (element: React.ReactElement, displayName: string, index: number) => any[];
            };
            Scatter: {
                handler: (element: React.ReactElement, displayName: string, index: number) => any[];
            };
            Pie: {
                handler: (element: React.ReactElement, displayName: string, index: number) => any[];
            };
            Funnel: {
                handler: (element: React.ReactElement, displayName: string, index: number) => any[];
            };
            Tooltip: {
                handler: (element: ReactElement) => React.JSX.Element;
                once: boolean;
            };
            PolarGrid: {
                handler: typeof renderAsIs;
                once: boolean;
            };
            PolarAngleAxis: {
                handler: typeof renderAsIs;
            };
            PolarRadiusAxis: {
                handler: typeof renderAsIs;
            };
            Customized: {
                handler: (element: React.ReactElement, displayName: string, index: number) => React.ReactElement;
            };
            Legend: {
                handler: typeof renderAsIs;
            };
        };
        render(): React.JSX.Element;
        context: any;
        setState<K extends keyof CategoricalChartState>(state: CategoricalChartState | ((prevState: Readonly<CategoricalChartState>, props: Readonly<CategoricalChartProps>) => CategoricalChartState | Pick<CategoricalChartState, K>) | Pick<CategoricalChartState, K>, callback?: () => void): void;
        forceUpdate(callback?: () => void): void;
        readonly props: Readonly<CategoricalChartProps> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<CategoricalChartState>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        shouldComponentUpdate?(nextProps: Readonly<CategoricalChartProps>, nextState: Readonly<CategoricalChartState>, nextContext: any): boolean;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<CategoricalChartProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<CategoricalChartProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<CategoricalChartProps>, nextState: Readonly<CategoricalChartState>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<CategoricalChartProps>, nextState: Readonly<CategoricalChartState>, nextContext: any): void;
    };
    displayName: string;
    defaultProps: CategoricalChartProps;
    getDerivedStateFromProps: (nextProps: CategoricalChartProps, prevState: CategoricalChartState) => CategoricalChartState;
    renderActiveDot: (option: any, props: any) => React.ReactElement;
    contextType?: React.Context<any>;
};
export {};
