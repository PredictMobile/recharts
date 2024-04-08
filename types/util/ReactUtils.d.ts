import React, { Component, FunctionComponent, ReactNode } from 'react';
import { DotProps } from '..';
import { FilteredSvgElementType, ActiveDotType } from './types';
export declare const SCALE_TYPES: string[];
export declare const getDisplayName: (Comp: React.ComponentType | string) => string;
export declare const toArray: <T extends React.ReactNode>(children: T | T[]) => T[];
export declare function findAllByType<ComponentType extends React.ComponentType, DetailedElement = React.DetailedReactHTMLElement<React.ComponentProps<ComponentType>, HTMLElement>>(children: ReactNode, type: ComponentType | ComponentType[]): DetailedElement[];
export declare function findChildByType<ComponentType extends React.ComponentType>(children: ReactNode[], type: ComponentType | ComponentType[]): React.DetailedReactHTMLElement<React.ComponentProps<ComponentType>, HTMLElement>;
export declare const validateWidthHeight: (el: any) => boolean;
export declare const isDotProps: (dot: ActiveDotType) => dot is DotProps;
export declare const isValidSpreadableProp: (property: unknown, key: string, includeEvents?: boolean, svgElementType?: FilteredSvgElementType) => boolean;
export declare const filterProps: (props: Record<string, any> | Component | FunctionComponent | boolean | unknown, includeEvents: boolean, svgElementType?: FilteredSvgElementType) => Record<string, any>;
export declare const isChildrenEqual: (nextChildren: React.ReactElement[], prevChildren: React.ReactElement[]) => boolean;
export declare const renderByOrder: (children: React.ReactElement[], renderMap: any) => React.ReactElement<any, string | React.JSXElementConstructor<any>>[];
export declare const getReactEventByType: (e: {
    type?: string;
}) => string;
export declare const parseChildIndex: (child: any, children: any[]) => number;