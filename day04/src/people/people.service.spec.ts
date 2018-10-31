import { Test, TestingModule } from '@nestjs/testing';
import { PeopleService } from './people.service';

describe('PeopleService', () => {
  let service: PeopleService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PeopleService],
    }).compile();
    service = module.get<PeopleService>(PeopleService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
