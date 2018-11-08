import { Injectable } from '@nestjs/common';
import { InjectRepository, InjectEntityManager } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { MyTask } from './entity/myTask';
import { CreateMyTaskDto } from './dto/create_mytask_dto';
import { MyTaskRepository } from './entity/MyTaskRepository';

@Injectable()
export class MyTaskService {

    private readonly repo: MyTaskRepository;

    constructor(
        @InjectEntityManager()
        manager: EntityManager,
    ) {
        this.repo = manager.getCustomRepository(MyTaskRepository);
    }

    async findAll() {
        return this.repo.sayHello();
    }

    async findOneById(id: number) {
    }

    async create(createDto: CreateMyTaskDto) {
    }
}
