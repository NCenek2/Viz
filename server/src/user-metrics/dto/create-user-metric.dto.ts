import { Transform, Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsInt, ValidateNested } from 'class-validator';

export class CreateUserMetricDto {
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: 'Metric id must be an integer' })
  metricId: number;

  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: 'Cycle id must be an integer' })
  cycleId: number;

  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: 'User id must be an integer' })
  userId: number;

  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: 'Metric criterion id must be an integer' })
  metricCriterionId: number;
}

class MetricItemDTO {
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: 'Metric criterion id must be an integer' })
  metricCriterionId: number;

  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: 'Metric id must be an integer' })
  metricId: number;
}

export class CreateUserMetricEntriesDto {
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: 'Cycle id must be an integer' })
  cycleId: number;

  @IsArray({ message: 'Metric items  must be an array' })
  @ArrayMinSize(1, { message: 'At least one metric item is required' })
  @ValidateNested({ each: true })
  @Type(() => MetricItemDTO)
  metricItems: MetricItemDTO[];

  @IsArray({ message: 'User ids must be an array' })
  @Transform(({ value }) => value.map((userId: string) => parseInt(userId)))
  @ArrayMinSize(1, { message: 'At least one user id is required' })
  @IsInt({ each: true, message: 'Each user id must be an integer' })
  userIds: number[];
}
