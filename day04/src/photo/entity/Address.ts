import { Column } from 'typeorm';

export class Address {
    @Column({ nullable: true })
    city: string;

    @Column({ nullable: true })
    street: string;
}