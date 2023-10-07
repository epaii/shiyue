"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jeimi = exports.checkLogin = void 0;
function checkLogin(ctx) {
    if ((ctx.params("pd") + "") != "aadd") {
        ctx.error("密码错误");
    }
}
exports.checkLogin = checkLogin;
function jeimi(ctx) {
    ctx.paramsSet("name", ctx.params("name") + "haode");
}
exports.jeimi = jeimi;
