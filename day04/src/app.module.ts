import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhotoModule } from './photo/photo.module';
import { TaskaModule } from './taska/taska.module';
import { MyTaskModule } from './my-task/my-task.module';

@Module({
  imports: [TypeOrmModule.forRoot(), PhotoModule, TaskaModule, MyTaskModule],
})
export class AppModule { }
