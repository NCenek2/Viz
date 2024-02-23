import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MetricsModule } from './metrics/metrics.module';
import { CyclesModule } from './cycles/cycles.module';
import { UserMetricsModule } from './user-metrics/user-metrics.module';
import { PostgresConfig } from './config/postgres.config';
import { ConfigModule } from '@nestjs/config';
import { ReportsModule } from './reports/reports.module';
import { CurrentCyclesModule } from './current-cycles/current-cycles.module';
import { MetricCriteriaModule } from './metric-criteria/metric-criteria.module';
import { AuthModule } from './auth/auth.module';
import { RegisterModule } from './register/register.module';
import { LogoutModule } from './logout/logout.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: PostgresConfig,
      inject: [PostgresConfig],
    }),
    MetricsModule,
    UserMetricsModule,
    CyclesModule,
    UsersModule,
    ReportsModule,
    CurrentCyclesModule,
    MetricCriteriaModule,
    AuthModule,
    RegisterModule,
    LogoutModule,
    ProfileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
