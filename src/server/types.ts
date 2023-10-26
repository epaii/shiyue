
import * as http from "http";
import { App } from "./app";


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
type TextMoreToKey<Str,S extends string> = Str extends `${infer O}${S}${infer REST}`?TextToKey<O> & TextMoreToKey<REST,S>:TextToKey<Str>

export type ArrayToObject<T extends string[]> = T extends [infer A, ...infer B] ? TextMoreToKey<A,","> & (B extends string[] ? ArrayToObject<B> : never) : {}



