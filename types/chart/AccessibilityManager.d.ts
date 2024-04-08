import type { LayoutType, TickItem } from '../util/types';
interface ContainerOffset {
    top: number;
    left: number;
}
interface InitiableOptions {
    coordinateList?: TickItem[];
    mouseHandlerCallback?: (e: Partial<MouseEvent>) => void;
    container?: HTMLElement;
    layout?: LayoutType;
    offset?: ContainerOffset;
    ltr?: boolean;
}
export declare class AccessibilityManager {
    private activeIndex;
    private coordinateList;
    private mouseHandlerCallback;
    private container;
    private layout;
    private offset;
    private ltr;
    setDetails({ coordinateList, container, layout, offset, mouseHandlerCallback, ltr, }: InitiableOptions): void;
    focus(): void;
    keyboardEvent(e: any): void;
    setIndex(newIndex: number): void;
    private spoofMouse;
}
export {};
