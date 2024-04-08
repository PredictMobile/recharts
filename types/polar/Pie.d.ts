import React, { PureComponent, ReactElement, ReactNode, SVGProps } from 'react';
import { Props as SectorProps } from '../shape/Sector';
import { LegendType, TooltipType, AnimationTiming, Coordinate, ChartOffset, DataKey, PresentationAttributesAdaptChildEvent, AnimationDuration, ActiveShape, GeometrySector } from '../util/types';
interface PieDef {
    cx?: number | string;
    cy?: number | string;
    startAngle?: number;
    endAngle?: number;
    paddingAngle?: number;
    innerRadius?: number | string;
    outerRadius?: number | string;
    cornerRadius?: number | string;
}
type PieLabelLine = ReactElement<SVGElement> | ((props: any) => ReactElement<SVGElement>) | SVGProps<SVGPathElement> | boolean;
export type PieLabelProps = PieSectorData & GeometrySector & {
    tooltipPayload?: any;
} & PieLabelRenderProps;
export type PieLabel<P extends PieLabelProps = PieLabelProps> = ReactElement<SVGElement> | ((props: P) => ReactNode | ReactElement<SVGElement>) | (SVGProps<SVGTextElement> & {
    offsetRadius?: number;
}) | boolean;
export type PieSectorData = {
    percent?: number;
    name?: string | number;
    midAngle?: number;
    middleRadius?: number;
    tooltipPosition?: Coordinate;
    value?: number;
    paddingAngle?: number;
    dataKey?: string;
    payload?: any;
};
export type PieSectorDataItem = SectorProps & PieSectorData;
interface PieProps extends PieDef {
    className?: string;
    animationId?: number;
    dataKey: DataKey<any>;
    nameKey?: DataKey<any>;
    blendStroke?: boolean;
    minAngle?: number;
    legendType?: LegendType;
    tooltipType?: TooltipType;
    maxRadius?: number;
    hide?: boolean;
    data?: any[];
    sectors?: PieSectorDataItem[];
    activeShape?: ActiveShape<PieSectorDataItem>;
    inactiveShape?: ActiveShape<PieSectorDataItem>;
    labelLine?: PieLabelLine;
    label?: PieLabel;
    activeIndex?: number | number[];
    animationEasing?: AnimationTiming;
    isAnimationActive?: boolean;
    animationBegin?: number;
    animationDuration?: AnimationDuration;
    onAnimationEnd?: () => void;
    onAnimationStart?: () => void;
    id?: string;
    onMouseEnter?: (data: any, index: number, e: React.MouseEvent) => void;
    onMouseLeave?: (data: any, index: number, e: React.MouseEvent) => void;
    onClick?: (data: any, index: number, e: React.MouseEvent) => void;
    rootTabIndex?: number;
}
export interface PieLabelRenderProps extends PieDef {
    name: string;
    percent?: number;
    stroke: string;
    index?: number;
    textAnchor: string;
    x: number;
    y: number;
    [key: string]: any;
}
interface State {
    isAnimationFinished?: boolean;
    prevIsAnimationActive?: boolean;
    prevSectors?: PieSectorDataItem[];
    curSectors?: PieSectorDataItem[];
    prevAnimationId?: number;
    sectorToFocus?: number;
}
export type Props = PresentationAttributesAdaptChildEvent<any, SVGElement> & PieProps;
type RealPieData = any;
type PieCoordinate = {
    cx: number;
    cy: number;
    innerRadius: number;
    outerRadius: number;
    maxRadius: number;
};
type PieComposedData = PieCoordinate & {
    sectors: PieSectorDataItem[];
    data: RealPieData[];
};
export declare class Pie extends PureComponent<Props, State> {
    pieRef: HTMLElement;
    sectorRefs: HTMLElement[];
    static displayName: string;
    static defaultProps: {
        stroke: string;
        fill: string;
        legendType: string;
        cx: string;
        cy: string;
        startAngle: number;
        endAngle: number;
        innerRadius: number;
        outerRadius: string;
        paddingAngle: number;
        labelLine: boolean;
        hide: boolean;
        minAngle: number;
        isAnimationActive: boolean;
        animationBegin: number;
        animationDuration: number;
        animationEasing: string;
        nameKey: string;
        blendStroke: boolean;
        rootTabIndex: number;
    };
    static parseDeltaAngle: (startAngle: number, endAngle: number) => number;
    static getRealPieData: (item: Pie) => RealPieData[];
    static parseCoordinateOfPie: (item: Pie, offset: ChartOffset) => PieCoordinate;
    static getComposedData: ({ item, offset }: {
        item: Pie;
        offset: ChartOffset;
    }) => PieComposedData;
    constructor(props: Props);
    state: State;
    static getDerivedStateFromProps(nextProps: Props, prevState: State): State;
    static getTextAnchor(x: number, cx: number): "middle" | "start" | "end";
    id: string;
    isActiveIndex(i: number): boolean;
    hasActiveIndex(): number | boolean;
    handleAnimationEnd: () => void;
    handleAnimationStart: () => void;
    static renderLabelLineItem(option: PieLabelLine, props: any): React.JSX.Element;
    static renderLabelItem(option: PieLabel, props: any, value: any): React.JSX.Element;
    renderLabels(sectors: PieSectorDataItem[]): React.JSX.Element;
    renderSectorsStatically(sectors: PieSectorDataItem[]): React.JSX.Element[];
    renderSectorsWithAnimation(): React.JSX.Element;
    attachKeyboardHandlers(pieRef: HTMLElement): void;
    renderSectors(): React.JSX.Element | React.JSX.Element[];
    componentDidMount(): void;
    render(): React.JSX.Element;
}
export {};
