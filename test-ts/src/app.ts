import {  ResponseAdvice, createServer } from "../../";
import test from "./api/test";

let myAdviece:ResponseAdvice = function(data,res){
   
    data.data  = JSON.stringify(data.data); 

    res.end(JSON.stringify(data));
}

 createServer().use(ctx=>ctx.success({d:5})).listen();

// createServer().route("/aaa",function(ctx){
//     return 666;
// }).module("/api",test).listen();
