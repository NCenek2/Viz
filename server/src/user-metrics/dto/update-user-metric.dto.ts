import { PickType } from '@nestjs/mapped-types';
import { Transform, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNumber,
  Min,
  ValidateNested,
} from 'class-validator';

class UserMetricItems {
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: 'User metric id must be an interger' })
  userMetricId: number;
  @IsNumber({}, { message: 'User metric must have a value' })
  @Min(0.0, { message: 'User metric value must be 0.0 or greater' })
  userMetricValue: number;
}
export class UpdateUserMetricDto extends PickType(UserMetricItems, [
  'userMetricValue',
] as const) {}

export class UpdateDashboardUserMetricsDto {
  @IsArray({ message: 'User metric items must be an array' })
  @ArrayMinSize(1, { message: 'At least one user metric item is required' })
  @ValidateNested({ each: true })
  @Type(() => UserMetricItems)
  updated: UserMetricItems[];
}
