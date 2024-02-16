import { ReportEntity } from 'src/reports/entities/report.entity';
import { UserMetricEntity } from 'src/user-metrics/entities/user-metric.entity';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    primaryKeyConstraintName: 'users_pkey',
  })
  userId: number;

  @Column({ name: 'username', type: 'varchar', length: 10, nullable: false })
  username: string;

  @Unique('email_unique', ['email'])
  @Column({ name: 'email', type: 'varchar', length: 35, nullable: false })
  email: string;
  @Column({ name: 'password', type: 'varchar', length: 60, nullable: false })
  password: string;
  @Column({ name: 'role', type: 'smallint', nullable: false, default: 1 })
  role: number;
  @Column({
    name: 'refreshToken',
    type: 'varchar',
    length: 250,
    nullable: false,
    default: '',
  })
  refreshToken: string;

  @OneToMany(() => ReportEntity, (report) => report.user, { cascade: true })
  reports: ReportEntity[];

  @OneToMany(() => UserMetricEntity, (userMetric) => userMetric.user, {
    cascade: true,
  })
  userMetrics: UserMetricEntity[];
}
