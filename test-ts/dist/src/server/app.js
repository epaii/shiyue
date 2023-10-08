"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = exports.defineController = exports.createServer = void 0;
const url = __importStar(require("url"));
const queryString = __importStar(require("querystring"));
const fs = __importStar(require("fs"));
const JsonResponseBodyAdvice_1 = require("../response/JsonResponseBodyAdvice");
function createServer() {
    return new App();
}
exports.createServer = createServer;
function defineController(controller) { return controller; }
exports.defineController = defineController;
class App {
    constructor(_port = 8010) {
        this._port = _port;
        this._routes = {};
        this._modules = {};
        this._inits = [];
        this._middlewares = [];
        this._responseAdvice = JsonResponseBodyAdvice_1.JsonResponseBodyAdvice;
    }
    responseAdvice(handler) {
        this._responseAdvice = handler;
        return this;
    }
    success(res, data = {}) {
        this._responseAdvice({
            success: true,
            msg: "成功",
            data: data
        }, res);
    }
    error(res, msg, code = 0, data = {}) {
        this._responseAdvice({
            success: false,
            code: code,
            msg: msg,
            data: data
        }, res);
    }
    port(port) {
        this._port = port;
        return this;
    }
    init(handler) {
        this._inits.push(handler);
        return this;
    }
    use(handler) {
        this._middlewares.push(handler);
        return this;
    }
    route(route, handler) {
        this._routes[route] = handler;
        return this;
    }
    module(route, module) {
        if (typeof module === "object") {
            this._modules[route] = {
                apps: module,
                name: route
            };
        }
        else if (typeof module === "function") {
            this._modules[route] = {
                apps: new module(),
                name: route
            };
        }
        else if (typeof module === "string") {
            if (!fs.existsSync(module)) {
                console.log(module + "is not exist");
                return this;
            }
            this._modules[route] = {
                dir: module,
                apps: {},
                name: route
            };
        }
        return this.route(route, (ctx) => __awaiter(this, void 0, void 0, function* () {
            let app_tmp = ctx.params("app", "index").split("@");
            if (app_tmp.length == 1)
                app_tmp[1] = "index";
            if (this._modules[route].dir) {
                if (!this._modules[route].apps[app_tmp[0]]) {
                    let file = this._modules[route].dir + "/" + app_tmp[0] + ".js";
                    if (!fs.existsSync(file)) {
                        file = this._modules[route].dir + "/" + app_tmp[0] + ".ts";
                    }
                    if (fs.existsSync(file)) {
                        let m = require(file);
                        if (m.default)
                            m = m.default;
                        if (typeof m === "function") {
                            m = new m();
                        }
                        this._modules[route].apps[app_tmp[0]] = m;
                    }
                    else {
                        this._modules[route].apps[app_tmp[0]] = {};
                    }
                }
                if (this._modules[route].apps[app_tmp[0]]) {
                    let thisMode = this._modules[route].apps[app_tmp[0]];
                    if (thisMode[app_tmp[1]]) {
                        if (thisMode.__run_use) {
                            if (!(yield thisMode.__run_use(ctx, app_tmp[1]))) {
                                return;
                            }
                        }
                        return this._modules[route].apps[app_tmp[0]][app_tmp[1]](ctx);
                    }
                    else {
                        ctx.error("没有处理器");
                    }
                }
            }
            else if (this._modules[route].apps[app_tmp[0]]) {
                if (this._modules[route].apps.__run_use) {
                    if (!(yield this._modules[route].apps.__run_use(ctx, app_tmp[0]))) {
                        return;
                    }
                }
                return this._modules[route].apps[app_tmp[0]](ctx);
            }
            else {
                ctx.error("没有处理器");
            }
        }));
    }
    findHander(pathname) {
        for (let key in this._routes) {
            if (key === pathname) {
                return { handler: this._routes[key], gets: [] };
            }
        }
        for (let key in this._routes) {
            const reg = new RegExp("^" + key, "i");
            const reg_info = reg.exec(pathname);
            if (reg_info) {
                return { handler: this._routes[key], gets: Array.from(reg_info) };
            }
        }
        throw new Error("没有handler");
    }
    callback() {
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < this._inits.length; i++) {
                yield this._inits[i](this);
            }
            return (request, response) => {
                try {
                    request.setEncoding('utf-8');
                    let url_info = url.parse(request.url, true);
                    let pathname = url_info.pathname;
                    let postData = "";
                    request.on("data", (postDataChunk) => {
                        postData += postDataChunk;
                    });
                    request.on("end", () => __awaiter(this, void 0, void 0, function* () {
                        let params = {};
                        try {
                            if (request.headers["content-type"] && (request.headers["content-type"].indexOf("json") > 0)) {
                                params = JSON.parse(postData.toString());
                            }
                            else {
                                let postString = postData.toString();
                                if (postString.length > 0) {
                                    params = JSON.parse(JSON.stringify(queryString.parse(postData.toString())));
                                }
                            }
                        }
                        catch (e) {
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
                            params(key, dvalue = null) {
                                if (arguments.length == 0)
                                    return params;
                                return params.hasOwnProperty(key) ? params[key] : dvalue;
                            },
                            paramsSet(key, value) {
                                params[key] = value;
                                return this;
                            },
                            success(data) {
                                that.success(this.res, data);
                                this.canNext = false;
                            },
                            error(msg = "error", code = 0, data = {}) {
                                that.error(this.res, msg, code, data);
                                this.canNext = false;
                            },
                            html(htmlString) {
                                this.res.setHeader('Content-Type', 'text/html; charset=utf-8');
                                this.res.end(htmlString);
                                this.canNext = false;
                            },
                            content(content) {
                                this.html(content);
                            }
                        };
                        let m_len = this._middlewares.length;
                        for (let i = 0; i < m_len; i++) {
                            yield this._middlewares[i](handler_object);
                            if (!handler_object.canNext) {
                                return;
                            }
                        }
                        let handler = this.findHander(pathname);
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
                        let out = yield doHandler(handler_object);
                        if (out !== undefined) {
                            this.success(response, out);
                        }
                    }));
                }
                catch (error) {
                    this.error(response, typeof error === "string" ? error : error.message);
                }
            };
        });
    }
    listen(port = null, httpsOptions = null) {
        return __awaiter(this, void 0, void 0, function* () {
            if (port !== null)
                this.port(port);
            try {
                if (httpsOptions) {
                    let server = require("https").createServer(httpsOptions, yield this.callback());
                    server.listen(this._port);
                    console.log("server start at port:" + this._port);
                    return server;
                }
                else {
                    let server = require("http").createServer(yield this.callback());
                    server.listen(this._port);
                    console.log("server start at port:" + this._port);
                    return server;
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.App = App;
