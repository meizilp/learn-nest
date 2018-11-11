import { Injectable } from '@nestjs/common';
import { MyTodoRepository } from './entity/my-todo.repository';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { MyTodo, MyTodoType } from './entity/MyTodo';
import { CreateMyTodoDto } from './dto/create-my-todo-dto';

@Injectable()
export class MyTodoService {
    async findAll() {
        return await this.myTodoRepo.find({ select: ['id', 'parentId', 'title', 'childIds'] });
    }
    async findOneById(id: number) {
        return await this.myTodoRepo.findOne(id);
    }
    async create(createMyTodoDto: CreateMyTodoDto) {
        const tobeSaveTodos: MyTodo[] = [];
        const mytodo = this.myTodoRepo.create({
            id: Date.now(),
        });
        mytodo.title = createMyTodoDto.title;
        mytodo.createTime = new Date();
        mytodo.myorder = Date.now();
        tobeSaveTodos.push(mytodo);
        if (createMyTodoDto.parent) {
            const parentTodo = await this.findOneById(createMyTodoDto.parent);
            if (parentTodo.id) {
                mytodo.parentId = parentTodo.id;
                if (parentTodo.childIds) parentTodo.childIds.push(mytodo.id.toString());
                else parentTodo.childIds = [mytodo.id.toString()];
                tobeSaveTodos.push(parentTodo);
            }
        }
        return await this.myTodoRepo.save(tobeSaveTodos);
    }

    private readonly myTodoRepo: MyTodoRepository;

    constructor(@InjectEntityManager() manager: EntityManager) {
        this.myTodoRepo = manager.getCustomRepository(MyTodoRepository);
    }
}
