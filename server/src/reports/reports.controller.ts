import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  HttpCode,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import {
  UpdateReportAcknowledgementDto,
  UpdateReportContentDto,
} from './dto/update-report.dto';
import { UniqueExceptionFilter } from 'src/Errors/conflict.exception.filters';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  async getFilteredReports(
    @Query('userId', ParseIntPipe) userId: number,
    @Query('cycleId', ParseIntPipe) cycleId: number,
  ) {
    return await this.reportsService.getFilteredReports(userId, cycleId);
  }

  @Get('/user/:userId')
  async getReportByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return await this.reportsService.getReportByUserId(userId);
  }

  @Post()
  @HttpCode(201)
  async createReport(@Body() createReportDto: CreateReportDto) {
    try {
      return await this.reportsService.create(createReportDto);
    } catch (err) {
      UniqueExceptionFilter(err, 'User report for cycle already exists ');
    }
  }

  @Patch('/acknowledge/:reportId')
  @HttpCode(204)
  async updateReportAcknowledgement(
    @Param('reportId', ParseIntPipe) reportId: number,
    @Body() updateReportAcknowledgementDto: UpdateReportAcknowledgementDto,
  ) {
    return await this.reportsService.updateReportAcknowledgement(
      reportId,
      updateReportAcknowledgementDto,
    );
  }

  @Patch(':reportId')
  @HttpCode(204)
  updateReportContent(
    @Param('reportId', ParseIntPipe) reportId: number,
    @Body() updateReportDto: UpdateReportContentDto,
  ) {
    return this.reportsService.updateReportContent(reportId, updateReportDto);
  }

  @Delete(':reportId')
  @HttpCode(204)
  async deleteReport(@Param('reportId', ParseIntPipe) reportId: number) {
    await this.reportsService.deleteReport(reportId);
  }
}
