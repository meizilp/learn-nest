import { Injectable } from '@nestjs/common';
import { MyTodoRepository } from './entity/my-todo.repository';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, IsNull } from 'typeorm';
import { MyTodo } from './entity/MyTodo';
import { CreateMyTodoDto } from './dto/create-my-todo-dto';

@Injectable()
export class MyTodoService {
    async findRoots() {
        return await this.myTodoRepo.find({
            select: ['id', 'parentId', 'title'],
            where: { parentId: IsNull() },
        });
    }

    async findAll() {
        return await this.myTodoRepo.find({
            select: ['id', 'parentId', 'title'],
        });
    }

    async findOneById(id: number) {
        return await this.myTodoRepo.findOne(id);
    }

    async findDescendents(id: number) {
        return await this.myTodoRepo.query('\
        with recursive \
        my_cte(id, parentId, title) as( \
        select id,parentid,title from my_todo where id = ? \
        union all \
        select my_todo.id, my_todo.parentId, my_todo.title from my_cte, my_todo \
            where my_todo.parentId = my_cte.id ) \
        select id, parentId, title from my_cte\
        ', [id]);
    }

    async findAncestors(id: number) {
        return await this.myTodoRepo.query('\
        with recursive \
        my_cte(id, parentId, title) as( \
        select id,parentid,title from my_todo where id = ? \
        union all \
        select my_todo.id, my_todo.parentId, my_todo.title from my_cte, my_todo \
            where my_todo.id = my_cte.parentid ) \
        select id, parentId, title from my_cte\
        ', [id]);
    }

    async findChildren(id: number) {
        return await this.myTodoRepo.find({
            select: ['id', 'parentId', 'title'],
            where: { parentId: id },
        });
    }

    async create(createMyTodoDto: CreateMyTodoDto) {
        const tobeSaveTodos: MyTodo[] = [];
        const mytodo = this.myTodoRepo.create({
            id: Date.now(),
        });
        mytodo.title = createMyTodoDto.title;
        mytodo.createTime = new Date();
        tobeSaveTodos.push(mytodo);
        if (createMyTodoDto.parent) {
            const parentTodo = await this.findOneById(createMyTodoDto.parent);
            if (parentTodo.id) {
                mytodo.parentId = parentTodo.id;
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
