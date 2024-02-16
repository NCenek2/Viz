import { IsNumber, Max, Min } from 'class-validator';

export class CreateMetricCriterionDto {
  @IsNumber({}, { message: 'Weight must be a number' })
  @Min(0.0, { message: 'Weight must be 0.0 or greater' })
  @Max(1.0, { message: 'Weight must be less than or equal to 1.0' })
  weight: number;
  @IsNumber({}, { message: 'Threshold must be a number' })
  @Min(0.0, { message: 'Weight must be 0.0 or greater' })
  threshold: number;
}
