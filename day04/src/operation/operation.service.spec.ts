import { Test, TestingModule } from '@nestjs/testing';
import { OperationService } from './operation.service';

describe('OperationService', () => {
  let service: OperationService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OperationService],
    }).compile();
    service = module.get<OperationService>(OperationService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
