"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const decorator_1 = require("../../../src/server/decorator");
const check_1 = require("../check/check");
let default_1 = class {
    aa(ctx) {
        return ctx.params();
    }
    v(ctx) {
        return ctx.params();
    }
};
__decorate([
    (0, decorator_1.Use)(check_1.jeimi)
], default_1.prototype, "aa", null);
default_1 = __decorate([
    (0, decorator_1.Use)(check_1.checkLogin),
    (0, decorator_1.Use)(check_1.jeimi)
], default_1);
exports.default = default_1;
