import { Injectable } from '@nestjs/common';
import { TreeRepository, getCustomRepository } from 'typeorm';
import { TaskA } from './entity/TaskA';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskADto } from './dto/create_taska_dto';

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

    async create(createDto: CreateTaskADto) {
        return await this.taskRepository.save(
            this.taskRepository.create({
                title: createDto.title,
                parent: createDto.parent,
            }));
    }
}
