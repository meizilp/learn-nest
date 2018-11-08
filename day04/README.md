# Nest 入门第4天

数据库操作。  
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
    1. 新建photo的Module、Controller、Service、Entity：
        ```sh
        nest g mo photo # 创建photo.module.ts
        nest g co photo # 创建photo.controller.ts
        nest g s photo photo # 创建photo.service.ts
        typeorm entity:create -n Photo -d src/photo/entity # 创建Photo.ts
        ```
    2. 修改`photo.module.ts`:
        ```ts
        //动态引入TypeOrmModule，这样Photo Module中才能使用此模块中的内容。
        imports: [TypeOrmModule.forFeature([Photo])],  
        ```
        * `forFeature()`的实现在`typeorm.providers.js`的`createTypeOrmProviders`函数中，会把要加载的Repo名字保存到数组中。
    3. 修改`entity/Photo.ts`:
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
    4. 创建`dto/create_photo.dto.ts`
    5. 修改`photo.controller.ts`：配置路由；调用photo service中的接口实现路由的处理。  
    6. 修改`photo.service.ts`：
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
        * InjectRepository在`node_modules\@nestjs\typeorm\dist\common\typeorm.decorators.d.ts`声明，在对应的js文件中可以看到实现，逐步跟踪到`node_modules\@nestjs\typeorm\dist\common\typeorm.utils.js`有真正的实现，从这儿可以看到实际上就是拼凑出了Repository的名字。（connection和manager的注入也是类似，默认名字是"default"。）

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
    * `name`:连接的名称，默认值"default"。多个连接时，每个连接的名称都要唯一以作为token。
    * `entities`:要使用此连接的entity代码路径，找到entity代码后，typeorm库会初始化。
    * `migrations`：数据库迁移的代码路径。
    * `logging`:设置为true后可以在控制台看到执行的sql语句。
    * `maxQueryExecutionTime`：查询最大执行时间，超时则记录查询。可以用于优化。
    * `dropSchema`:每次程序启动时都清空数据库（用于调试）。
    * `synchronize`：自动创建数据库以及表（便于调试，但不要用于生产环境）。

    不同`type`的数据库还有一些不同的选项，具体可参考typeorm的文档。
3. Connection API:经常会用到的。
    * createConnection:创建连接。
    * getConnection:获取指定的连接。
    * getEntityManager：得到本connection的EntityManager。
    * getRepository：得到指定类型Entity的Repository。
    * name:连接的名称，默认是‘default’
    * synchronize:同步数据库schema。
    * dropDatabase：删除数据库。
    * runMigrations：执行迁移代码。
    * getCustomRepository：获取自定义的Repo。
    * transaction:执行事务。
    * query:执行RAW SQL。
    * createQueryBuilder：创建查询对象。
    * createQueryRunner:创建查询执行对象，连接数据库后执行查询，然后要释放。

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

1. 把公共列放到一个普通类中，列仍然用`@Column()`标记。
2. 其他子类extends此类，并用`@Entity()`标记类。
3. 在数据库中生成子类的表时，会自动为每个子类加入公共列。

#### Entity的嵌入：

通过嵌入可以解决所有的字段都被迫展开在一层的问题，使得及结构更清晰。  

1. 被嵌入的类不要用修饰符标记，列仍然用`@Column()`标记，列的详细选项也在此类提供。
2. 宿主类通过@Column(type => 被嵌入的类名称)标记字段。
3. 在数据库中生成宿主类的表时，会自动展开被嵌入的类，生成多列，列名也会自动生成。
4. 在向数据库保存对象时，typeorm会自动把对象的字段保存到对应的列。
5. 在数据库中加载对象时，typeorm会自动把对应的列加载到嵌入对象的字段中。
6. 在通过嵌入对象的值进行查找操作时，`where`条件仍然按照对象的嵌套层次展开。

示例：

1. 被嵌入的类：`Address`
    ```ts
    import { Column } from 'typeorm';
    export class Address {  // 类本身不标记
        @Column({ nullable: true })     // 仍然此处定义列。
        city: string;

        @Column({ nullable: true })
        street: string;
    }
    ```
2. 宿主类：`Photo`
    ```ts
    @Column(type => Address)    // 此列和Address类型关联
    location: Address;
    ```
3. 实际的建表SQL：嵌入类被展开为两列`locationCity`和`locationStreet`
    ```sql
    CREATE TABLE "photo" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar(256), "description" text, "filename" varchar NOT NULL, "views" integer NOT NULL DEFAULT (0), "isPublished" boolean NOT NULL DEFAULT (0), "locationCity" varchar, "locationStreet" varchar)
    ```
4. 保存和读取都是和操作普通对象一样。
5. 通过嵌入类的字段查找符合条件的记录：通过对象嵌套的方式来作为查找条件。
    ```ts
    async findByCity(targetCity: string) {
        return await this.photoRepository.find({ where:{ location:{city:targetCity} } });
    }
    ```

#### 树结构实体：

树作为经常使用的一种数据接口，常见的通过关系型数据库保存的方案有4种：

1. Adjacency List: 每个节点保存parent的id。最简单，但对于获取子树不利，适用于树深度不大的情况。
2. Path Enumeration:把一条树路径上的所有节点id拼接起来写入一个字段。对写入不利。
3. Nested Sets:只能有一个根节点，利于读但对写入不利。
4. Closure Table:单独建立一个表保存节点之间的关系，空间相对需要比较大，性能对于读写都较好。  

参考资料：

* <https://www.slideshare.net/billkarwin/models-for-hierarchical-data> 69页做了对比。
* <https://schinckel.net/2014/09/13/long-live-adjacency-lists/> 对邻接表做了描述。

对于邻接表实现的树结构保存，直接通过关系操作（见后）；  
其它三种实现，TypeOrm对操作tree做了一下封装，以便于使用。  
示例：（Closure Table）（示例类：TaskA）

1. 新建TaskA的Module、Controller、Service、Entity、Dto类
2. 修改TaskA的Module，引入TypeOrmModule
3. 修改TaskA的Entity定义
    ```ts
    import { Tree, Entity, PrimaryGeneratedColumn, Column, TreeParent, TreeChildren } from 'typeorm';

    @Entity()   // 仍然标记为Entity
    @Tree('closure-table')  // 声明tree的保存方法
    export class TaskA {
        @PrimaryGeneratedColumn()
        id: number;

        @Column()
        title: string;

        @TreeParent()       // 使用Tree专门定义的装饰器，如果用Column会丢失信息，运行会出错。
        parent: TaskA;

        @TreeChildren({ cascade: true })    // 使用Tree专门定义的装饰器
        children: TaskA[];
    }
    ```
4. 修改TaskA的Controller：设定路由以及调用Service中的函数实现。
5. 修改TaskA的Service
    ```ts
    @Injectable()
    export class TaskaService {
        // 直接注入TreeRepository
        constructor(
            @InjectRepository(TaskA)
            private readonly taskRepository: TreeRepository<TaskA>,
        ) { }
    }

    async findAll() {
        // 利用treeRepository特有的函数获取树节点
        return await this.taskRepository.findTrees();
    }

    async create(createDto: CreateTaskADto) {
        // 必须用save，不能用insert，否则关系不会保存
        return await this.taskRepository.save(  
            this.taskRepository.create({
                title: createDto.title,
                parent: createDto.parent,
            }));
    }
    ```

* 运行后，typeOrm会创建TaskA的表以及TaskA节点关系的表。
* 要使用TreeRepository，那么Entity必须使用`@Tree()`标记，并且列也要用`@TreeParent()`和`@TreeChildren()`标记才可以，否则运行时会因为无法的Tree信息出错。
* 邻接表的存储typeOrm不能使用treeRepository中的函数操作，就使用普通关系一样操作即可。(虽然邻接表字符串目前在@Tree()的可用enum中，但是用了之后用tree函数操作会出错。)
* 当parent为undefined时，会插入根节点。不过一开始create函数写错了，写成了`parent:{id:createDto.parent}`,这样导致parent永远不是undefined，插入根节点时出错。
* 通过Postman调试，直接Post Raw Json数据，也能被正确解析。
* 经过实际验证，感觉封装后的函数便利性一般。还是根据自己需要实现一套tree，可以几种tree的存储方式结合在一起（比如所有的父节点拼凑后保存在一个字段中，比如所有的children拼凑后保存在一个字段中）

### 关系

Entity之间可以有一对一、一对多、多对一、多对多的关系，并且可以是单向或者双向的。typeOrm会在数据库中创建外键来约束关系。

关系创建时可以指定选项：

* eager：对象加载时是否把关联的字段也自动加载填充了。
* cascade：对象存储时是否把关联的资源也自动存储了。
* onDelete：当指向的对象被删除时，外键如何处理。
* primary：关系列是否设置为一个主列。
* nullable：关系列是否可以为空。

1. 一对一：@OneToOne
    * 单向：

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

    * 双向：两个Entity中都要用@OneToOne，并且参数要建立两个关系。

        Entity 'Profile':
        ```ts
        // 本字段指向User对象；user对象中的profile字段指向本对象。
        @OneToOne(type => User, user => user.profile) 
        user: User;
        ```
        Entity 'User':
        ```ts
        //本字段指向Profile对象，profile对象中的user字段指向本对象。
        @OneToOne(type => Profile, profile => profile.user) 
        @JoinColumn()
        profile: Profile;
        ```

2. 多对一和一对多：@ManyToOne @OneToMany

    Photo Entity:
    ```ts
    //本字段指向User对象，user中的photos字段指向本对象。
    @ManyToOne(type => User, user => user.photos) 
    user: User;
    ```
    User Entity:
    ```ts
    //本字段指向Photo对象，photo中的user字段指向本对象
    @OneToMany(type => Photo, photo => photo.user)
    photos: Photo[];
    ```
    @OneToMany必须和@ManyToOne搭配使用。包含有@ManyToOne的Entity拥有此关系（命名关系名称以及创建外键，不必再用@JoinColumn声明哪个是主。）

3. 多对多：@ManyToMany

    * 单向：只要在其中的一个Entity中放入指令即可，TypeOrm会创建一个关联表记录两个Entity之间的关系。
        ```ts
        @ManyToMany(type => Category)
        @JoinTable()
        categories: Category[];
        ```

    * 双向：两个Entity中都要放入指令，但只能在其中一个Entity中使用@JoinTable()

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

#### Eager和lazy关系：

* Eager设置为true时，这样的关系每次都自动把关联的Entity从数据库中加载。无需额外操作。
* Lazy关系是通过Promise实现，当要访问字段时再真正加载。只支持Nodejs或者JS上才能实现。

#### 关系相关FAQ：

* 如何创建自引用关系（比如用于tree结构）：和其他关系一样，没特殊处理。
* 如何不加载关联的Entity，而知道关联Entity的id：在Entity中增加一个列，这个列的名称是'关系名'+'Id'，这样就会把外键填入这个字段了。
* 如何手动通过关系加载Entity：find时传递参数，通过relations字段指明要使用的关系。
* 避免关系属性初始化：因为一旦初始化了关系属性，那么保存这个Entity时，这个关系属性如果没有真正从数据库中加载过，那么就会把初始值保存到数据库，而导致真正的关系被删除。
* PS：感觉手动通过ID来关联，自己操作也还好。

### Entity Manager和Repository

1. EntityManager用来操作Entity的增删改查等，调用函数时要传入具体要操作的Entity类型。  
2. Repository类似于EntityManager，只是操作限制在指定的Entity类型中。  
3. Find*系列函数是使用EntityManager和Repository时经常调用的函数，调用时可以传递不同的选项来控制： 
    * select:string['filed1', 'field2] 要返回的字段。
    * relations:string[] 要加载的关系。
    * join:比relations更灵活。
    * where：where子句，类似：`{where:{firstName:'Tim'}}`。
    * order:排序。可以多个字段分别指明排序方式，类似`{order:{name:"ASC", id:"DESC"}}`。
    * skip：跳过多少记录。
    * take：取多少记录。
    * cache：是否启用缓存。启用后在设置时间内的查询直接读取cache以加快速度。
    * Not函数：不等于。`{title:Not("abc")}`
    * LessThan、MoreThan、Equal：小于、大于、等于。`{views:LessThan(10)}`
    * Like：模糊匹配。`{title:Like("%out #%")}`
    * BETWEEN：在值之间。`{views:Between(1,10)}`
    * IN：在值的集合中。`{title:in(["About 2", "About 3"])}`
    * ANY：支持子查询。`{title:Any(["About 2", "About 3"])}`
    * IsNull：为空。`{title:IsNull()}`
    * Raw：执行原始SQL语句。`{views:Raw("1+views=4")}`
4. 自定义Repository：  
    如果对于Entity有些自己封装的操作，就可以把这些操作封装到一个自定义Repository中，便于使用。
    1. 定义`EntityRepository`：类名可以随便起。
    ```ts
    @EntityRepository(MyTask)
    export class MyTaskRepository extends Repository<MyTask> {
        sayHello() {
            return 'hello custom repository';
        }
    }
    ```
    2. 在service中通过`EntityManager`获得自定义的repo。此repo无需在module中imports。
    ```ts
    private readonly repo: MyTaskRepository;

    constructor(
        @InjectEntityManager()
        manager: EntityManager,
    ) {
        this.repo = manager.getCustomRepository(MyTaskRepository);
    }
    ```

5. EntityManager API：
    * connection:本manager使用的connection。
    * queryRunner：用来执行查询的runner，只有在transaction中才有值，普通的时候是undefined。
    * transaction：执行事务。
    * query：执行RAQ SQL。
    * createQueryBuilder：创建查询。
    * create：创建一个新指定的类型对象，可以传入一个字面量对象作为初始化的值。
    * preload: 创建一个新指定的类型对象。创建时提供一个初始对象（要包含主列），以主列从数据库中加载对象，然后用初始对象中的字段覆盖加载对象得到一个合并后的对象。
    * save：保存一组对象。并且保存对象关联的关系。这组对象保存时会在**一个事务中**完成。另外对象中没有定义的属性保存时会不更新数据库。
    * remove：移除一组对象。也会移除对象关联的关系。这组对象移除时会在**一个事务中**完成。
    * insert：插入一组对象。不会保存对象关联的关系。
    * update：更新指定的一个对象。
    * delete：删除指定的一个或者一组对象。不会改变对象之间的关系。
    * count: 计算符合条件的对象数量。
    * find：按照给定的选项查找Entity。
    * findAndCount：按照给定选项超找Entity，并且忽略分页选项计算所有符合条件的数目。（便于分页）
    * findByIds：根据给定的一组id返回Entity。
    * findOne：查找第一个符合条件的Entity。
    * findOneOrFail：查找第一个符合条件的Entity，如果没找到就reject promise。
    * clear：清空指定的表。
    * getRepository：得到指定Entity的Repo。
    * getCustomRepositroy：得到指定Entity的自定义Repo。

6. Repository API:（和Manager中最大的区别在于Repo具体到了某一类型的Entity上）
    * manager:得到本Repo使用的EntityManager。
    * queryRunner：仅在事务中，得到使用的queryRunner。一般情况下都是undefined。
    * createQueryBuilder：创建query builder以构建查询。
    * create：使用给定的对象创建一个对象。
    * preload:合并初始对象和数据库中的对象得到一个新对象。
    * save:保存给定的对象。在事务中完成一组对象保存。
    * remove：删除给定的对象。在事务中完成。
    * insert、delete、update、count、find、findAndCount、findByIds、findOne、findOneOrFail、query、clear都类似于Manager。

### Query Builder：

更灵活强大的查询。
可以在<https://www.w3schools.com/sql/trysql.asp?filename=trysql_desc>验证一些sql语句。

* where、andWhere、orWhere：where子句。支持传递参数。where子句如果出现多次，那么后面的会覆盖前面的（andWhere、orWhere没这个限制）。
* getOne、getMany：得到Entity。
* getRawOne、getRawMany：得到RAW结果。
* 嵌套where：向where子句传递Brackets对象。
* orderBy:按照指定字段排序，可以对多个字段分别指定排序方式。
* groupBy:按照指定字段分组。
* having：增加having条件。
* limit:限制取回的数据数量。
* offset：从指定的序号开始取。但是分页的话建议用skip。
* getSql: 得到要执行的sql语句。如果调试，可以用`printSql`输出到终端。
* getRawOne、getRawMany：得到RAW结果。
* 分页：take、skip。
* select：只读取指定的字段。
* 子查询：subQuery().getQuery()。
* Joining：leftJoinAndSelect，可以用来加载一对多；innerJoinAndSelect；
* cache：支持对指定的查询缓存指定的一段时间，以提高性能。缓存的结果会被typeorm保存在一个单独的表中。

PS:一些SQL的知识
1. group by：查找符合条件的记录，按照给定的一个或者多个字段分组，然后再在每组记录上操作，比如求数量，求和。如果不做聚合函数操作，那么返回的是每组最后一个符合条件的记录形成的记录集。
2. having:要和group by连起来用。能够和聚合函数一起用。
3. join:
    * inner join（交集）：表1有此id，表2也有此id，这一行才会被选出来。比如购物记录，如果一个用户没有购物记录，那么结果中就没这个用户。
    * left join（左表）：以表1为准，每行都要有，如果表2中没有，那么此行表2中的字段为null，如果表2中有多个，那么结果中有多行。比如购物记录，如果某个id的购物记录为null，那么就是没有购物。
    * right join（右表）:以表2为准，表1中如果没有则填null。
    * full join（并集）：二者的行都要出现，任何一边没有时就填null。

### 数据库迁移：

可以使用自动生成sql的命令，会对比当前db的schema和entity的区别，自动生成sql，但是只是schema变化，数值的变化仍然需要手动sql。  
在config文件中要给cli指明存储路径，要给run指明迁移的文件有哪些，当run之后，会把迁移信息保存到db中。  
迁移的文件是以时间戳+名字来命名的，以便于脚本按照顺序执行。  
提供了一系列的函数可以在脚本中调用。

```sh
typeorm migration:create -n PostRefactoring # 创建一个空的迁移文件
typeorm migration:run # 执行迁移脚本
typeorm migration:generate -n PostRefactoring # 对比db和entity定义生成迁移文件
```

### 事务：

```ts
await getManager().transaction(transactionalEntityManager => {
    await transactionalEntityManager.save(users);
    await transactionalEntityManager.save(photos);
});
```
* 要使用回调提供的manager。
* 也可以使用queryRunner实现事务，以便更精细的控制。

### 索引：

* 直接使用`@Index()`标记列。
* unique索引：`@Index({ unique: true })`
* 多列索引：直接在`class`上标记。
    ```ts
    @Entity()
    @Index(["firstName", "lastName"])
    @Index(["firstName", "middleName", "lastName"], { unique: true })
    ```

### Entity操作监听：

```ts
@Entity()
export class Post {

    @AfterLoad()
    updateCounters() {
        if (this.likesCount === undefined)
            this.likesCount = 0;
    }
}
```

* 当Entity被加载、插入等时回调指定的函数。
* 支持`@AfterLoad,@BeforeInsert,@AfterInsert,@BeforeUpdate,@AfterUpdate,@BeforeRemove,@AfterRemove`这些标记。

### 日志：

在config中可以配置是否打开日志。设置为true时，则会在终端输入所有的sql操作。还可以设置只感兴趣的操作。也可以配置日志记录在文件中还是输出到终端。

### 命令行：

```sh
typeorm entity:create -n User # 创建Entity文件
typeorm migration:create -n UserMigration # 创建迁移脚本
typeorm migration:generate -n UserMigration # 自动生成迁移脚本
typeorm migration:run # 运行迁移脚本
typeorm migration:revert # 回退最近的迁移脚本
typeorm schema:sync # 同步数据库的schema
typeorm schema:log # 输出要同步数据库schema会执行的sql，不会真正执行
typeorm schema:drop # 删除表
typeorm query "SELECT * FROM USERS" # 执行SQL
typeorm cache:clear # 清理cache
```
