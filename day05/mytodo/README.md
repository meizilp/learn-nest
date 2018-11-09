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
