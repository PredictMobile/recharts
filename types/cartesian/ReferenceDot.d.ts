import React, { ReactElement } from 'react';
import { Props as DotProps } from '../shape/Dot';
import { ImplicitLabelType } from '../component/Label';
import { IfOverflow } from '../util/IfOverflow';
interface ReferenceDotProps {
    r?: number;
    isFront?: boolean;
    ifOverflow?: IfOverflow;
    x?: number | string;
    y?: number | string;
    className?: number | string;
    yAxisId?: number | string;
    xAxisId?: number | string;
    shape?: ReactElement<SVGElement> | ((props: any) => ReactElement<SVGElement>);
    label?: ImplicitLabelType;
}
export type Props = DotProps & ReferenceDotProps;
export declare function ReferenceDot(props: Props): React.JSX.Element;
export declare namespace ReferenceDot {
    var displayName: string;
    var defaultProps: {
        isFront: boolean;
        ifOverflow: string;
        xAxisId: number;
        yAxisId: number;
        r: number;
        fill: string;
        stroke: string;
        fillOpacity: number;
        strokeWidth: number;
    };
    var renderDot: (option: React.ReactElement<SVGElement, string | React.JSXElementConstructor<any>> | ((props: any) => React.ReactElement<SVGElement, string | React.JSXElementConstructor<any>>), props: any) => React.JSX.Element;
}
export {};
