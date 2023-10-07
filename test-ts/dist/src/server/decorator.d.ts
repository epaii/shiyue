import { ContextHandler } from "./types";
type Decorator<T> = (target: T, name?: any) => void;
export declare function Use(handler: ContextHandler): Decorator<any>;
export {};
