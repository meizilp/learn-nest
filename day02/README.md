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

* 控制器初始代码：一个修饰符修饰的空类
```ts
import { Controller } from '@nestjs/common';

@Controller('cats')     //控制器响应的路由路径.'/cats'
export class CatsController {}
```

* app.module.ts中的更新，增加了新控制器`CatsController`的声明
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

2. 控制器中增加对路由路径和Get方法的响应

* '/cats'根路径'Get'
```ts
import { Controller, Get } from '@nestjs/common';

@Controller('cats')
export class CatsController {

    cats = [{ id: 100, name: 'Garfield' }, { id: 101, name: 'Tom' }];

    @Get()
    findAll() {
        return this.cats;
    }
}
```

* '/cats/:id' 。当使用/cats/100类似请求时，会获取制定id对象。
```ts
@Get(':id')
    findOne(@Param() param) {
        for (const cat of this.cats) {
            if (cat.id === +param.id) {
                return cat;     //可以直接返回对象，会转为json
            }
        }
        return { id: 0, name: 'not exist' };
    }
```

3. 运行调试

    1. 创建实例并等待运行：`npm run start:debug`
    2. 在VSCODE中按下`F5`，第一次会提示配置调试文件
        ```json
        {
            "version": "0.2.0",
            "configurations": [
                {
                    "type": "node",
                    "request": "attach",
                    "name": "调试程序",
                    "port": 9229
                }
            ]
        }
        ```
    3. 按下工具条中的运行，此时实例才能响应请求。
    4. 断点等直接在VSCODE中操作即可。
    5. 如果修改了代码，实例会重启创建并等待运行，并且VSCODE也会断开连接，此时要再次按下`F5`，再按下工具条中的运行。

4. 增加POST方法的响应

    1. 创建对象数据传输类'/src/cats/create-cat.dto.ts'
        ```ts
        export class CreateCatDto {
            readonly id: number;
            readonly name: string;
        }
        ```
    2. 控制器增加POST方法的响应
        ```ts
         @Post()
        create(@Body() newCat: CreateCatDto) {
            this.cats.push(newCat);
            return newCat;
        }
        ```
        BODY中传过来的数据会按照类中定义的成员完成格式化。

    通过Postman以x-www-form-urlencoded方式发送一个对象可以试试。

    ## 服务

    对于请求的逻辑业务应当由服务来处理，通过依赖注入的方式加载进入Controller来使用。

    1. 创建服务
    ```sh
    nest g service cats/cats    # 和控制器在同一个目录
    CREATE /src/cats/cats.service.spec.ts (442 bytes)
    CREATE /src/cats/cats.service.ts (88 bytes)
    UPDATE /src/app.module.ts (386 bytes)
    ```
    cats.service.ts : 定义了一个可以被注入的空类
    ```ts
    import { Injectable } from '@nestjs/common';

    @Injectable()
    export class CatsService {}
    ```
    app.module.ts : 增加了CatsService的声明
    ```ts
    @Module({
        imports: [],
        controllers: [AppController, CatsController],
        providers: [AppService, CatsService],
    })
    export class AppModule {}
    ```

    2. 业务逻辑实现

        1. cats.service.ts: 提供各种接口给Controller使用。
        ```ts
        import { Injectable } from '@nestjs/common';
        import { Cat } from './interfaces/cat.interface';

        @Injectable()
        export class CatsService {
            private readonly cats: Cat[] = [];

            findAll() {
                return this.cats;
            }

            findOne(id: number) {
                for (const cat of this.cats) {
                    if (cat.id === id) {
                        return cat;
                    }
                }
                return {};
            }

            create(newCatDto: CreateCatDto) {
                // 不解构dto，这样当dto结构发生变化时不影响此处代码。
                const cat = new Cat(newCatDto);
                this.cats.push(cat);
                return cat.id;
            }
        }
        ```
        2. cats.controller.ts :
        ```ts
        import { Controller, Get, Param, Post, Body } from '@nestjs/common';
        import { CreateCatDto } from './dto/create-cat.dto';
        import { Cat } from './interfaces/cat.interface';
        import { CatsService } from './cats.service';

        @Controller('cats')
        export class CatsController {

            constructor(private readonly catsService: CatsService) { }

            @Get()
            findAll() {
                return this.catsService.findAll();
            }

            @Get(':id')
            findOne(@Param('id') id) {
                return this.catsService.findOne(+id);
            }

            @Post()
            create(@Body() newCatDto: CreateCatDto) {
                return this.catsService.create(newCatDto); 
            }
        }
        ```
        3. create-cat.dto.ts : 移动到src/cats/dto目录。
        4. cat.interface.ts ：cat类的实现，可以直接通过createDto对象创建。
