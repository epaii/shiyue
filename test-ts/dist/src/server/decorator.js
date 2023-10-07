"use strict";
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
exports.Use = void 0;
function runUse(uses, ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        for (let index = 0; index < uses.length; index++) {
            const element = uses[index];
            yield element(ctx);
            if (!ctx.canNext) {
                return false;
            }
        }
        return true;
    });
}
function Use(handler) {
    return (target, name) => {
        if (!target.prototype) {
            target.prototype = target;
        }
        if (name) {
            if (!target.prototype._name_use) {
                target.prototype._name_use = {};
            }
            if (!target.prototype._name_use[name]) {
                target.prototype._name_use[name] = [];
            }
            target.prototype._name_use[name].push(handler);
        }
        else {
            if (!target.prototype._class_use) {
                target.prototype._class_use = [];
            }
            target.prototype._class_use.push(handler);
        }
        if (!target.prototype.__run_use) {
            target.prototype.__run_use = function (ctx, key = null) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (target.prototype._class_use) {
                        if (!(yield runUse(target.prototype._class_use, ctx))) {
                            return false;
                        }
                    }
                    if (key !== null) {
                        if (target.prototype._name_use && target.prototype._name_use[key]) {
                            if (!(yield runUse(target.prototype._name_use[key], ctx))) {
                                return false;
                            }
                        }
                    }
                    return true;
                });
            };
        }
    };
}
exports.Use = Use;
