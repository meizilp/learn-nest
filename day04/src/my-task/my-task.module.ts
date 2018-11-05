import { Module } from '@nestjs/common';
import { MyTaskController } from './my-task.controller';
import { MyTaskService } from './my-task.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MyTask } from './entity/myTask';

@Module({
  imports: [TypeOrmModule.forFeature([MyTask])],
  controllers: [MyTaskController],
  providers: [MyTaskService],
})
export class MyTaskModule { }
