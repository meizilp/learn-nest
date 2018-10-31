import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class Note {
    @PrimaryColumn()
    id: number;

    @Column({ length: 65536 })
    content: string;
}