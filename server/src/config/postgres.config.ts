import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { CurrentCycleEntity } from 'src/current-cycles/entities/current-cycle.entity';
import { CycleEntity } from 'src/cycles/entities/cycle.entity';
import { MetricCriterionEntity } from 'src/metric-criteria/entities/metric-criterion.entity';
import { MetricEntity } from 'src/metrics/entities/metric.entity';
import { ReportEntity } from 'src/reports/entities/report.entity';
import { UserMetricEntity } from 'src/user-metrics/entities/user-metric.entity';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class PostgresConfig implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      // Add postgres as type
      type: 'postgres',
      // Database host
      host: this.configService.get<string>('DB_HOST', 'localhost'),
      // Database port
      port: this.configService.get<number>('DB_PORT', 5432),
      // Database username
      username: this.configService.get<string>('DB_USERNAME', 'postgres'),
      // Database password
      password: this.configService.get<string>('DB_PASSWORD', 'B3nnywashere'),
      // Database name
      database: this.configService.get<string>('DB_DATABASE', 'verizon_app'),
      // Entity files path
      entities: [
        MetricEntity,
        UserMetricEntity,
        CycleEntity,
        UserEntity,
        ReportEntity,
        MetricCriterionEntity,
        CurrentCycleEntity,
      ],
      // entities: [__dirname + '/../**/*.entity{.js,.ts}'],
      // Auto-generate database schema (only for development)
      synchronize: true,
    };
  }
}
