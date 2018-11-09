import { Injectable } from '@nestjs/common';
import { TreeRepository, getCustomRepository, Transaction, TransactionManager, EntityManager } from 'typeorm';
import { TaskA } from './entity/TaskA';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskADto } from './dto/create_taska_dto';
import { MyTaskRepository } from 'my-task/entity/MyTaskRepository';

@Injectable()
export class TaskaService {
    constructor(
        @InjectRepository(TaskA)
        private readonly taskRepository: TreeRepository<TaskA>,
    ) { }

    async findAll() {
        return await this.taskRepository.findTrees();
    }

    async findOneById(id: number) {
        return await this.taskRepository.findOne(id);
    }

    async findChildrenById(id: number) {
        return await this.taskRepository.findDescendants(await this.findOneById(id));
    }

    @Transaction()
    async create(createDto: CreateTaskADto, @TransactionManager() manager?: EntityManager) {
        manager.connection.getMetadata(TaskA);
        return await this.taskRepository.save(
            this.taskRepository.create({
                title: createDto.title,
                parent: createDto.parent,
            }));
    }
}
