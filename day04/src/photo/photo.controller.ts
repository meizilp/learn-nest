import { Controller, Get, Param, Post, Body, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { PhotoService } from './photo.service';
import { CreatePhotoDto } from './dto/create_photo.dto';

@Controller('photo')
export class PhotoController {
    constructor(private readonly photoService: PhotoService) { }

    @Get()
    findAll() {
        return this.photoService.findAll();
    }

    @Get('city/:city')
    findByCity(@Param('city') city) {
        return this.photoService.findByCity(city);
    }

    @Get(':id')
    findOne(@Param('id') id) {
        return this.photoService.findOneByID(id);
    }

    @Post()
    create(@Body() createPhotoDto: CreatePhotoDto) {
        return this.photoService.create(createPhotoDto);
    }

    @Delete()
    delete() {
        throw new HttpException('禁止删除', HttpStatus.FORBIDDEN);
    }

    @Delete(':id')
    deleteOne(@Param('id') id) {
        return this.photoService.remove(id);
    }
}
