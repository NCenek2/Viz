import { Module } from '@nestjs/common';
import { UserMetricsService } from './user-metrics.service';
import { UserMetricsController } from './user-metrics.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserMetricEntity } from './entities/user-metric.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { CycleEntity } from 'src/cycles/entities/cycle.entity';
import { MetricEntity } from 'src/metrics/entities/metric.entity';
import { MetricCriterionEntity } from 'src/metric-criteria/entities/metric-criterion.entity';
import { UsersModule } from 'src/users/users.module';
import { CyclesModule } from 'src/cycles/cycles.module';
import { MetricsModule } from 'src/metrics/metrics.module';
import { MetricCriteriaModule } from 'src/metric-criteria/metric-criteria.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserMetricEntity,
      UserEntity,
      CycleEntity,
      MetricEntity,
      MetricCriterionEntity,
    ]),
    UsersModule,
    CyclesModule,
    MetricsModule,
    MetricCriteriaModule,
  ],
  controllers: [UserMetricsController],
  providers: [UserMetricsService],
})
export class UserMetricsModule {}
