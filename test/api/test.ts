
import { Context, ContextHandler, Controller, IController, defineController } from "../../src"

import { Use } from "../../src/server/decorator";
import { checkLogin, jeimi } from "../check/check";


@Use(checkLogin)
@Use(jeimi)
export default class {

    
    aa(ctx: Context) {
        return ctx.params();
    }

    v(ctx: Context) {
        return ctx.params();
    }
}








