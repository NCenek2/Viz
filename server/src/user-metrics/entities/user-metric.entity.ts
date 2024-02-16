import { CycleEntity } from 'src/cycles/entities/cycle.entity';
import { MetricCriterionEntity } from 'src/metric-criteria/entities/metric-criterion.entity';
import { MetricEntity } from 'src/metrics/entities/metric.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'user_metrics' })
// @Index(['metric', 'user', 'cycle', 'metricCriterion'], { unique: true })
export class UserMetricEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    primaryKeyConstraintName: 'user_metrics_pkey',
  })
  userMetricId: number;

  @Column({ name: 'value', type: 'real', nullable: false, default: 0.0 })
  value: number;

  @ManyToOne(() => MetricEntity, (metric) => metric.userMetrics, {
    orphanedRowAction: 'delete',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'metricId' })
  metric: MetricEntity;

  @ManyToOne(() => UserEntity, (user) => user.userMetrics, {
    orphanedRowAction: 'delete',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @ManyToOne(() => CycleEntity, (cycle) => cycle.userMetrics, {
    orphanedRowAction: 'delete',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'cycleId' })
  cycle: CycleEntity;

  @ManyToOne(
    () => MetricCriterionEntity,
    (metricCriterion) => metricCriterion.userMetrics,
    {
      orphanedRowAction: 'delete',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      nullable: false,
    },
  )
  @JoinColumn({ name: 'metricCriterionId' })
  metricCriterion: MetricCriterionEntity;
}
