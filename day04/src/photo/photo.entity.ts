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

    @Column('int')
    views: number;

    @Column()
    isPublished: boolean;

    static create(createDto: CreatePhotoDto) {
        const photo = new Photo();
        photo.name = createDto.name;
        photo.filename = createDto.filename;
        photo.description = createDto.description;
        photo.views = 0;
        photo.isPublished = false;
        return photo;
    }
}
