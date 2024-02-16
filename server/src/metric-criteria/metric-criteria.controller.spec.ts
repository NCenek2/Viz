import { Test, TestingModule } from '@nestjs/testing';
import { MetricCriteriaController } from './metric-criteria.controller';
import { MetricCriteriaService } from './metric-criteria.service';

describe('MetricCriteriaController', () => {
  let controller: MetricCriteriaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MetricCriteriaController],
      providers: [MetricCriteriaService],
    }).compile();

    controller = module.get<MetricCriteriaController>(MetricCriteriaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
