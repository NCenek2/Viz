import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportEntity } from './entities/report.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { CycleEntity } from 'src/cycles/entities/cycle.entity';
import { UsersModule } from 'src/users/users.module';
import { CyclesModule } from 'src/cycles/cycles.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReportEntity, UserEntity, CycleEntity]),
    UsersModule,
    CyclesModule,
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
