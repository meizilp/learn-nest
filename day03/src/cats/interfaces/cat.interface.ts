import { CreateCatDto } from '../dto/create-cat.dto';
import { create } from 'domain';

export class Cat {
    readonly id: number;
    name: string;
    age: number;

    constructor(createDto: CreateCatDto) {
        this.id = Date.now();
        this.name = createDto.name;
        this.age = createDto.age;
    }
}