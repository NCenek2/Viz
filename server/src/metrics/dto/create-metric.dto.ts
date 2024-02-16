import { IsNotEmpty, MaxLength } from 'class-validator';
import { METRICS } from 'src/constants/constants';
export class CreateMetricDto {
  @IsNotEmpty({ message: 'Metric name cannot be empty' })
  @MaxLength(METRICS.METRICS_NAME, {
    message: `Metric name must have ${METRICS.METRICS_NAME} characters or less`,
  })
  metricName: string;

  @IsNotEmpty({ message: 'Metric unit cannot be empty' })
  @MaxLength(METRICS.METRICS_UNIT, {
    message: `Metric unit must have ${METRICS.METRICS_UNIT} characters or less`,
  })
  metricUnit: string;
}
