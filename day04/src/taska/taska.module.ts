import { Module } from '@nestjs/common';
import { TaskaController } from './taska.controller';
import { TaskaService } from './taska.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskA } from './entity/TaskA';

@Module({
  imports: [TypeOrmModule.forFeature([TaskA])],
  controllers: [TaskaController],
  providers: [TaskaService],
})
export class TaskaModule { }
