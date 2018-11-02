import { Tree, Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, TreeParent, TreeChildren } from 'typeorm';

@Entity()
@Tree('closure-table')
export class TaskA {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    // @ManyToOne(type => TaskA, task => task.children)
    @TreeParent()
    parent: TaskA;

    // @OneToMany(type => TaskA, task => task.parent)
    @TreeChildren({ cascade: true })
    children: TaskA[];
}
