import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MyTodoModule } from './my-todo/my-todo.module';

@Module({
  imports: [TypeOrmModule.forRoot(), MyTodoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
