import { Module } from '@nestjs/common';
import { TaskaController } from './taska.controller';
import { TaskaService } from './taska.service';

@Module({
  controllers: [TaskaController],
  providers: [TaskaService]
})
export class TaskaModule {}
