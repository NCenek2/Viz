import { IsInt } from 'class-validator';

export class CreateCurrentCycleDto {
  @IsInt({ message: 'Cycle id must be an integer' })
  cycleId: number;
}
