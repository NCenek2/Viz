import { PartialType } from '@nestjs/mapped-types';
import { CreateMetricCriterionDto } from './create-metric-criterion.dto';

export class UpdateMetricCriterionDto extends PartialType(CreateMetricCriterionDto) {}
