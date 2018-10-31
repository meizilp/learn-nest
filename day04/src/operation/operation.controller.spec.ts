import { Test, TestingModule } from '@nestjs/testing';
import { OperationController } from './operation.controller';

describe('Operation Controller', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [OperationController],
    }).compile();
  });
  it('should be defined', () => {
    const controller: OperationController = module.get<OperationController>(OperationController);
    expect(controller).toBeDefined();
  });
});
