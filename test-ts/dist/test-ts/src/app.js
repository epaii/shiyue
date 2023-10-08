"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../../");
let myAdviece = function (data, res) {
    data.data = JSON.stringify(data.data);
    res.end(JSON.stringify(data));
};
(0, __1.createServer)().use(ctx => ctx.success({ d: 5 })).listen();
// createServer().route("/aaa",function(ctx){
//     return 666;
// }).module("/api",test).listen();
