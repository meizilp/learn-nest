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
  })],
```

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

修改photo.module.ts, imports在当前模块注册

修改photo.service.ts，提供photo数据的增删改查功能：
```ts
```
* 构造函数通过依赖注入，获得操作Photo的Repository对象

修改photo.controller.ts，进行路由处理：
```ts
```

运行查看效果：
`npm run start`

如果类里面save的时候没有用给定的类会怎么样？