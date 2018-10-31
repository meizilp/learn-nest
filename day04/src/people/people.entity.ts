import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class People {
    @PrimaryColumn()
    id: number;

    @Column({ length: 64 })
    name: string;

    @Column({ length: 64 })
    phone: string;

    @Column()
    email: string;
}