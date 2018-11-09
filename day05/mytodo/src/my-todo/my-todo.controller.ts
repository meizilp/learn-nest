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

    @Get(':id')
    findOne(@Param('id') id) {
        return this.mytodoService.findOneById(+id);
    }

    @Post()
    create(@Body() createMyTodoDto: CreateMyTodoDto) {
        return this.mytodoService.create(createMyTodoDto);
    }
}
