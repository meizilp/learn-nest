import { Test, TestingModule } from '@nestjs/testing';
import { MyTodoService } from './my-todo.service';

describe('MyTodoService', () => {
  let service: MyTodoService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MyTodoService],
    }).compile();
    service = module.get<MyTodoService>(MyTodoService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
