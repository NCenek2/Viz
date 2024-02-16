import { UserMetricEntity } from 'src/user-metrics/entities/user-metric.entity';
import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'metric_criteria' })
@Index(['weight', 'threshold'], { unique: true })
export class MetricCriterionEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    primaryKeyConstraintName: 'metric_criteria_pkey',
  })
  metricCriterionId: number;

  @Column({ name: 'weight', type: 'real', nullable: false })
  weight: number;

  @Column({ name: 'threshold', type: 'real', nullable: false })
  threshold: number;

  @OneToMany(
    () => UserMetricEntity,
    (userMetric) => userMetric.metricCriterion,
    { cascade: true },
  )
  userMetrics: UserMetricEntity[];
}
