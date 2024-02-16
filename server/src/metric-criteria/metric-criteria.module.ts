import { Module } from '@nestjs/common';
import { MetricCriteriaService } from './metric-criteria.service';
import { MetricCriteriaController } from './metric-criteria.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MetricCriterionEntity } from './entities/metric-criterion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MetricCriterionEntity])],
  controllers: [MetricCriteriaController],
  providers: [MetricCriteriaService],
  exports: [MetricCriteriaService],
})
export class MetricCriteriaModule {}
