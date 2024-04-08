import React, { PureComponent } from 'react';
import { Props as TrapezoidProps } from '../shape/Trapezoid';
import { LegendType, TooltipType, AnimationTiming, ChartOffset, DataKey, PresentationAttributesAdaptChildEvent, AnimationDuration, ActiveShape } from '../util/types';
export interface FunnelTrapezoidItem extends TrapezoidProps {
    value?: number | string;
    payload?: any;
    isActive: boolean;
}
interface InternalFunnelProps {
    className?: string;
    dataKey: DataKey<any>;
    nameKey?: DataKey<any>;
    data?: any[];
    hide?: boolean;
    shape?: ActiveShape<FunnelTrapezoidItem, SVGPathElement>;
    activeShape?: ActiveShape<FunnelTrapezoidItem, SVGPathElement>;
    legendType?: LegendType;
    tooltipType?: TooltipType;
    activeIndex?: number | number[];
    lastShapeType?: 'triangle' | 'rectangle';
    reversed?: boolean;
    onAnimationStart?: () => void;
    onAnimationEnd?: () => void;
    isAnimationActive?: boolean;
    animateNewValues?: boolean;
    animationBegin?: number;
    animationDuration?: AnimationDuration;
    animationEasing?: AnimationTiming;
    id?: string;
    trapezoids?: FunnelTrapezoidItem[];
    animationId?: number;
}
export type FunnelProps = PresentationAttributesAdaptChildEvent<any, SVGElement> & TrapezoidProps & InternalFunnelProps;
interface State {
    readonly prevTrapezoids?: FunnelTrapezoidItem[];
    readonly curTrapezoids?: FunnelTrapezoidItem[];
    readonly prevAnimationId?: number;
    readonly isAnimationFinished?: boolean;
}
type RealFunnelData = any;
type FunnelComposedData = {
    trapezoids: FunnelTrapezoidItem[];
    data: RealFunnelData[];
};
export declare class Funnel extends PureComponent<FunnelProps, State> {
    static displayName: string;
    static defaultProps: {
        stroke: string;
        fill: string;
        legendType: string;
        labelLine: boolean;
        hide: boolean;
        isAnimationActive: boolean;
        animationBegin: number;
        animationDuration: number;
        animationEasing: string;
        nameKey: string;
        lastShapeType: string;
    };
    static getRealFunnelData: (item: Funnel) => RealFunnelData[];
    static getRealWidthHeight: (item: Funnel, offset: ChartOffset) => {
        realWidth: number;
        realHeight: number;
        offsetX: number;
        offsetY: number;
    };
    static getComposedData: ({ item, offset }: {
        item: Funnel;
        offset: ChartOffset;
    }) => FunnelComposedData;
    state: State;
    static getDerivedStateFromProps(nextProps: FunnelProps, prevState: State): State;
    handleAnimationEnd: () => void;
    handleAnimationStart: () => void;
    isActiveIndex(i: number): boolean;
    renderTrapezoidsStatically(trapezoids: FunnelTrapezoidItem[]): React.JSX.Element[];
    renderTrapezoidsWithAnimation(): React.JSX.Element;
    renderTrapezoids(): React.JSX.Element | React.JSX.Element[];
    render(): React.JSX.Element;
}
export {};