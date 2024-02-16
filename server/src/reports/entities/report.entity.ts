import { CycleEntity } from 'src/cycles/entities/cycle.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'reports' })
@Index(['user', 'cycle'], { unique: true })
export class ReportEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    primaryKeyConstraintName: 'reports_pkey',
  })
  reportId: number;

  @Column({ name: 'report', type: 'varchar', length: 350, nullable: false })
  report: string;

  @Column({
    name: 'acknowledged',
    type: 'boolean',
    nullable: false,
    default: false,
  })
  acknowledged: boolean;

  @ManyToOne(() => UserEntity, (user) => user.reports, {
    orphanedRowAction: 'delete',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @ManyToOne(() => CycleEntity, (cycle) => cycle.reports, {
    orphanedRowAction: 'delete',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'cycleId' })
  cycle: CycleEntity;
}
