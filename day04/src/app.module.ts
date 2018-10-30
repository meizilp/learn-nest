import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhotoModule } from './photo/photo.module';
import { ThingModule } from './thing/thing.module';
import { PeopleModule } from './people/people.module';
import { TimeTrackModule } from './time-track/time-track.module';
import { OperationModule } from './operation/operation.module';
import { TagModule } from './tag/tag.module';

@Module({
  imports: [TypeOrmModule.forRoot(), PhotoModule, ThingModule, PeopleModule, TimeTrackModule, OperationModule, TagModule],
})
export class AppModule { }
