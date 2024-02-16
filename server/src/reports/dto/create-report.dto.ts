import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, MaxLength } from 'class-validator';
import { REPORTS } from 'src/constants/constants';

export class CreateReportDto {
  @IsNotEmpty({ message: 'Report should not be empty' })
  @MaxLength(REPORTS.report, {
    message: `Report must be ${REPORTS.report} characters or fewer`,
  })
  report: string;

  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: 'Cycle id must be an integer' })
  cycleId: number;

  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: 'User id must be an integer' })
  userId: number;
}
