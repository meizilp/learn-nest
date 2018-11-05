import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class MyTask {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 512 })
    title: string;
}
