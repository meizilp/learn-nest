import { Injectable } from '@nestjs/common';
import { MyTodoRepository } from './entity/my-todo.repository';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { MyTodo } from './entity/MyTodo';
import { CreateMyTodoDto } from './dto/create-my-todo-dto';

@Injectable()
export class MyTodoService {
    async findAll() {
        return await this.myTodoRepo.find();
    }
    async findOneById(id: number) {
        return await this.myTodoRepo.findOne(id);
    }
    async create(createMyTodoDto: CreateMyTodoDto) {
        const mytodo = this.myTodoRepo.create({
            id: Date.now(),
            title: createMyTodoDto.title,
            createDateTime: new Date(),
        });
        return await this.myTodoRepo.save(mytodo);
    }

    private readonly myTodoRepo: MyTodoRepository;

    constructor(@InjectEntityManager() manager: EntityManager) {
        this.myTodoRepo = manager.getCustomRepository(MyTodoRepository);
    }
}
