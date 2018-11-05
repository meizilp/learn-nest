import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { MyTaskService } from './my-task.service';
import { CreateMyTaskDto } from './dto/create_mytask_dto';

@Controller('my-task')
export class MyTaskController {
    constructor(private readonly myTaskService: MyTaskService) { }

    @Get()
    findAll() {
        return this.myTaskService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id) {
        return this.myTaskService.findOneById(+id);
    }

    @Post()
    create(@Body() createDto: CreateMyTaskDto) {
        return this.myTaskService.create(createDto);
    }
}
