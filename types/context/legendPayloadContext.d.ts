import React from 'react';
import { Payload as LegendPayload } from '../component/DefaultLegendContent';
export declare const LegendPayloadProvider: ({ children }: {
    children: React.ReactNode;
}) => React.JSX.Element;
export declare function useLegendPayload(): Array<LegendPayload>;
export declare function useLegendPayloadDispatch<Input>(computeLegendPayload: (input1: Input) => Array<LegendPayload>, input: Input): void;
