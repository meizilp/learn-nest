# Nest 入门第4天

用TypeORM来实现，并且nest做了进一步的封装。  
本次用sqlite3来验证，安装依赖包：`npm i @nestjs/typeorm typeorm sqlite3`。

## 配置及引用

1. 在项目根目录创建配置文件`ormconfig.json`:
    ```json
    {
        "type": "sqlite",
        "database": "./main.db",
        "synchronize": true,
        "logging": true,
        "entities": [
            "src/**/entity/**{.ts,.js}"
        ],
        "migrations": [
            "migration/*.ts"
        ],
        "cli": {
            "migrationsDir": "migration"
        }
    }
    ```
    * 使用配置文件是便于通过typeorm的cli读取配置。
    * `type`指明了使用的数据库类型，详见TypeORM文档。
    * `database`数据库的存储文件（针对sqlite）
    * `synchronize`程序启动时是否自动创建数据库中的表，生产环境应设置为`false`以避免数据库被破坏，调试环境可以设为`true`便于调试。
    * `logging`是否显示日志，调试环境可以设置为`true`可以看到对数据库的操作。
    * `entities`存放Entity定义的目录或者文件，在TypeOrm加载时会处理这些文件，读取信息进行初始化。
    * `migrations`数据库升级要执行的代码。在cli或者TypeOrm加载时可以执行这些代码。
    * `cli`命令行相关的配置。`migrationsDir`指明通过cli生成migration代码时保存代码的位置。
2. 修改`app.module.ts`：动态加载TypeOrm模块。
    ```ts
    imports: [TypeOrmModule.forRoot()],
    ```
    * `formRoot`没有参数时会TypeOrm会默认读取配置文件获取配置信息。
3. 定义Entity：
    新建photo的Module、Controller、Service、Entity：
    ```sh
    nest g mo photo # 创建photo.module.ts
    nest g co photo # 创建photo.controller.ts
    nest g s photo photo # 创建photo.service.ts
    typeorm entity:create -n Photo -d src/photo/entity # 创建Photo.ts
    ```
    修改`photo.module.ts`:
    ```ts
    //动态引入TypeOrmModule，这样Photo Module中才能使用此模块中的内容。
    imports: [TypeOrmModule.forFeature([Photo])],  
    ```
    修改`photo.controller.ts`：调用photo service中的接口实现路由的处理。  
    修改`photo.service.ts`： 
    ```ts
     constructor(
        // 通过依赖注入得到操作Photo Entity的Repository
        @InjectRepository(Photo)
        private readonly photoRepository: Repository<Photo>,
    ) { }

    async findAll() {
        // 通过Repository的接口进行数据库查询
        return await this.photoRepository.find();
    }
    ```
    修改`entity/Photo.ts`:
    ```ts
    import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

    // 标记Entity类
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

        @Column('int', { default: 0 })
        views: number;
    }
    ```
    * 如果有构造函数，那么构造函数的参数必须是可选的。因为TypeOrm初始化时会新建一个Entity对象以获取Entity的信息，如果构造函数的参数不可选，那么TypeOrm初始化不知道如何传递参数值，初始化就会失败。

4. 通过typeorm cli创建数据库Schema：  
    因为要处理ts代码，所以先安装`ts-node`模块：
    ```sh
    npm i ts-node --save-dev
    ```
    执行前先看下要执行的SQL语句：  
    ```sh
    ts-node ./node_modules/typeorm/cli.js schema:log
    ```
    确认无误后，可以创建schema了：
    ```sh
    ts-node ./node_modules/typeorm/cli.js schema:sync
    ```

5. 运行查看效果：`npm run start`

## TypeORM详解

参见<http://typeorm.io>

### Connection（数据库连接）

1. 只有创建了数据库的连接之后，才可以操作数据库。`nest`中已经再次封装，无需自己在创建连接。
2. 配置文件：`ormconfig.json`，存放在项目根目录。常用选项：
    * `type`:数据库类型，必须指定。目前支持"mysql"、"postgres"、"sqlite"等。
    * `name`:连接的名称，默认值"default"。多个连接时，每个连接的名称都要唯一。
    * `entities`:要使用此连接的entity代码路径，找到entity代码后，typeorm库会初始化。
    * `migrations`：数据库迁移的代码路径。
    * `logging`:设置为true后可以在控制台看到执行的sql语句。
    * `maxQueryExecutionTime`：查询最大执行时间，超时则记录查询。可以用于优化。
    * `dropSchema`:每次程序启动时都清空数据库（用于调试）。
    * `synchronize`：自动创建数据库以及表（便于调试，但不要用于生产环境）。

    不同`type`的数据库还有一些不同的选项，具体可参考typeorm的文档。

### Entity（实体）

Entity是一个映射到数据库表的类，通过`@Entity()`修饰。

* 一个Entity一般对应一个数据库的表，但如果包含其他Entity的关系，也可能会创建多个表。
* 每个Entity都需要在连接时注册后才能使用，因为typeorm要读取Entity的信息。通过在配置文件中提供Entity代码的路径即可完成注册（支持通配符路径）。
* Entity如果有构造函数，那么构造函数的参数必须是可选的，因为typeorm初始化时会创建一个Entity对象，此时无法传递参数。

#### 实体的列（Column）

* `@Column()`装饰器修饰的字段映射到数据库的表列上。
* 每个Entity必须至少有一个主列。
    * 主列：`@PrimaryColumn()`
    * 自增主列:`@PrimaryGeneratedColumn()`
    * 自生成uuid主列：`@PrimaryGeneratedColumn（"uuid")`
* `id`或`ids`列：一般Entity中都以此名称的列为识别字段，`save`以及`findOne`等函数都查找此字段的值。
* 特殊列：`@CreateDateColumn()`、`@UpdateDateColumn()`、`@VersionColumn()`
* 列类型：列可以指定更精确的类型。
    * 格式：`@Column("int")`或者`Column({type:"int"})`。
    * 常见的类型：int、text等等。不同的数据库不同。
    * 简单数组类型：`@Column("simple-array")`，数组中的值都会存储在单个字符串中，所有的值以逗号分隔。要求值中不包含逗号才可以。
    * 简单json类型： `@Column("simple-json")`，可以把一个对象以json形式存储在一个列中，并通过JSON.parse解析为原来的对象。
* 列选项：可以指定列的更详细配置。
    * 格式`@Column({})`。
    * `type`：指明列的类型，不同的数据库不同。
    * `name`：数据库表中的列名称。默认是根据字段名称自动生成的，也可以自己指定。
    * `length`：列类型的长度。
    * `width`：仅用于MYSQL证书类型的列显示宽度。
    * `nullable`：列是否可以为空，默认是`false`。
    * `readonly`：是否只读，默认`false`。如果为`true`，那么久只有第一次插入对象时能修改此值。
    * `default`：列的默认值。
    * `primary`：是否是主列。
    * `unique`：是否要求唯一值。

#### Entity的继承：

    把公共列放到一个类中，但是这个类不要用装饰符修饰。其他子类extends此类，并用@Entity修饰。

#### Entity的嵌入：

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
