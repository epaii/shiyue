let {createServer} = require("../../");

createServer().use(ctx=>ctx.success("dddddd")).listen();
