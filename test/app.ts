import { createServer } from "../src/index";
import test from "./api/test";

 

createServer().route("/aaa",function(ctx){
    return 666;
}).module("/api",test).listen();
