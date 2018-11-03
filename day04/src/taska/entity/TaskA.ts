import { Tree, Entity, PrimaryGeneratedColumn, Column, TreeParent, TreeChildren } from 'typeorm';

@Entity()
@Tree('closure-table')
export class TaskA {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @TreeParent()
    parent: TaskA;

    @TreeChildren({ cascade: true })
    children: TaskA[];
}
