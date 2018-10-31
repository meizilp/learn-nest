import { Test, TestingModule } from '@nestjs/testing';
import { ThingController } from './thing.controller';

describe('Thing Controller', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [ThingController],
    }).compile();
  });
  it('should be defined', () => {
    const controller: ThingController = module.get<ThingController>(ThingController);
    expect(controller).toBeDefined();
  });
});
