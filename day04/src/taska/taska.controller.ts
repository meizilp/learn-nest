import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { TaskaService } from './taska.service';
import { CreateTaskADto } from './dto/create_taska_dto';

@Controller('taska')
export class TaskaController {
    constructor(private readonly taskAService: TaskaService) { }

    @Get()
    findAll() {
        return this.taskAService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id) {
        return this.taskAService.findOneById(+id);
    }

    @Get(':id/children')
    findChildren(@Param('id') id) {
        return this.taskAService.findChildrenById(+id);
    }

    @Post()
    create(@Body() createPhotoDto: CreateTaskADto) {
        return this.taskAService.create(createPhotoDto);
    }
}
