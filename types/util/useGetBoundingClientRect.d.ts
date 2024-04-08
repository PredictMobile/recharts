export type BoundingBox = {
    width: number;
    height: number;
};
export type SetBoundingBox = (node: HTMLElement | null) => void;
export declare function useGetBoundingClientRect(onUpdate: undefined | ((boundingBox: BoundingBox | null) => void), extraDependencies: ReadonlyArray<unknown>): [BoundingBox, SetBoundingBox];
