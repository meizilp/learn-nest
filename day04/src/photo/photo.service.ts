import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Photo } from './photo.entity';
import { Repository } from 'typeorm';
import { CreatePhotoDto } from './dto/create_photo.dto';

@Injectable()
export class PhotoService {
    constructor(
        @InjectRepository(Photo)
        private readonly photoRepository: Repository<Photo>,
    ) { }

    async findAll() {
        return await this.photoRepository.find();
    }

    async findOneByID(id: number) {
        return await this.photoRepository.findOne(id);
    }

    async create(createPhotoDto: CreatePhotoDto) {
        return await this.photoRepository.insert(Photo.create(createPhotoDto));
    }

    async remove(id: number) {
        return await this.photoRepository.delete(id);
    }

    async update(photo: Photo) {
        return await this.photoRepository.save(photo);
    }
}
