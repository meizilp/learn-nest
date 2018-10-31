import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class RepeatMode {
    @PrimaryColumn()
    id: number;
}