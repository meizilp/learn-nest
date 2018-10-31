import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class Operation {
    @PrimaryColumn()
    id: number;
    @Column()
    time: number;
    @Column()
    action: number;
    @Column()
    targetId: number;
}