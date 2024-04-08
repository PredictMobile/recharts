import React, { CSSProperties, PureComponent } from 'react';
import { Payload, Props as DefaultProps } from './DefaultLegendContent';
import { LayoutType } from '../util/types';
import { UniqueOption } from '../util/payload/getUniqPayload';
import { BoundingBox } from '../util/useGetBoundingClientRect';
export type Props = DefaultProps & {
    wrapperStyle?: CSSProperties;
    width?: number;
    height?: number;
    payloadUniqBy?: UniqueOption<Payload>;
    onBBoxUpdate?: (box: BoundingBox | null) => void;
};
interface State {
    boxWidth: number;
    boxHeight: number;
}
export declare class Legend extends PureComponent<Props, State> {
    static displayName: string;
    static defaultProps: {
        iconSize: number;
        layout: string;
        align: string;
        verticalAlign: string;
    };
    static getWidthOrHeight(layout: LayoutType | undefined, height: number | undefined, width: number | undefined, maxWidth: number): null | {
        height?: number;
        width?: number;
    };
    render(): React.JSX.Element;
}
export {};
