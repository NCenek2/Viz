import { Test, TestingModule } from '@nestjs/testing';
import { MetricCriteriaService } from './metric-criteria.service';

describe('MetricCriteriaService', () => {
  let service: MetricCriteriaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MetricCriteriaService],
    }).compile();

    service = module.get<MetricCriteriaService>(MetricCriteriaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
