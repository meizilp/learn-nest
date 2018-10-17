# nestjs 入门

1. 创建工程：
```sh
npm init
tsc --init
npm i --save @nestjs/core @nestjs/common rxjs reflect-metadata @types/node
```

2. 修改tsconfig.json文件
```json
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "noImplicitAny": false,
    "removeComments": true,
    "noLib": false,
    "allowSyntheticDefaultImports": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "target": "es6",
    "sourceMap": true,
  }
}
```

3. 编写app.controller.ts
```ts
import { Get, Controller } from "@nestjs/common";

@Controller()   //控制器装饰器，标识下面的类是一个Controller。默认响应根路径。
export class AppController {
    @Get()  //Get请求装饰器。默认响应跟路径的Get请求
    root(): string {
        return 'Hello nest!'    //返回响应值
    }
}
```

4. 编写app.module.ts
```ts
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";

@Module({   //Module装饰符
    controllers: [AppController],   //引用指定的控制器
})
export class ApplicationModule { }
```

5. 编写main.ts
```ts
import { NestFactory } from "@nestjs/core";
import { ApplicationModule } from "./app.
async function bootstrap() {
    const app = await NestFactory.create(ApplicationModule);    //工厂函数使用给定的函数创建实例
    await app.listen(3000);
}

bootstrap();
```

6. 编译：`tsc`
7. 运行：`node main.js`
8. 验证：浏览器访问 <localhost:3000>

## 总结

1. 创建实例需要一个Module；
2. Module中引用了Controller；
3. Controller对请求进行响应。
