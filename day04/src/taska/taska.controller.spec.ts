import { Test, TestingModule } from '@nestjs/testing';
import { TaskaController } from './taska.controller';

describe('Taska Controller', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [TaskaController],
    }).compile();
  });
  it('should be defined', () => {
    const controller: TaskaController = module.get<TaskaController>(TaskaController);
    expect(controller).toBeDefined();
  });
});
