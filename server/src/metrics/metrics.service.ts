import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMetricDto } from './dto/create-metric.dto';
import { UpdateMetricDto } from './dto/update-metric.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MetricEntity } from './entities/metric.entity';

@Injectable()
export class MetricsService {
  constructor(
    @InjectRepository(MetricEntity)
    private readonly metricRepository: Repository<MetricEntity>,
  ) {}

  async getAllMetrics() {
    return await this.metricRepository.find();
  }

  async getMetricById(metricId: number) {
    const metric = await this.metricRepository.findOne({ where: { metricId } });

    if (!metric) {
      throw new NotFoundException(
        `Metric with metricId = ${metricId} was not found`,
      );
    }

    return metric;
  }

  async createMetric(createMetricDto: CreateMetricDto) {
    await this.metricRepository.save(createMetricDto);
  }

  async updateMetric(metricId: number, updateMetricDto: UpdateMetricDto) {
    await this.getMetricById(metricId);
    await this.metricRepository.update(metricId, updateMetricDto);
  }

  async deleteMetric(metricId: number) {
    await this.getMetricById(metricId);
    await this.metricRepository.delete(metricId);
  }
}
