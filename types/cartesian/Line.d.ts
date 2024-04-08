import React, { PureComponent } from 'react';
import { CurveType, Props as CurveProps, Point as CurvePoint } from '../shape/Curve';
import { ImplicitLabelType } from '../component/Label';
import { Props as XAxisProps } from './XAxis';
import { Props as YAxisProps } from './YAxis';
import { D3Scale, LegendType, TooltipType, AnimationTiming, ChartOffset, DataKey, TickItem, AnimationDuration, LayoutType, ActiveDotType } from '../util/types';
export interface LinePointItem extends CurvePoint {
    value?: number;
    payload?: any;
}
interface InternalLineProps {
    top?: number;
    left?: number;
    width?: number;
    height?: number;
    points?: LinePointItem[];
    xAxis?: Omit<XAxisProps, 'scale'> & {
        scale: D3Scale<string | number>;
    };
    yAxis?: Omit<YAxisProps, 'scale'> & {
        scale: D3Scale<string | number>;
    };
}
interface LineProps extends InternalLineProps {
    className?: string;
    data?: any;
    type?: CurveType;
    unit?: string | number;
    name?: string | number;
    yAxisId?: string | number;
    xAxisId?: string | number;
    dataKey?: DataKey<any>;
    legendType?: LegendType;
    tooltipType?: TooltipType;
    layout?: 'horizontal' | 'vertical';
    connectNulls?: boolean;
    hide?: boolean;
    activeDot?: ActiveDotType;
    dot?: ActiveDotType;
    onAnimationStart?: () => void;
    onAnimationEnd?: () => void;
    isAnimationActive?: boolean;
    animateNewValues?: boolean;
    animationBegin?: number;
    animationDuration?: AnimationDuration;
    animationEasing?: AnimationTiming;
    animationId?: number;
    id?: string;
    label?: ImplicitLabelType;
}
export type Props = Omit<CurveProps, 'points' | 'pathRef'> & LineProps;
interface State {
    isAnimationFinished?: boolean;
    totalLength?: number;
    prevPoints?: LinePointItem[];
    curPoints?: LinePointItem[];
    prevAnimationId?: number;
}
type LineComposedData = ChartOffset & {
    points?: LinePointItem[];
    layout: LayoutType;
};
export declare class Line extends PureComponent<Props, State> {
    static displayName: string;
    static defaultProps: {
        xAxisId: number;
        yAxisId: number;
        connectNulls: boolean;
        activeDot: boolean;
        dot: boolean;
        legendType: string;
        stroke: string;
        strokeWidth: number;
        fill: string;
        points: LinePointItem[];
        isAnimationActive: boolean;
        animateNewValues: boolean;
        animationBegin: number;
        animationDuration: number;
        animationEasing: string;
        hide: boolean;
        label: boolean;
    };
    static getComposedData: ({ props, xAxis, yAxis, xAxisTicks, yAxisTicks, dataKey, bandSize, displayedData, offset, }: {
        props: Props;
        xAxis: Props['xAxis'];
        yAxis: Props['yAxis'];
        xAxisTicks: TickItem[];
        yAxisTicks: TickItem[];
        dataKey: Props['dataKey'];
        bandSize: number;
        displayedData: any[];
        offset: ChartOffset;
    }) => LineComposedData;
    mainCurve?: SVGPathElement;
    state: State;
    componentDidMount(): void;
    componentDidUpdate(): void;
    static getDerivedStateFromProps(nextProps: Props, prevState: State): State;
    getTotalLength(): number;
    generateSimpleStrokeDasharray: (totalLength: number, length: number) => string;
    getStrokeDasharray: (length: number, totalLength: number, lines: number[]) => string;
    id: string;
    pathRef: (node: SVGPathElement) => void;
    static repeat(lines: number[], count: number): number[];
    handleAnimationEnd: () => void;
    handleAnimationStart: () => void;
    renderErrorBar(needClip: boolean, clipPathId: string): React.JSX.Element;
    static renderDotItem(option: ActiveDotType, props: any): React.JSX.Element;
    renderDots(needClip: boolean, clipDot: boolean, clipPathId: string): React.JSX.Element;
    renderCurveStatically(points: LinePointItem[], needClip: boolean, clipPathId: string, props?: {
        strokeDasharray: string;
    }): React.JSX.Element;
    renderCurveWithAnimation(needClip: boolean, clipPathId: string): React.JSX.Element;
    renderCurve(needClip: boolean, clipPathId: string): React.JSX.Element;
    render(): React.JSX.Element;
}
export {};
