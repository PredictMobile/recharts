import React, { SVGProps } from 'react';
interface PolarGridProps {
    cx?: number;
    cy?: number;
    innerRadius?: number;
    outerRadius?: number;
    polarAngles?: number[];
    polarRadius?: number[];
    gridType?: 'polygon' | 'circle';
    radialLines?: boolean;
}
export type Props = SVGProps<SVGPathElement> & PolarGridProps;
export declare const PolarGrid: {
    ({ gridType, radialLines, ...inputs }: Props): React.JSX.Element;
    displayName: string;
};
export {};
