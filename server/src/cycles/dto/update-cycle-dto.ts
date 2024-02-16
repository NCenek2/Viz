import { PickType } from '@nestjs/mapped-types';
import { CreateCycleDto } from './create-cycle.dto';

export class UpdateCycleDateDto extends PickType(CreateCycleDto, [
  'startDate',
] as const) {}
