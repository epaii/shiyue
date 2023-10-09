# shiyue 使用教程
简单但够用的nodejs web服务框架

## 安装

```javascript
npm i shiyue -S
```

## 基础使用

简单使用   写一个接口

```javascript
import {createServer } from "shiyue";

createServer().route("/",function(ctx){
    ctx.success('hello world')
}).listen(8888)
```

访问链接  [http://127.0.0.1:8888/](http://127.0.0.1:8888/aaa) 会成功返回

```javascript
{"success":true,"msg":"成功","data":'hello world',"code":1}
```

### **链式调用，写多个接口**

```javascript
createServer().route("/",function(ctx){
    ctx.success('hello world')
}).route("/api1",function(ctx){
    ctx.success("api1 data")
}).route("/api2",function(ctx){
    ctx.success("api2 data")
}).listen(8888)
```

`ctx` 为上下文对象 其结构主要为

```javascript
{
    res: http.ServerResponse;
    req: http.IncomingMessage;
    shareData: Object;
    params(key?: String, dvalue?: any): any;
    paramsSet(key: String, value: any): void;
    success(data: any): void;
    error(msg?: string, code?: Number, data?: any): void;
    html(html: String): void;
    content(content: String): void;
}
```

### 1、ctx.params()

获取 post 和 get 参数
假如我们在浏览器上面访问 /user 接口 后面拼接上账号和密码  想要获取到拼接到的数据
[http://127.0.0.1:8888/user?username=zhangsan&password=123456](http://127.0.0.1:8888/user?username=zhangsan&password=123456)

```javascript
createServer().route("/user",function(ctx){
    console.log(ctx.params()) // { username: 'zhangsan', password: '123456', '$$': '/user' }
    console.log(ctx.params("username"))  // zhangsan
    ctx.success("user data")
}).listen(8888)


```

### 2、ctx.success()

接口返回成功的值 

```javascript
createServer().route("/user",function(ctx){
    ctx.success("user data")
  
}).listen(8888)

// 浏览器页面会展示
{"success":true,"msg":"成功","data":"user data","code":1}
```

### 3、ctx.error()

接口返回失败的数据

```javascript
createServer().route("/user",function(ctx){
    ctx.error("user data")
}).listen(8888)

// 浏览器页面会展示
{"success":false,"code":0,"msg":"user data","data":{}}
```

### 4、ctx.html()

接口返回 html 格式的数据

```javascript
createServer().route("/user",function(ctx){
    ctx.html("user data")
}).listen(8888)

```
## **支持的方法（可链式调用）**
- route
- use
- port
- module
- listen
## 方法使用

### **一、设置端口号**

### 1、port()

```javascript
createServer().port(8888).route("/user",function(ctx){
    ctx.html("user data")
}).listen()
```

### 2、listen()

```javascript
createServer().route("/user",function(ctx){
    ctx.html("user data")
}).listen(8888)
```

> `如果两个同时设置 listen 设置的会把 port 设置的覆盖掉`

<br/>

### **二、use中间件**
中间件可以在每次web请求时做相应的业务处理

```js
createServer().use(function(ctx){
     console.log(" log1 ");
     ctx.shareData.key1 = "value1"
}).use( async function(ctx){
    //this.$service 中间件也可以使用this.$server
     await doSomeThing();
     console.log(" log2 "+ctx.shareData.key1);
}).route("/", function (ctx) {
    ctx.success(ctx.shareData.key1);
}).module("/user", __dirname + "/user").listen(8896);

```
在每一次请求时，都会先一次执行每一个中间件，然后再进入具体处理逻辑。

> 在中间件函数中也可以使用 `this.$service` 

>  可以通过`ctx.success(),ctx.error(),ctx.html()` 提前结束web请求，后面的中间件和相应的处理函数均不在执行。

> ### 中间件可通过`ctx.shareData` 来实现数据共享，每一个请求都会产生一个ctx,无论是在中间件中，还是在具体处理函数中，都可以通过`ctx.shareData` 来实现共享
<br/>

### **三、route接口模块**

  一个系统，我们一般分为多个模块，比如管理后台，用户中心，通过 `route`模式每一个api都需要设置，对于综合系统比较繁琐，而模块化正是解决类似的问题。

例如，我们有一个 user 用户模块，首先创建 user目录，然后在user目录下创建任意文件，如info.ts(js) 内容如下

```javascript
// ts写法
import { Context} from "shiyue"
export default class {
    user(ctx: Context) {
        return ctx.params()
    }
  	list(ctx: Context) {
        return ctx.params()
    }
}


// js写法

module.exports={
    user(ctx) {
        return ctx.params()
    },
    list(ctx) {
        return ctx.params()
    }
}

```

然后在入口文件改为

```javascript
// 设置路径
createServer().route("/",function(ctx){
    ctx.success("hello world");
}).module("/user",__dirname+"/user").listen(8896);


// 引入接口文件
import user from '/api/user'

createServer().route("/",function(ctx){
    ctx.success("hello world");
}).module("/user",user).listen(8896);


```

当访问[_http://127.0.0.1:8896/user?app=info@user_](http://127.0.0.1:8896/user?app=info@getInfoById) 就会返回

```json
{"success":true,"msg":"成功","data":{"app":"info@user","$$":"/api"},"code":1}
```
<br/>

### **四、module设置模块**
```javascript
 /**
  * route:设置模块名称
  * module:设置此模块的的路径 | 引入的模块类
  */
 module(route: string, module: Function | String | Controller | IController)
```

之后可以通过  http://127.0.0.1:8896/模块名称?app=文件名称@接口名称  的方式来访问。

*一个系统可以有多个模块，每一个模块可以有多个文件，每一个文件可以有多个具体方法*，一切就这么简单。

<br/> 

### **五、responseAdvice自定义返回数据**

**使用方法：**
假如前台想要的接口返回格式不是 `ctx.success` 、 `ctx.error`两种方法返回的格式
我们可以通过 `responseAdvice()`拦截到我们接口返回的数据，重新修改修改格式返回

```typescript
//ts
import {ResponseAdvice, createServer } from "shiyue";

const handle:ResponseAdvice = function(data,res){
  console.log(data)
  // data 是接口返回的数据也就是  user data
  // 通过 res.end() 重新返回接口数据格式 !!!
  res.end(JSON.stringify({code:1,data:data.data,msg:"success"}))
}
createServer().responseAdvice(handle).route("/user",function(ctx){
  ctx.success('user data')
}).listen(8888)

// 浏览器展示
{"code":1,"data":"user data","msg":"success"}
```
<br/>

### **六、注解（装饰器）!!**

假如我们现在有一个基本信息接口
在 api 文件夹下面有一个 user.ts 文件

```typescript
import { Context} from "shiyue"
export default class {
    user(ctx: Context) {
        ctx.success('user info')
    }
}

// 接口返回
{"success":true,"msg":"成功","data":{"app":"index@user","$$":"/api"},"code":1}

```

只有登录以后才能访问  我们可以这样写
新建一个 check.ts 文件

```typescript
import { Context } from "shiyue";

export function checkLogin(ctx: Context) {
    console.log("dddddddddddd")
    if ( (ctx.params("pd")+"") != "ceshi") {
         ctx.error("密码错误");
    }
}
```


### 在class类中使用方法（`注解仅对class类生效`）
```typescript
// ts写法
import { Context,Use} from "shiyue"
import { checkLogin } from "../check"
@Use(checkLogin) // 写到这里下面所有的接口都需要登录
export default class {
    // @Use(checkLogin) // 写到这里只对user接口起作用
    user(ctx: Context) {
        return ctx.params()
    }
}

// js写法
const { Use,Decorate} = require("shiyue")
const {checkLogin} = require("../check")

module.exports = class {
    user(ctx) {
        return ctx.params()
    }
}
//由于js中不支持装饰器写法，所以底层开放了一个类似装饰器功能的方法：Decorate
//1、对class类中的所有方法生效
Decorate(Use(checkLogin), module.exports);
//2、对class类中的某个方法生效
Decorate(Use(checkLogin), module.exports,'user');

```

