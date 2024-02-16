import { Matches } from 'class-validator';

const dateRegex = /\d{4}-\d{2}-\d{2}/;

export class CreateCycleDto {
  @Matches(dateRegex, {
    message: 'Date must follow the pattern YYYY-MM-DD',
  })
  startDate: string;
}
