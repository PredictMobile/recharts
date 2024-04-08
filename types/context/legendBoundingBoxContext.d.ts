import { BoundingBox } from '../util/useGetBoundingClientRect';
type OnLegendBoundingBoxUpdate = (legendBoundingBox: BoundingBox) => void;
export declare const LegendBoundingBoxContext: import("react").Context<OnLegendBoundingBoxUpdate>;
export {};
