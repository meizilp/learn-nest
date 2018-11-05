import { Module } from '@nestjs/common';
import { MyTaskController } from './my-task.controller';
import { MyTaskService } from './my-task.service';

@Module({
  controllers: [MyTaskController],
  providers: [MyTaskService],
})
export class MyTaskModule { }
