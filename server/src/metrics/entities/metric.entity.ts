import { UserMetricEntity } from 'src/user-metrics/entities/user-metric.entity';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity({ name: 'metrics' })
export class MetricEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    primaryKeyConstraintName: 'metrics_pkey',
  })
  metricId: number;

  @Unique('name_unique', ['metricName'])
  @Column({
    name: 'name',
    type: 'varchar',
    length: 20,
    nullable: false,
  })
  metricName: string;
  @Column({ name: 'unit', type: 'varchar', length: 10, nullable: false })
  metricUnit: string;

  @OneToMany(() => UserMetricEntity, (userMetric) => userMetric.metric, {
    cascade: true,
  })
  userMetrics: UserMetricEntity[];
}

// eager: true will automatically load userMetrics when metric is sent
