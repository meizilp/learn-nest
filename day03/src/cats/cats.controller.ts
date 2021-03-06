import { Controller, Get, Param, Post, Body, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { CatsService } from './cats.service';

@Controller('cats')
export class CatsController {

    constructor(private readonly catsService: CatsService) { }

    @Get()
    findAll() {
        return this.catsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id) {
        return this.catsService.findOne(+id);
    }

    @Post()
    create(@Body() newCatDto: CreateCatDto) {
        return this.catsService.create(newCatDto);
    }

    @Delete()
    delete() {
        throw new HttpException('禁止删除', HttpStatus.FORBIDDEN);
    }
}
