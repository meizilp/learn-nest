import { Entity, PrimaryColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Tag } from '../tag/tag.entity';

@Entity()
export class Thing {
    @PrimaryColumn()
    id: number;

    @Column()
    title: string;

    @ManyToMany(type => Tag, tag => tag.things)
    @JoinTable()
    tags: Tag[];
}