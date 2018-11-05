import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MyTask } from './entity/myTask';
import { CreateMyTaskDto } from './dto/create_mytask_dto';

@Injectable()
export class MyTaskService {
    constructor(
        @InjectRepository(MyTask)
        private readonly repo: Repository<MyTask>,
    ) { }

    async findAll() {
    }

    async findOneById(id: number) {
    }

    async create(createDto: CreateMyTaskDto) {
    }
}
