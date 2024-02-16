import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
} from '@nestjs/common';
import { MetricCriteriaService } from './metric-criteria.service';
import { CreateMetricCriterionDto } from './dto/create-metric-criterion.dto';
import { UniqueExceptionFilter } from 'src/Errors/conflict.exception.filters';

@Controller('metric_criteria')
export class MetricCriteriaController {
  constructor(private readonly metricCriteriaService: MetricCriteriaService) {}

  @Get()
  async getAllMetricCriteria() {
    return await this.metricCriteriaService.getAllMetricCriteria();
  }

  @Get(':metricCriterionId')
  async getMetricCriterionById(
    @Param('metricCriterionId', ParseIntPipe) metricCriterionId: number,
  ) {
    return await this.metricCriteriaService.getMetricCriterionById(
      metricCriterionId,
    );
  }

  @Post('/createcycle')
  @HttpCode(201)
  async createCycleMetricCriteria(
    @Body() createMetricCriterionDto: CreateMetricCriterionDto[],
  ) {
    try {
      return await this.metricCriteriaService.createCycleMetricCriteria(
        createMetricCriterionDto,
      );
    } catch (err) {
      UniqueExceptionFilter(
        err,
        'Metric criterion with given weight and threshold already exists',
      );
    }
  }

  @Post()
  @HttpCode(201)
  async createMetricCriterion(
    @Body() createMetricCriterionDto: CreateMetricCriterionDto,
  ) {
    try {
      return await this.metricCriteriaService.createMetricCriterion(
        createMetricCriterionDto,
      );
    } catch (err) {
      UniqueExceptionFilter(
        err,
        'Metric criterion with given weight and threshold already exists',
      );
    }
  }

  @Delete(':metricCriterionId')
  @HttpCode(204)
  async deleteMetricCriterion(
    @Param('metricCriterionId', ParseIntPipe) metricCriterionId: number,
  ) {
    await this.metricCriteriaService.deleteMetricCriterion(metricCriterionId);
  }
}
