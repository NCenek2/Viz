import { Module } from '@nestjs/common';
import { CurrentCyclesService } from './current-cycles.service';
import { CurrentCyclesController } from './current-cycles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrentCycleEntity } from './entities/current-cycle.entity';
import { CycleEntity } from 'src/cycles/entities/cycle.entity';
import { CyclesModule } from 'src/cycles/cycles.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CurrentCycleEntity, CycleEntity]),
    CyclesModule,
  ],
  controllers: [CurrentCyclesController],
  providers: [CurrentCyclesService],
})
export class CurrentCyclesModule {}
