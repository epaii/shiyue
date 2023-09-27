import { Context, ContextHandler, Controller } from "./types";
type Decorator<T> = (target: T, name?: any) => void;

async function runUse(uses: ContextHandler[], ctx: Context): Promise< boolean >{
    for (let index = 0; index < uses.length; index++) {
        const element = uses[index];
        await element(ctx);
        if (!ctx.canNext) {
            return false;
        }

    }
    return true;
}

export function Use(handler: ContextHandler): Decorator<any> {

    return (target: any, name?: any) => {
        if(!target.prototype)
        {
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
        } else {
            if (!target.prototype._class_use) {
                target.prototype._class_use = [];
            }
            target.prototype._class_use.push(handler);
        }

        if (!target.prototype.__run_use) {
          
            target.prototype.__run_use = async function (ctx:Context, key: string | null = null) {
               
                if (target.prototype._class_use) {
                    if(! await runUse(target.prototype._class_use,ctx)){
                        return false;
                    }
                }
                
                if (key !== null) {
                    
                    if ( target.prototype._name_use &&  target.prototype._name_use[key]) {
                        if(! await runUse(target.prototype._name_use[key],ctx)){
                            return false;
                        }
                    }
                }
                return true;
            }
        }

    }

}