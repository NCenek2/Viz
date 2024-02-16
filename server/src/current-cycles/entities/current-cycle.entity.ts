import { CycleEntity } from 'src/cycles/entities/cycle.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'current_cycles' })
export class CurrentCycleEntity {
  @PrimaryGeneratedColumn({
    type: 'smallint',
    primaryKeyConstraintName: 'current_cycles_pkey',
  })
  currentCycleId: number;

  @ManyToOne(() => CycleEntity, (cycle) => cycle.currentCycles, {
    orphanedRowAction: 'delete',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'cycleId' })
  cycle: CycleEntity;
}
