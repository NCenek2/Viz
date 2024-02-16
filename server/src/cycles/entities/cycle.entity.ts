import { Matches } from 'class-validator';
import { CurrentCycleEntity } from 'src/current-cycles/entities/current-cycle.entity';
import { ReportEntity } from 'src/reports/entities/report.entity';
import { UserMetricEntity } from 'src/user-metrics/entities/user-metric.entity';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

const dateRegex = /\d{4}-\d{2}-\d{2}/;

@Entity({ name: 'cycles' })
export class CycleEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    primaryKeyConstraintName: 'cycles_pkey',
  })
  cycleId: number;

  @Unique('date_unique', ['startDate'])
  @Column({ name: 'startDate', type: 'date', nullable: false })
  @Matches(dateRegex)
  startDate: string;

  @OneToMany(() => ReportEntity, (report) => report.cycle, {
    cascade: true,
  })
  reports: ReportEntity[];

  @OneToMany(() => UserMetricEntity, (userMetric) => userMetric.cycle, {
    cascade: true,
  })
  userMetrics: UserMetricEntity[];

  @OneToMany(() => CurrentCycleEntity, (currentCycle) => currentCycle.cycle, {
    cascade: true,
  })
  currentCycles: CurrentCycleEntity[];
}
