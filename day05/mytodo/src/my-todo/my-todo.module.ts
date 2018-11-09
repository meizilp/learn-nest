import { Module } from '@nestjs/common';
import { MyTodoController } from './my-todo.controller';
import { MyTodoService } from './my-todo.service';

@Module({
  controllers: [MyTodoController],
  providers: [MyTodoService],
})
export class MyTodoModule {}
