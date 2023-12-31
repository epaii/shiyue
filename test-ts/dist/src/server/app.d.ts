/// <reference types="node" />
import * as http from "http";
import { ResponseAdvice } from "./types";
import { ContextHandler, Controller, IController, InitHandler } from "./types";
export declare function createServer(): App;
export declare function defineController(controller: IController): IController;
export declare class App {
    private _port;
    private _routes;
    private _modules;
    private _inits;
    private _middlewares;
    private _responseAdvice;
    constructor(_port?: number);
    responseAdvice(handler: ResponseAdvice): this;
    success(res: http.ServerResponse, data?: {}): void;
    error(res: http.ServerResponse, msg: string, code?: number, data?: any): void;
    port(port: number): App;
    init(handler: InitHandler): App;
    use(handler: ContextHandler): App;
    route(route: string, handler: ContextHandler): App;
    module(route: string, module: String | Controller | Function | IController): App;
    findHander(pathname: string): {
        handler: ContextHandler;
        gets: string[];
    };
    callback(): Promise<(request: http.IncomingMessage, response: http.ServerResponse) => void>;
    listen(port?: number | null, httpsOptions?: null): Promise<any>;
}
