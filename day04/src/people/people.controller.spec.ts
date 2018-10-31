import { Test, TestingModule } from '@nestjs/testing';
import { PeopleController } from './people.controller';

describe('People Controller', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [PeopleController],
    }).compile();
  });
  it('should be defined', () => {
    const controller: PeopleController = module.get<PeopleController>(PeopleController);
    expect(controller).toBeDefined();
  });
});
