import { Test, TestingModule } from '@nestjs/testing';
import { CurrentCyclesService } from './current-cycles.service';

describe('CurrentCyclesService', () => {
  let service: CurrentCyclesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CurrentCyclesService],
    }).compile();

    service = module.get<CurrentCyclesService>(CurrentCyclesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
