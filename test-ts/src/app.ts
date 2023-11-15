import {  ResponseAdvice, createServer } from "../../src/index";
import test from "./api/test";
 
  
type Unin<A,B> = A | B;

type TypeC = Unin<string,number>;

type TextToObject<A extends string> = {
    [key in A]:string
}

type TypeA = "name";

type ObjectTypeA = TextToObject<TypeA>;


let vara:ObjectTypeA = {
    name:"aaaaa"
};


function myfunctoin<T extends string>(name:T):TextToObject<T> {
    
}


let ddd = myfunctoin("6666");


createServer().route("/aaa",function(ctx){
    return 666;
}).module("/api",test).listen();
