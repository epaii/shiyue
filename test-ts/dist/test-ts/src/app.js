"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../src/index");
const test_1 = __importDefault(require("./api/test"));
(0, index_1.createServer)().route("/aaa", function (ctx) {
    return 666;
}).module("/api", test_1.default).listen();
