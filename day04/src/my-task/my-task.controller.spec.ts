import { Test, TestingModule } from '@nestjs/testing';
import { MyTaskController } from './my-task.controller';

describe('MyTask Controller', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [MyTaskController],
    }).compile();
  });
  it('should be defined', () => {
    const controller: MyTaskController = module.get<MyTaskController>(MyTaskController);
    expect(controller).toBeDefined();
  });
});
