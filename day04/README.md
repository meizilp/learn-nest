# Nest 入门第4天

## 数据库

用TypeORM来实现，并且nest做了进一步的封装。

本次用sqlite3来验证，安装包：
`npm i @nestjs/typeorm typeorm sqlite3`

app.module.ts修改：动态模块加载。
```ts
imports: [TypeOrmModule.forRoot({
    type: 'sqlite',
    database: './main.db',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: true,
  })],
```
* 调试环境下可以用synchronize属性，来自动创建表。
* 生产环境下通过cli来创建数据库的schema。如果是基于typescript文件创建，那么要用到ts-node
    ```sh
    npm i ts-node --save-dev
    ts-node ./node_modules/typeorm/cli.js schema:log
    ```
    这个命令可以可以看到创建schema会执行的sql。另外配置要放到项目根目录的ormconfig.json文件中才可以。

新建photo模块及Controller、Service：
```sh
nest g mo photo
nest g co photo
nest g s photo photo # 创建服务时要带上path，否则创建到根目录了。
```

定义photo的entity：photo.entity.ts
```ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Photo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 500 })
    name: string;

    @Column('text')
    description: string;

    @Column()
    filename: string;

    @Column('int')
    views: number;

    @Column()
    isPublished: boolean;
}
```
* TypeOrmModule初始化的时候会构造一个Entity对象，所以Entity的构造函数必须是无参数或者处理参数未定义时的情况。
* 所以dto、entity、逻辑对象分开定义最好，避免互相干扰。

修改photo.module.ts, imports在当前模块注册typeorm模块，如果不注册会service中会DI失败

修改photo.service.ts，提供photo数据的增删改查功能：
```ts
```
* 构造函数通过依赖注入，获得操作Photo的Repository对象
* save、insert、remove、delete的操作各不相同，主要是存在关系的对象操作不同

修改photo.controller.ts，进行路由处理：
```ts
```

运行查看效果：
`npm run start`
