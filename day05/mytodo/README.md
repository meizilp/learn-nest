# MyTodo 后台

一个成型的MyTodo后台。

## 创建工程

```sh
nest n mytodo
创建 .gitignore
npm i typeorm sqlite3 @nestjs/typeorm
npm i ts-node --save-dev
项目根目录创建 ormconfig.json
```

## 创建MyTodo模块及Entity

```sh
nest g mo MyTodo
nest g co MyTodo
nest g s MyTodo my-todo
typeorm entity:create -n MyTodo -d .\src\my-todo\entity
在src/my-todo/dto/创建create-my-todo-dto.ts
在src/my-todo/entity/创建my-todo.repository.ts
```

## MyTodo Entity

## Sqlite的一些知识

### Date类型数据在Sqlite中的保存：

* 以0时区的值保存的。
* 可以通过`date()`或者`time()`只取日期或者时间。
* 可以通过`datetime('localtime')`来转换为本时区的值。
* 可以通过`datetime('now')`获取当前值
* 可以通过`datetime('now', '+5 years')`类似操作修改年份、月份、天数('+3 days')、小时('+3 hours')、分钟（'+30 miniutes'）。
* 通过`datetime`系列函数得到的值可以和指定的值比较作为where的条件等。
* 参见 <https://www.sqlite.org/lang_datefunc.html> 字符串格式列表和修改符列表

### 通过with语句实现递归查询：(就是通过队列展开递归，广度遍历)

1. 运行初始化select，结果加入队列中(可能有多行)
2. 队列不为空时：
    2a: 从队列中提取单行
    2b: 将单行插入到递归表
    2c：递归表（cte）中当做就刚插入的这一行(实际上可能已经插入了很多行了)，执行递归select（一般是操作非cte），结果加入队列中
    2d：重复2开始
3. 最终得到的递归表(cte)中是所有进入过队列的行。

递归查询后代节点：

WITH RECURSIVE
    my_cte(id,parentId) as (
        select id from my_todo where id = 给定的id   // 从my_todo找到指定的对象加入队列。
        union all
        select my_todo.id, my_todo.parentId     // 指定要从my_todo中符合条件记录中所取的字段
            from my_cte, my_todo    // 取my_cte中的一行以及my_todo中的所有行
            where my_todo.parentId = my_cte.id    // 把my_todo中所有父节点是my_cte当前节点的记录都加入队列（广度展开树）
    )
select id, parentId from my_cte   // 把符合条件的记录提取出来

递归查询祖先节点：

WITH RECURSIVE
    my_cte(id,parentId) as (
        select id, parentId from my_todo where id = 给定的id  // 找到给定的id，
        union all
        select my_todo.id, my_todo.parentId     // 指定要从my_todo中符合条件记录中所取的字段
            from my_cte,my_todo                 // 取my_cte中的一行以及my_todo中的所有行
            where my_cte.parentId is not null   // 如果当前节点存在父节点
            and my_todo.id = my_cte.parentid    // 找到父节点并加入队列。不能加limit，因为可能有多级父节点。
    )
select id,parentId from my_cte

### 索引是如何工作的

创建索引后，首先通过索引查到行，再通过行取到内容。查找索引时是通过二分查找，这样就避免了全表扫描。

### 查询优化

`CREATE INDEX idx_ex1 ON ex1（a，b，c，d，e，...，y，z）;    // 创建了a到z的索引`

* WHERE子句：各条件间要用AND连接，否则走OR优化。
* WHERE子句：条件之间的关系必须是(=、IS、>、>=、<、<=、IS、IN、IS NULL)这些运算符。
* 生效规则：
    1. `WHERE a=5 AND b IN (1,2,3) AND c IS NULL AND d='hello'` abcd索引都生效，因为是`AND`连接并且都是`等于`关系。
    2. `WHERE a=5 AND b IN (1,2,3) AND c>12 AND d='hello'` abc索引生效，d失效是因为前面c是`不等于`关系。
    3. `WHERE a=5 AND b IN (1,2,3) AND d='hello'` ab索引生效，d和前面空了c所以不生效。
    4. `WHERE b IN (1,2,3) AND c NOT NULL AND d='hello'` 索引失效，因为没有a开头。
    5. `WHERE a=5 OR b IN (1,2,3) OR c NOT NULL OR d='hello'` 索引失效，因为OR子句。
* BETWEEN：一大堆没看懂。改成 `>= AND <=`？。
* OR:
    1. 第一种方法：把多个OR改成IN。`column = expr1 OR column = expr2 OR column = expr3 OR ...`改成`column IN (expr1,expr2,expr3,...)`。
    2. 第二种方法：`expr1 OR expr2 OR expr3`还是改写成IN，但是可能不是简单的表达式，而是多个select通过union连接。
* LIKE优化：好大一篇，没看懂。
* 部分索引字段优化：就是索引的前几个字段没有出现在条件中的，或者索引的前几个字段区分度不大，比如就是布尔型的，这块是数据库引擎自动做的。
* 还有一大堆，先不看了。
* 可以通过`explain query plan`来查看要执行的sql的查询计划，可以看到会扫描的表、会使用的索引。

## Tree的结构设计

parent:

    1. 便于找到直接的parent。
    2. 通过递归还可以把所有的祖先都查找出来。
        1. 初始化parent进入队列
        2. 把parent的parent再放入队列，直至parent为空为止。
        3. 所有进入过队列的parent都被存储到了递归表中，那么递归表中就是逆序的ancestors。
    3. 通过递归也可以把所有的后台都查找出来。
        1. 初始化把所有parent是自己的找出来，就是自己的children
        2. 把每个child的child找出来：也就是parent是child的找出来，进入队列。
        3. 所有进入过队列的child都被存储到了地递归表中，那么递归表中就是深度优先的descendents。
    4. 未能解决的问题：
        1. child的排序问题：（考虑列表中的排序有定义的排序方式，所以自然排序不是那么着急）
            赋予child一个序号：
                首位置插入：所有的children都要更新序号。如何得到一个合适的序号？
                首位置删除：无影响。
                中间位置插入：所有被插入及之后的children都要更新序号。
                中间位置删除：无影响。
                末位置插入：无影响。但是新元素的序号要保证是最大的。取最后一个child然后要>他。通过max，可以，能够使用上parent的索引。
                末位置删除：无影响。
            通过链式连接（双链）：这样递归加载了某个节点的所有子节点，并且是按照顺序加载的。
                    递归加载。
                    初始化：加载本节点的第一个子节点，parent = 本id and previous = null
                    union all
                    递归：加载本节点的下一个节点， id = next，无需判断parent了。
                首位置插入：本节点的next修改，第一个节点的pre修改。
                首位置删除：第二个节点的pre修改。
                中间位置插入：上一个节点的next修改，本节点的next、pre修改，下一个节点的pre修改。
                中间位置删除：上一个节点的next修改，下一个节点的pre修改。
                末位置插入：上一个节点的next修改，本节点的pre修改
                末位置删除：上一个节点的next修改
            通过链式连接（单链 parent + pre）：这样递归加载了某个节点的所有子节点，并且是按照顺序加载的。
                    递归加载。
                    初始化：加载本节点的第一个子节点，parent = 本id and previous = null
                    union all
                    递归：加载本节点的下一个节点， preid = id
                首位置插入：第一个节点的pre修改。
                首位置删除：第二个节点的pre修改。
                中间位置插入：本节点的pre修改，下一个节点的pre修改。
                中间位置删除：下一个节点的pre修改。
                末位置插入：本节点的pre修改（很常见，如何找到末位置？）
                末位置删除：无影响

        2. 按照树形结构取子树的问题(按照深度加载)：取回所有后代后，通过代码再组织？都是在内存操作，数量不多，速度应该很快。

取根节点：parentid is null就是。

取x直接Children：parentid=x.id 的就是。

取x的ancestor：按照上面描述的算法取。

```sql
with recursive
    myan(id,parentid,title) as (
        select id,parentid,title from my_todo where x.parentId is not null and id=x.parentid    // x.parent 进入队列
        union all
        select my_todo.id,my_todo.parentid,my_todo.title from my_todo,myan where my_todo.id = myan.parentId and my_todo.parentId is not null limit 1)
select id,parentid,title from myan
```
会用到id的索引

取descendents：按照上面秒速的算法取。
with recursive 	
    myan(id,parentid,title) as (
        select id,parentid,title from my_todo where parentid=x.id
        union all
        select my_todo.id,my_todo.parentid,my_todo.title from my_todo,myan where my_todo.parentid = myan.id)
select id,parentid,title from myan
会用到parentid的索引