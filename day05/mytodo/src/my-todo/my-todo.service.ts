import { Injectable } from '@nestjs/common';
import { MyTodoRepository } from './entity/my-todo.repository';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { MyTodo } from './entity/MyTodo';

@Injectable()
export class MyTodoService {
    private readonly myTodoRepo: MyTodoRepository;

    constructor(@InjectEntityManager() manager: EntityManager) {
        this.myTodoRepo = manager.getCustomRepository(MyTodoRepository);
    }
}
