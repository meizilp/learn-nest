import { Controller, Get, Param } from '@nestjs/common';

@Controller('cats')
export class CatsController {

    cats = [{ id: 100, name: 'Garfield' }, { id: 101, name: 'Tom' }];

    @Get()
    findAll() {
        return this.cats;
    }

    @Get(':id')
    findOne(@Param() param) {
        for (const cat of this.cats) {
            if (cat.id === +param.id) {
                return cat;
            }
        }
        return { id: 0, name: 'not exist' };
    }
}
