import { Entity, PrimaryColumn, Column, ManyToMany } from 'typeorm';
import { Thing } from '../thing/thing.entity';

@Entity()
export class Tag {
    @PrimaryColumn()
    id: number;

    @Column({ length: 64 })
    name: string;

    @Column({ default: true })
    isRoot: boolean;

    @ManyToMany(type => Thing, thing => thing.tags)
    things: Thing[];
}