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

Date类型数据在Sqlite中的保存：
* 以0时区的值保存的。
* 可以通过`date()`或者`time()`只取日期或者时间。
* 可以通过`datetime('localtime')`来转换为本时区的值。
* 可以通过`datetime('now')`获取当前值
* 可以通过`datetime('now', '+5 years')`类似操作修改年份、月份、天数('+3 days')、小时('+3 hours')、分钟（'+30 miniutes'）。
* 通过`datetime`系列函数得到的值可以和指定的值比较作为where的条件等。
* 参见 <https://www.sqlite.org/lang_datefunc.html> 字符串格式列表和修改符列表