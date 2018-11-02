import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { CreatePhotoDto } from '../dto/create_photo.dto';
import { Address } from './Address';

@Entity()
export class Photo {
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column({ length: 256, nullable: true })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column()
    filename: string;

    @Column('int', { default: 0 })
    views: number;

    @Column({ default: false })
    isPublished: boolean;

    @Column(type => Address)
    location: Address;

    static create(createDto: CreatePhotoDto) {
        const photo = new Photo();
        photo.name = createDto.name;
        photo.filename = createDto.filename;
        photo.description = createDto.description;
        photo.location = { city: createDto.city, street: createDto.street };
        return photo;
    }
}
