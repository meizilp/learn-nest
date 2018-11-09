import { Test, TestingModule } from '@nestjs/testing';
import { MyTodoController } from './my-todo.controller';

describe('MyTodo Controller', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [MyTodoController],
    }).compile();
  });
  it('should be defined', () => {
    const controller: MyTodoController = module.get<MyTodoController>(MyTodoController);
    expect(controller).toBeDefined();
  });
});
