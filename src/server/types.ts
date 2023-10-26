
import * as http from "http";
import { App } from "./app";
import { type } from "os";


export type PromiseAble = Promise<void> | void


export interface Context {
    canNext: boolean,
    res: http.ServerResponse,
    req: http.IncomingMessage,
    shareData: Record<string, any>,
    data<T extends string[]>(...args: T): ArrayToObject<T>,
    paramsData<T extends string[]>(...args: T): ArrayToObject<T>,
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


export interface ResponseOriginData {
    data: any;
    success: boolean;
    msg?: string,
    code?: number
}

export type ResponseAdvice = (data: ResponseOriginData, res: http.ServerResponse) => void;

type TextToKey<Str> = Str extends string ? { [key in Str]: string } : never;
export type ArrayToObject<T extends string[]> = T extends [infer A, ...infer B] ? TextToKey<A> & (B extends string[] ? ArrayToObject<B> : never) : {}




