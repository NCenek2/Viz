import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
} from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { CreateMetricDto } from './dto/create-metric.dto';
import { UpdateMetricDto } from './dto/update-metric.dto';
import { UniqueExceptionFilter } from 'src/Errors/conflict.exception.filters';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get()
  async getAllMetrics() {
    return await this.metricsService.getAllMetrics();
  }

  @Get(':metricId')
  async getMetricById(@Param('metricId', ParseIntPipe) metricId: number) {
    return await this.metricsService.getMetricById(metricId);
  }

  @Post()
  @HttpCode(201)
  async createMetric(@Body() createMetricDto: CreateMetricDto) {
    try {
      await this.metricsService.createMetric(createMetricDto);
    } catch (err) {
      UniqueExceptionFilter(err, 'Metric with that name already exists');
    }
  }

  @Patch(':metricId')
  @HttpCode(204)
  async updateMetric(
    @Param('metricId', ParseIntPipe) metricId: number,
    @Body() updateMetricDto: UpdateMetricDto,
  ) {
    try {
      await this.metricsService.updateMetric(metricId, updateMetricDto);
    } catch (err) {
      UniqueExceptionFilter(err, 'Metric with that name already exists');
    }
  }

  @Delete(':metricId')
  @HttpCode(204)
  async deleteMetric(@Param('metricId', ParseIntPipe) metricId: number) {
    await this.metricsService.deleteMetric(metricId);
  }
}
