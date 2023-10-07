import * as http from "http";
import * as url from 'url';
import * as queryString from 'querystring';

import { Context, ResponseAdvice } from "./types";
import { ContextHandler, Controller, IController, InitHandler } from "./types";
import * as fs from "fs";
import { JsonResponseBodyAdvice } from "../response/JsonResponseBodyAdvice";

type ModuleInfo = {
    apps: Record<string, ContextHandler | IController>,
    name: string,
    dir?: string
}

export function createServer(): App {
    return new App();
}

export function defineController(controller: IController): IController { return controller; }

export class App {

    private _routes: Record<string, ContextHandler> = {}
    private _modules: Record<string, ModuleInfo> = {};
    private _inits: InitHandler[] = [];
    private _middlewares: ContextHandler[] = [];

    private _responseAdvice: ResponseAdvice = JsonResponseBodyAdvice;

    constructor(private _port: number = 8010) {

    }
    responseAdvice(handler: ResponseAdvice) {
        this._responseAdvice = handler;
        return this;
    }

    success(res: http.ServerResponse, data = {}) {
        this._responseAdvice({
            success: true,
            msg: "成功",
            data: data
        }, res)
    }
    error(res: http.ServerResponse, msg: string, code = 0, data: any = {}) {
        this._responseAdvice({
            success: false,
            code: code,
            msg: msg,
            data: data
        }, res)
    }
    port(port: number): App {
        this._port = port;
        return this;
    }
    init(handler: InitHandler): App {
        this._inits.push(handler);
        return this;
    }
    use(handler: ContextHandler): App {
        this._middlewares.push(handler);
        return this;
    }
    route(route: string, handler: ContextHandler): App {
        this._routes[route] = handler;
        return this;
    }
    module(route: string, module: String | Controller | Function | IController): App {


        if (typeof module === "object") {
            this._modules[route] = {
                apps: module as Record<string, ContextHandler>,
                name: route
            }
        } else if (typeof module === "function") {
            this._modules[route] = {
                apps: new module(),
                name: route
            }

        } else if (typeof module === "string") {

            if (!fs.existsSync(module)) {
                console.log(module + "is not exist");
                return this;
            }

            this._modules[route] = {
                dir: module,
                apps: {

                },
                name: route
            }
        }
        return this.route(route, async (ctx: Context) => {
            let app_tmp = ctx.params("app", "index").split("@");
            if (app_tmp.length == 1) app_tmp[1] = "index";
            if (this._modules[route].dir) {
                if (!this._modules[route].apps[app_tmp[0]]) {
                    let file = this._modules[route].dir + "/" + app_tmp[0] + ".js";
                    if (!fs.existsSync(file)) {
                        file = this._modules[route].dir + "/" + app_tmp[0] + ".ts";
                    }
                    if (fs.existsSync(file)) {
                        let m = require(file);
                        if (m.default) m = m.default;
                        if (typeof m === "function") {
                            m = new m();
                        }
                        this._modules[route].apps[app_tmp[0]] = m;
                    } else {
                        this._modules[route].apps[app_tmp[0]] = {};
                    }
                }

                if (this._modules[route].apps[app_tmp[0]]) {

                    let thisMode = this._modules[route].apps[app_tmp[0]] as Record<string, ContextHandler>;
                    if (thisMode[app_tmp[1]]) {
                        if (thisMode.__run_use) {
                            if (! await (thisMode.__run_use as (ctx: Context, name: string) => Promise<boolean>)(ctx, app_tmp[1])) {
                                return;
                            }
                        }
                        return (this._modules[route].apps[app_tmp[0]] as Record<string, ContextHandler>)[app_tmp[1]](ctx);
                    } else {
                        ctx.error("没有处理器");
                    }
                }
            } else if (this._modules[route].apps[app_tmp[0]]) {

                if (this._modules[route].apps.__run_use) {
                    if (! await (this._modules[route].apps.__run_use as (ctx: Context, name: string) => Promise<boolean>)(ctx, app_tmp[0])) {
                        return;
                    }
                }
                return (this._modules[route].apps[app_tmp[0]] as ContextHandler)(ctx);
            } else {
                ctx.error("没有处理器");
            }

        })


    }

    findHander(pathname: string) {
        for (let key in this._routes) {
            if (key === pathname) {
                return { handler: this._routes[key], gets: [] }
            }
        }
        for (let key in this._routes) {

            const reg = new RegExp("^" + key, "i");
            const reg_info = reg.exec(pathname);
            if (reg_info) {

                return { handler: this._routes[key], gets: Array.from(reg_info) }
            }
        }
        throw new Error("没有handler");
    }

    async callback() {

        for (let i = 0; i < this._inits.length; i++) {
            await this._inits[i](this);
        }

        return (request: http.IncomingMessage, response: http.ServerResponse) => {

            try {
                request.setEncoding('utf-8');
                let url_info = url.parse(request.url as string, true);

                let pathname = url_info.pathname as string;

              

                let postData = "";
                request.on("data", (postDataChunk) => {
                    postData += postDataChunk;
                });

                request.on("end", async () => {

                    let params: any = {};
                    try {
                        if (request.headers["content-type"] && (request.headers["content-type"].indexOf("json") > 0)) {
                            params = JSON.parse(postData.toString());
                        } else {
                            let postString = postData.toString();
                            if (postString.length > 0) {
                                params = JSON.parse(JSON.stringify(queryString.parse(postData.toString())));
                            }
                        }
                    } catch (e) {
                        params = {};
                    }

                    Object.assign(params, url_info.query);

                    params["$$"] = pathname;

                    let that = this;
                    let handler_object = {

                        req: request,
                        res: response,
                        canNext: true,
                        shareData: {},
                        params(key: string, dvalue: any = null) {

                            if (arguments.length == 0) return params;
                            return params.hasOwnProperty(key) ? params[key] : dvalue;
                        },
                        paramsSet(key: string, value: string) {
                            params[key] = value;
                            return this;
                        },
                        success(data: any) {
                            that.success(this.res, data);
                            this.canNext = false;
                        },
                        error(msg = "error", code = 0, data = {}) {
                            that.error(this.res, msg, code, data);
                            this.canNext = false;
                        },
                        html(htmlString: string) {
                            this.res.setHeader('Content-Type', 'text/html; charset=utf-8');
                            this.res.end(htmlString);
                            this.canNext = false;
                        },
                        content(content: string) {
                            this.html(content);
                        }

                    };

                    let m_len = this._middlewares.length;
                    for (let i = 0; i < m_len; i++) {
                        await this._middlewares[i](handler_object);
                        if (!handler_object.canNext) {
                            return;
                        }
                    }
                    let handler = this.findHander(pathname as string);

                    for (let i = 0; i < handler.gets.length; i++) {
                        params["$" + i] = handler.gets[i];
                    }
                    
                    let doHandler = handler.handler;
                    if (this._modules[pathname]) {
                        if (!params.app) {
                            let app_tmp_s = (pathname.endsWith("/") ? pathname : `${pathname}/`).split("/");
                            params.app = app_tmp_s[2] + (app_tmp_s.length > 3 ? ("@" + app_tmp_s[3]) : "");
                        }
                    }

                    let out = await doHandler(handler_object)
                    if (out !== undefined) {
                        this.success(response, out);
                    }

                });

            }
            catch (error: any) {
                this.error(response, typeof error === "string" ? error : error.message);
            }
        }


    }

    async listen(port: number | null = null, httpsOptions = null) {
        if (port !== null) this.port(port);
        try {
            if (httpsOptions) {
                let server = require("https").createServer(httpsOptions, await this.callback());
                server.listen(this._port);
                console.log("server start at port:" + this._port)

                return server;
            } else {
                let server = require("http").createServer(await this.callback());
                server.listen(this._port);
                console.log("server start at port:" + this._port)

                return server;
            }
        } catch (error) {
            console.log(error);
        }

    }
}