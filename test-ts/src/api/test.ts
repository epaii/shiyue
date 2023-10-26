
import { Context, ContextHandler, Controller, IController, defineController } from "../../../src"

import { ParamsRequired, Use } from "../../../src/server/decorator";
import { checkLogin, jeimi } from "../check/check";


@Use(checkLogin)
@Use(jeimi)
export default class {

    @Use(jeimi)
    @ParamsRequired("ddddddd")
    aa(ctx: Context) {
       let d =  ctx.data("a,c","b");
    
        return ctx.params();
    }

    v(ctx: Context) {
        return ctx.params();
    }
}








