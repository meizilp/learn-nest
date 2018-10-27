import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { CreatePhotoDto } from './dto/create_photo.dto';

@Entity()
export class Photo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 500 })
    name: string;

    @Column('text')
    description: string;

    @Column()
    filename: string;

    @Column('int', { default: 0 })
    views: number;

    @Column({ default: false })
    isPublished: boolean;

    static create(createDto: CreatePhotoDto) {
        const photo = new Photo();
        photo.name = createDto.name;
        photo.filename = createDto.filename;
        photo.description = createDto.description;
        return photo;
    }
}
