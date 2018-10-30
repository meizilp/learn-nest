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

修改photo.module.ts, imports在当前模块注册typeorm模块，如果不注册，service中会DI失败
```ts
```

定义photo的entity：photo.entity.ts
```ts
}
```
* TypeOrmModule初始化的时候会构造一个Entity对象，所以Entity的构造函数必须是无参数或者处理参数未定义时的情况。
* 所以dto、entity、逻辑对象分开定义最好，避免互相干扰。

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

## TypeORM

参见<http://typeorm.io>

配置文件：ormconfig.json

    * type:必须
    * name:默认值default，多个连接时需要自己命名
    * entities:要使用此连接的entity代码路径，找到entity代码后，typeorm库会初始化。
    * migrations：数据库升级的代码
    * logging:设置为true后可以在控制台看到执行的sql语句。
    * maxQueryExecutionTime：查询最大执行时间，超时则记录查询。可以用于优化。
    * dropSchema:每次程序启动时都清空数据库（用于调试）。
    * synchronize：每次程序启动自动创建数据库以及表（便于调试，但不要用于生产环境）

Entity:

  * @Entiy()装饰器来修饰类。
  * 必须有一个主列。
  * 必须在连接选项中注册，因为typeorm需要读取装饰器提供的信息。
  * 如果有构造函数，其参数必须是可选的。
   
  列：@Column()装饰器修饰类。

  1. 主列：@PrimaryColumn()、自增主列:@PrimaryGeneratedColumn()、uuid主列@PrimaryGeneratedColumn（"uuid")，可以有多个主列。
  2. save以及find时都是以id或者ids列为准的。
  3. 特殊列：@CreateDateColumn()、@UpdateDateColumn()、@VersionColumn()
  4. 列类型：可以指定更精确的类型。
      * 常见的：int、text等等。不同的数据库不同。
      * 简单数组类型：数组元素如果值中不包含逗号，可以存到一个列中，指定类型@Column("simple-array")。
      * 简单json类型： @Column("simple-json")。可以把一个对象以json形式存储在一个列中，并通过JSON.parse解析为原来的对象。
  5. 类选项：可以指定type、length、name、nullable、readonly、default、unique等。

  Entity的继承：
    把公共列放到一个类中，但是这个类不要用装饰符修饰。其他子类extends此类，并用@Entity修饰。

  Entity的嵌入：
    通过嵌入可以解决所有的字段都被迫展开在一层的问题，使得及结构更清晰。被嵌入的类不要用修饰符修饰，只要列仍然正常的修饰即可。然后通过@Column(type => 被嵌入的类名称)，来说明这列是嵌入的，实际上是多列。

  分离Entity的定义：
    单独的用代码文件定义Entity的Schema，cli也能处理。不过看上去似乎挺麻烦的。
    

  树结构的存储：有4中方案可以采用。节点都要同样的Entity？
    <https://www.slideshare.net/billkarwin/models-for-hierarchical-data> 69页做了对比
    <https://schinckel.net/2014/09/13/long-live-adjacency-lists/>
    Adjacency List: 最简单。但对于获取子树不利。如果树深度不深可以就可以回避了。
    Path Enumeration:对写入不利。
    Nested Sets:只能有一个根节点。写入也不利。
    Closure Table:需要两个表，空间相对需要比较大。
    TypeOrm对直接操作tree做了一下封装，以便于使用。

关系：Entity之间可以有一对一、一对多、多对一、多对多的关系，并且可以是单向或者双向的。
    关系创建时可以指定选项：
        eager：对象加载时是否把关联的字段也自动加载填充了。
        cascade：对象存储时是否把关联的资源也自动存储了。
        onDelete：当指向的对象被删除时，外键如何处理。
        primary：关系列是否设置为一个主列。
        nullable：关系列是否可以为空。
    一对一：@OneToOne
        单向：
            ```ts
            @OneToOne(type => Profile)
            @JoinColumn()
            profile: Profile;
            ```
            * @OneToOne：type是个占位符，函数返回Profile类型，表示指向的是个Profile类型的对象；
            * @JoinColumn：表示这边是关系的拥有者。这个装饰符只能用在关系中其中一边的Entity中，这个装饰符定义了关系的名称，此处默认的是字段名profile，并且数据库中会在此Entity的表中增加一列外键指向目标Entity。
            加载对象：
            ```ts
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find({ relations: ["profile"] });
            ```
            * 传递了关系名称，才会加载相应的关系对象到字段中。或者设置eager为true。
        双向：
            两个Entity中都要用@OneToOne，并且参数要建立两个关系。
            Entity 'Profile':
            ```ts
            @OneToOne(type => User, user => user.profile) // 本字段指向User对象；user对象中的profile字段指向本对象。
            user: User;
            ```
            Entity 'User':
            ```ts
            @OneToOne(type => Profile, profile => profile.user) //本字段指向Profile对象，profile对象中的user字段指向本对象。
            @JoinColumn()
            profile: Profile;
            ```
    多对一和一对多：@ManyToOne @OneToMany
            Photo Entity:
            ```ts
            @ManyToOne(type => User, user => user.photos) //本字段指向User对象，user中的photos字段指向本对象。
            user: User;
            ```
            User Entity:
            ```ts
            @OneToMany(type => Photo, photo => photo.user) //本字段指向Photo对象，photo中的user字段指向本对象
            photos: Photo[];
            ```
            @OneToMany必须和@ManyToOne搭配使用。包含有@ManyToOne的Entity拥有此关系（命名关系名称以及创建外键，不必再用@JoinColumn声明哪个是主。）
    多对多：@ManyToMany
            单向时只要在其中的一个Entity中放入指令即可，TypeOrm会创建一个关联表记录两个Entity之间的关系。
            ```ts
            @ManyToMany(type => Category)
            @JoinTable()
            categories: Category[];
            ```

            双向时，两个Entity中都要放入指令，
            Category Entity:
            ```ts
            @ManyToMany(type => Question, question => question.categories)
            questions: Question[];
            ```
            Question Entity:
            ```ts
            @ManyToMany(type => Category, category => category.questions)
            @JoinTable()
            categories: Category[];
            ```
            只能在其中一个Entity中使用@JoinTable()
    Eager和lazy关系：
        Eager设置为true时，这样的关系每次都自动把关联的Entity从数据库中加载。无需额外操作。
        Lazy关系是通过Promise实现，当要访问字段时再真正加载。只支持Nodejs或者JS上才能实现。
    关系相关FAQ：
        * 如何创建自引用关系（比如用于tree结构）：和其他关系一样，没特殊处理。
        * 如何不加载关联的Entity，而知道关联Entity的id：在Entity中增加一个列，这个列的名称是'关系名'+'Id'，这样就会把外键填入这个字段了。
        * 如何手动通过关系加载Entity：find时传递参数，通过relations字段指明要使用的关系。
        * 避免关系属性初始化：因为一旦初始化了关系属性，那么保存这个Entity时，这个关系属性如果没有真正从数据库中加载过，那么就会把初始值保存到数据库，而导致真正的关系被删除。

Entity Manager和Repository:
    EntityManager用来操作Entity的增删改查等。
    Repository类似于EntityManager，只是操作限制在指定的类型中。有三种Repository：
        * Repository：普通Repository。
        * TreeRepository：树结构，多了一些树的操作。
        * MongoRepositroy：多了一些操作Mongo数据库的额操作。
    Find Options：在调用find函数时通过参数对象可以实现很多条件过滤。
        select:string[] 要返回的字段
        relations:string[] 要加载的关系，如果有子关系，那么通过.连接起来，比如videos.video_attr。
        join:比relations更灵活。
        where：where子句。
        order:排序。可以多个字段分别指明排序方式。
        skip：跳过多少记录。
        take：取多少记录。
        cache：是否启用缓存。启用后在设置时间内的查询直接读取cache以加快速度。
        Not函数：不等于
        LessThan、MoreThan、Equal：小于、大于、等于
        Like：模糊匹配
        BETWEEN：在值之间。
        IN：在值的集合中。
        ANY：支持子查询。
        IsNull：为空。
        Raw：执行原始SQL语句。
    自定义Repository：为啥要自定义Repository？弄在Entity上不可以吗？
    API：

Query Builder：
    更灵活强大的查询。
    子查询：

数据库迁移：
    可以使用自动生成sql的命令，会对比当前配置的db和entity的区别，自动生成sql，但是只是schema变化，数值的变化仍然需要手动sql。
    在config文件中要给cli指明存储路径，要给run指明迁移的文件有哪些，当run之后，会把迁移信息保存到db中。
事务：
索引：
Entity操作监听：
日志：
命令行：

Demo样例：
    Thing：树结构。
        id
        Tag：多对多，一个标签可以有多个Task，Task可以有多个标签。
        创建时间：嵌入Entity
        创建人：一对一
        截止时间：
        类型：Todo、Project、Target、Folder
        Title：
        Note：一对多，可以有多个Note。
        执行人：多对多
        重复模式：一对一
        状态：
        操作日志：一对多，记录每次修改的内容。
        时间追踪：一对多
        估算时长：
        计划开始时间：
        状态：
        完成时间：
        附件：
        优先级：
        重要度：
        NextReview:
        Flag:
        deleted:

    Entity：Thing、Tag、MyDateTime、People、Note、RepeatMode、TimeTrack、Operation
        Thing Module:Thing、MyDateTime、Note、RepeatMode
        People Module：People
        TimeTrack Module：TimeTrack
        Operation Module：Operation
        Tag Module: Tag

        创建module： nest g mo thing; nest g mo people; nest g mo time-track;nest g mo operaton; nest g mo tag
        创建Controller：
        创建Service：
        创建Entity：新建以.entity.ts为扩展名的文件。
            创建类。

        修改各module，在各module中imports typeorm

GTasks API:
    https://developers.google.com/tasks/v1/reference/
