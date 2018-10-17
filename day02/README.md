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

