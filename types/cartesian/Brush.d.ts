import React, { PureComponent, ReactElement, ReactText, SVGAttributes, SVGProps } from 'react';
import { ScalePoint } from 'victory-vendor/d3-scale';
import { DataKey, Padding } from '../util/types';
import { OnBrushUpdate } from '../context/brushUpdateContext';
type BrushTravellerType = ReactElement<SVGElement> | ((props: TravellerProps) => ReactElement<SVGElement>);
type BrushTickFormatter = (value: any, index: number) => ReactText;
interface BrushProps {
    x?: number;
    y?: number;
    width?: number;
    className?: string;
    ariaLabel?: string;
    height: number;
    travellerWidth?: number;
    traveller?: BrushTravellerType;
    gap?: number;
    padding?: Padding;
    dataKey?: DataKey<any>;
    startIndex?: number;
    endIndex?: number;
    tickFormatter?: BrushTickFormatter;
    children?: ReactElement;
    onChange?: OnBrushUpdate;
    onDragEnd?: OnBrushUpdate;
    leaveTimeOut?: number;
    alwaysShowText?: boolean;
}
export type Props = Omit<SVGProps<SVGElement>, 'onChange'> & BrushProps;
type BrushTravellerId = 'startX' | 'endX';
interface State {
    isTravellerMoving?: boolean;
    isTravellerFocused?: boolean;
    isSlideMoving?: boolean;
    startX?: number;
    endX?: number;
    slideMoveStartX?: number;
    movingTravellerId?: BrushTravellerId;
    isTextActive?: boolean;
    brushMoveStartX?: number;
    scale?: ScalePoint<number>;
    scaleValues?: number[];
    prevData?: any[];
    prevWidth?: number;
    prevX?: number;
    prevTravellerWidth?: number;
    prevUpdateId?: string | number;
}
type TravellerProps = {
    x: number;
    y: number;
    width: number;
    height: number;
    stroke?: SVGAttributes<SVGElement>['stroke'];
};
export declare class Brush extends PureComponent<Props, State> {
    static displayName: string;
    static defaultProps: {
        height: number;
        travellerWidth: number;
        gap: number;
        fill: string;
        stroke: string;
        padding: {
            top: number;
            right: number;
            bottom: number;
            left: number;
        };
        leaveTimeOut: number;
        alwaysShowText: boolean;
    };
    render(): React.JSX.Element;
}
export {};
