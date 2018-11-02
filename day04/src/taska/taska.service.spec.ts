import { Test, TestingModule } from '@nestjs/testing';
import { TaskaService } from './taska.service';

describe('TaskaService', () => {
  let service: TaskaService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskaService],
    }).compile();
    service = module.get<TaskaService>(TaskaService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
