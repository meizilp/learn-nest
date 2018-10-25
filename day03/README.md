# Nest 入门第3天

## 模块

模块是用来组织代码，使程序代码结构清晰。  
每个Nest应用至少有一个根模块。  
模块有4个可选属性：
1. providers: 可以在整个模块中共享的provider。
2. controllers: 本模块中的controller。
3. imports: 如果要使用其他模块中的provider或Controller，那么这儿要导入其他模块。
4. exports: 本模块能提供给其他模块使用的provider或Controller。

## Cats 模块

1. 生成cats模块：`nest g module cats`
2. cats.module.ts: 声明了本模块的Controller和Provider。
    ```ts
    import { Module } from '@nestjs/common';
    import { CatsController } from './cats.controller';
    import { CatsService } from './cats.service';

    @Module({
        controllers: [CatsController],
        providers: [CatsService],
    })
    export class CatsModule { }
    ```
    * 如果不声明Controller，此时nest框架不会加载此Controller，路由不会被处理。
    * 如果只声明Controller，不声明Provider，那么nest启动时因为找不到依赖关系会出错。
3. app.module.ts: 根模块，引入其他模块，nest才会加载。
    ```ts
    import { Module } from '@nestjs/common';
    import { CatsModule } from './cats/cats.module';

    @Module({
        imports: [CatsModule],
    })
    export class AppModule {}
    ```
    * 根模块中只需要引入模块就可以了，不再声明子模块中的Controller和Provider。
    * 根模块的代码中没有使用子模块的Provider，所以子模块不需要exports。
    * Controller是不能被exports的。

## 异常过滤器

1. HttpException类：定义在@nestjs/common中，当有异常时，可以抛出。

