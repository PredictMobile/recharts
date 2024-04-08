import React, { CSSProperties, PureComponent, ReactNode } from 'react';
import { AllowInDimension, AnimationDuration, AnimationTiming, CartesianViewBox, Coordinate } from '../util/types';
import { BoundingBox, SetBoundingBox } from '../util/useGetBoundingClientRect';
export type TooltipBoundingBoxProps = {
    active: boolean;
    allowEscapeViewBox: AllowInDimension;
    animationDuration: AnimationDuration;
    animationEasing: AnimationTiming;
    children: ReactNode;
    coordinate: Partial<Coordinate>;
    hasPayload: boolean;
    isAnimationActive: boolean;
    offset: number;
    position: Partial<Coordinate>;
    reverseDirection: AllowInDimension;
    useTranslate3d: boolean;
    viewBox: CartesianViewBox;
    wrapperStyle: CSSProperties;
    lastBoundingBox: BoundingBox;
    innerRef: SetBoundingBox;
};
type State = {
    dismissed: boolean;
    dismissedAtCoordinate: Coordinate;
};
export declare class TooltipBoundingBox extends PureComponent<TooltipBoundingBoxProps, State> {
    state: {
        dismissed: boolean;
        dismissedAtCoordinate: {
            x: number;
            y: number;
        };
    };
    componentDidMount(): void;
    componentWillUnmount(): void;
    componentDidUpdate(): void;
    handleKeyDown: (event: KeyboardEvent) => void;
    render(): React.JSX.Element;
}
export {};
