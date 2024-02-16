import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMetricCriterionDto } from './dto/create-metric-criterion.dto';
import { MetricCriterionEntity } from './entities/metric-criterion.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MetricCriteriaService {
  constructor(
    @InjectRepository(MetricCriterionEntity)
    private readonly metricCriterionRepository: Repository<MetricCriterionEntity>,
  ) {}

  async getAllMetricCriteria() {
    return await this.metricCriterionRepository.find();
  }

  async getMetricCriterionById(metricCriterionId: number) {
    const metricCriterion = await this.metricCriterionRepository.findOne({
      where: { metricCriterionId },
    });

    if (!metricCriterion) {
      throw new NotFoundException(
        `Metric criterion with id = ${metricCriterionId} was not found`,
      );
    }

    return metricCriterion;
  }

  async getMetricByWeightAndThreshold(weight: number, threshold: number) {
    return await this.metricCriterionRepository.findOne({
      where: { weight, threshold },
    });
  }

  async createMetricCriterion(
    createMetricCriterionDto: CreateMetricCriterionDto,
  ) {
    return await this.metricCriterionRepository.save(createMetricCriterionDto);
  }

  async createCycleMetricCriteria(
    createMetricCriterionDto: CreateMetricCriterionDto[],
  ) {
    let metricCriteriaIds: number[] = [];
    for (let metricCriterion of createMetricCriterionDto) {
      const { weight, threshold } = metricCriterion;

      let criterion = await this.getMetricByWeightAndThreshold(
        weight,
        threshold,
      );

      if (!criterion) {
        criterion = await this.createMetricCriterion(metricCriterion);
      }

      const { metricCriterionId } = criterion;
      metricCriteriaIds.push(metricCriterionId);
    }

    return metricCriteriaIds;
  }

  async deleteMetricCriterion(metricCriterionId: number) {
    await this.getMetricCriterionById(metricCriterionId);
    await this.metricCriterionRepository.delete(metricCriterionId);
  }
}
