import { Module } from '@nestjs/common';
import { ThingController } from './thing.controller';
import { ThingService } from './thing.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Thing } from './thing.entity';
import { MyDateTime } from './mydatetime.entity';
import { Note } from './note.entity';
import { RepeatMode } from './repeat-mode.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Thing, MyDateTime, Note, RepeatMode])],
  controllers: [ThingController],
  providers: [ThingService],
})
export class ThingModule { }
