import React, { PureComponent, CSSProperties, ReactNode, ReactElement, SVGProps } from 'react';
import { NameType, Payload, Props as DefaultTooltipContentProps, ValueType } from './DefaultTooltipContent';
import { UniqueOption } from '../util/payload/getUniqPayload';
import { AllowInDimension, AnimationDuration, AnimationTiming, Coordinate } from '../util/types';
import { TooltipContextValue } from '../context/tooltipContext';
export type ContentType<TValue extends ValueType, TName extends NameType> = ReactElement | ((props: TooltipContentProps<TValue, TName>) => ReactNode);
type TooltipContentProps<TValue extends ValueType, TName extends NameType> = TooltipProps<TValue, TName> & Pick<TooltipContextValue, 'label' | 'payload' | 'coordinate' | 'active'> & {
    accessibilityLayer: boolean;
};
type PropertiesReadFromContext = 'viewBox' | 'active' | 'payload' | 'coordinate' | 'label' | 'accessibilityLayer';
export type TooltipProps<TValue extends ValueType, TName extends NameType> = Omit<DefaultTooltipContentProps<TValue, TName>, PropertiesReadFromContext> & {
    active?: boolean | undefined;
    includeHidden?: boolean | undefined;
    allowEscapeViewBox?: AllowInDimension;
    animationDuration?: AnimationDuration;
    animationEasing?: AnimationTiming;
    content?: ContentType<TValue, TName>;
    cursor?: boolean | ReactElement | SVGProps<SVGElement>;
    filterNull?: boolean;
    defaultIndex?: number;
    isAnimationActive?: boolean;
    offset?: number;
    payloadUniqBy?: UniqueOption<Payload<TValue, TName>>;
    position?: Partial<Coordinate>;
    reverseDirection?: AllowInDimension;
    shared?: boolean;
    trigger?: 'hover' | 'click';
    useTranslate3d?: boolean;
    wrapperStyle?: CSSProperties;
};
export declare class Tooltip<TValue extends ValueType, TName extends NameType> extends PureComponent<TooltipProps<TValue, TName>> {
    static displayName: string;
    static defaultProps: {
        allowEscapeViewBox: {
            x: boolean;
            y: boolean;
        };
        animationDuration: number;
        animationEasing: string;
        contentStyle: {};
        coordinate: {
            x: number;
            y: number;
        };
        cursor: boolean;
        cursorStyle: {};
        filterNull: boolean;
        isAnimationActive: boolean;
        itemStyle: {};
        labelStyle: {};
        offset: number;
        reverseDirection: {
            x: boolean;
            y: boolean;
        };
        separator: string;
        trigger: string;
        useTranslate3d: boolean;
        wrapperStyle: {};
    };
    render(): React.JSX.Element;
}
export {};
