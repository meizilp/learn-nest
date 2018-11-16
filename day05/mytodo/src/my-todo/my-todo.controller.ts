import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { MyTodoService } from './my-todo.service';
import { CreateMyTodoDto } from './dto/create-my-todo-dto';

@Controller('my-todo')
export class MyTodoController {
    constructor(private readonly mytodoService: MyTodoService) { }

    @Get()
    findAll() {
        return this.mytodoService.findAll();
    }

    @Get('roots')
    findRoots() {
        return this.mytodoService.findRoots();
    }

    @Get(':id')
    findOne(@Param('id') id) {
        return this.mytodoService.findOneById(+id);
    }

    @Get(':id/children')
    findChildren(@Param('id') id) {
        return this.mytodoService.findChildren(+id);
    }

    @Get(':id/ancestors')
    findAncestors(@Param('id') id) {
        return this.mytodoService.findAncestors(+id);
    }

    @Get(':id/descendents')
    findDecendents(@Param('id') id) {
        return this.mytodoService.findDescendents(+id);
    }

    @Post()
    create(@Body() createMyTodoDto: CreateMyTodoDto) {
        return this.mytodoService.create(createMyTodoDto);
    }
}
