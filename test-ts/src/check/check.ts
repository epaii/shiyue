import { Context } from "../../../src";

export function checkLogin(ctx: Context) {
    
    if ( (ctx.params("pd")+"") != "aadd") {
         ctx.error("密码错误");
    }
}

export function jeimi(ctx: Context) {
    ctx.paramsSet("name",ctx.params("name")+"haode");
}