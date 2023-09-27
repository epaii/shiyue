
import * as http from "http";
import * as https from 'https';
import { App } from "./app";
import { type } from "os";

export type PromiseAble = Promise<void> | void


export interface Context {
    canNext:boolean,
    res: http.ServerResponse,
    req: http.IncomingMessage,
    shareData: Object,
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
    new(): IController;
    (): IController; 
}
