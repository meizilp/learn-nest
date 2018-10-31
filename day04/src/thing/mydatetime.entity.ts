import { Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class MyDateTime {
    @PrimaryColumn()
    id: number;
}