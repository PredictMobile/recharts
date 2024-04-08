import React, { FunctionComponent, PureComponent } from 'react';
import { BaseAxisProps, TickItem, PresentationAttributesAdaptChildEvent } from '../util/types';
export interface PolarAngleAxisProps extends BaseAxisProps {
    angleAxisId?: string | number;
    cx?: number;
    cy?: number;
    radius?: number;
    axisLineType?: 'polygon' | 'circle';
    ticks?: TickItem[];
    orientation?: 'inner' | 'outer';
}
export type Props = PresentationAttributesAdaptChildEvent<any, SVGTextElement> & PolarAngleAxisProps;
export declare const PolarAngleAxisWrapper: FunctionComponent<Props>;
export declare class PolarAngleAxis extends PureComponent<Props> {
    static displayName: string;
    static axisType: string;
    static defaultProps: {
        type: string;
        angleAxisId: number;
        scale: string;
        cx: number;
        cy: number;
        orientation: string;
        axisLine: boolean;
        tickLine: boolean;
        tickSize: number;
        tick: boolean;
        hide: boolean;
        allowDuplicatedCategory: boolean;
    };
    render(): React.ReactNode;
}
