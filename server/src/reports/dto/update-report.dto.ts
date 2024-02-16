import { PickType } from '@nestjs/mapped-types';
import { CreateReportDto } from './create-report.dto';

export class UpdateReportContentDto extends PickType(CreateReportDto, [
  'report',
] as const) {}

export class UpdateReportAcknowledgementDto extends PickType(CreateReportDto, [
  'userId',
] as const) {}
