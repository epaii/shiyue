import { ContextHandler } from "./types";
type Decorator<T> = (target: T, name?: any) => void;
export declare function Use(handler: ContextHandler): Decorator<any>;
export declare function Decorate<T>(decorator: Decorator<any>, target: T, key?: string | null): T;
export {};
