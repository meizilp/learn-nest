import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhotoModule } from './photo/photo.module';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'sqlite',
    database: './main.db',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  }), PhotoModule],
})
export class AppModule { }
