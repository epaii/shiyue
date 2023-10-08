
let { Use, Decorate } = require("../../../src/server/decorator");
let { checkLogin, jeimi } = require("../check/check");



module.exports =  class {
    aa(ctx) {
        return ctx.params();
    }

    v(ctx) {
        return ctx.params();
    }
}

Decorate(Use(checkLogin),module.exports);
Decorate(Use(jeimi),module.exports,"aa");



 







