"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonResponseBodyAdvice = void 0;
function JsonResponseBodyAdvice(data, res) {
    res.setHeader('Content-Type', 'application/json;charset:utf-8');
    if (data.success)
        data.code = 1;
    res.end(JSON.stringify(data));
}
exports.JsonResponseBodyAdvice = JsonResponseBodyAdvice;
