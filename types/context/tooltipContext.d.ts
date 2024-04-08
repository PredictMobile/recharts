import { ChartCoordinate } from '../util/types';
export type TooltipContextValue = {
    label: string;
    payload: any[];
    coordinate: ChartCoordinate;
    active: boolean;
    index: number;
};
export declare const doNotDisplayTooltip: TooltipContextValue;
export declare const TooltipContextProvider: import("react").Provider<TooltipContextValue>;
export declare const useTooltipContext: () => TooltipContextValue;
