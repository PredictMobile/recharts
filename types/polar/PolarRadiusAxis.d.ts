import React, { FunctionComponent, PureComponent } from 'react';
import { BaseAxisProps, TickItem, PresentationAttributesAdaptChildEvent } from '../util/types';
export interface PolarRadiusAxisProps extends Omit<BaseAxisProps, 'unit'> {
    cx?: number;
    cy?: number;
    radiusAxisId?: string | number;
    angle?: number;
    orientation?: 'left' | 'right' | 'middle';
    ticks?: TickItem[];
    reversed?: boolean;
}
export type Props = PresentationAttributesAdaptChildEvent<any, SVGElement> & PolarRadiusAxisProps;
export declare const PolarRadiusAxisWrapper: FunctionComponent<Props>;
export declare class PolarRadiusAxis extends PureComponent<Props> {
    static displayName: string;
    static axisType: string;
    static defaultProps: {
        type: string;
        radiusAxisId: number;
        cx: number;
        cy: number;
        angle: number;
        orientation: string;
        stroke: string;
        axisLine: boolean;
        tick: boolean;
        tickCount: number;
        allowDataOverflow: boolean;
        scale: string;
        allowDuplicatedCategory: boolean;
    };
    render(): React.JSX.Element;
}
