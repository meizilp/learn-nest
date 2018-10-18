# Nest 入门第2天

## 空项目结构

1. 根目录：

一堆配置文件。

2. src目录：

* main.ts 程序主入口，通过主Module创建实例。
```ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
```

* app.module.ts 程序主Module，声明了提供的Controller、Service
```ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

* app.controller.ts 根路径响应控制器,调用Service中的业务逻辑代码。
```ts
import { Get, Controller } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  root(): string {
    return this.appService.root();
  }
}
```

* app.service.ts 进行业务逻辑处理，通过依赖注入的方式被Controller使用。
```ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  root(): string {
    return 'Hello World!';
  }
}
```

## 路由

1. 路由路径: 可以请求的端点。可以包含正则表达式。
2. 路由参数：在服务器端支持的情况下，可以把路由路径中的一些位置用参数占位符（形参）代替，然后直接把请求中的值解析为参数值（实参）。  
    * 示例1：  
        * 带路由参数（以冒号开头）的路由路径：/users/:userID
        * 实际请求路径：/users/100
        * 解析之后{"userId":"100"}
    * 示例2：多个参数
        * /users/:userID/books/bookID
        * /users/100/books/8888
        * {"userID":"100", "bookID":"8888"}
    * 示例3：以连字符'-'或'.'连接的多个参数
        * /flights/:from-:to；/location/:province.:city
        * /flights/BeiJing-ShangHai；/location/Shandong.Jinan
        * {"from":"BeiJing", "to":"ShangHai"}；{"province":"Shandong", "city":"Jinan"}

## 控制器

1. 创建控制器：
```sh
nest g co cats
CREATE /src/cats/cats.controller.spec.ts (471 bytes)
CREATE /src/cats/cats.controller.ts (97 bytes)
UPDATE /src/app.module.ts (322 bytes)
```

2. 控制器初始代码：一个修饰符修饰的空类
```ts
import { Controller } from '@nestjs/common';

@Controller('cats')     //控制器响应的路由路径
export class CatsController {}
```

3. app.module.ts中的更新，增加了新控制器`CatsController`的声明
```ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsController } from './cats/cats.controller';

@Module({
  imports: [],
  controllers: [AppController, CatsController],
  providers: [AppService],
})
export class AppModule {}
```

