/// <reference types="node" />
import * as http from "http";
import { App } from "./app";
export type PromiseAble = Promise<void> | void;
export interface Context {
    canNext: boolean;
    res: http.ServerResponse;
    req: http.IncomingMessage;
    shareData: Object;
    params(key?: String, dvalue?: any): any;
    paramsSet(key: String, value: any): void;
    success(data: any): void;
    error(msg?: string, code?: Number, data?: any): void;
    html(html: String): void;
    content(content: String): void;
}
export interface ContextHandler {
    (ctx: Context): any;
}
export type IController = Record<string, ContextHandler>;
export interface InitHandler {
    (app: App): PromiseAble;
}
export interface Controller {
    new (): IController;
    (): IController;
}
export interface ResponseOriginData {
    data: any;
    success: boolean;
    msg?: string;
}
export type ResponseBodyAdvice = (data: ResponseOriginData) => string | Promise<string>;
