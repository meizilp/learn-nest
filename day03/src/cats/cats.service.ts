import { Injectable } from '@nestjs/common';
import { Cat } from './interfaces/cat.interface';
import { CreateCatDto } from './dto/create-cat.dto';

@Injectable()
export class CatsService {
    private readonly cats: Cat[] = [];

    findAll() {
        return this.cats;
    }

    findOne(id: number) {
        for (const cat of this.cats) {
            if (cat.id === id) {
                return cat;
            }
        }
        return {};
    }

    create(newCatDto: CreateCatDto) {
        const cat = new Cat(newCatDto);
        this.cats.push(cat);
        return cat.id;
    }
}
