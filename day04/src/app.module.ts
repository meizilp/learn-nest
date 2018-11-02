import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhotoModule } from './photo/photo.module';
import { TaskaModule } from './taska/taska.module';

@Module({
  imports: [TypeOrmModule.forRoot(), PhotoModule, TaskaModule],
})
export class AppModule { }
