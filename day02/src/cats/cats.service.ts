import { Injectable } from '@nestjs/common';
import { Cat } from './interfaces/cat.interface';

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

    create(newCat: Cat) {
        this.cats.push(newCat);
        return newCat.id;
    }
}
