import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import {
  UpdateReportAcknowledgementDto,
  UpdateReportContentDto,
} from './dto/update-report.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ReportEntity } from './entities/report.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { CyclesService } from 'src/cycles/cycles.service';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(ReportEntity)
    private readonly reportRepository: Repository<ReportEntity>,
    private readonly usersService: UsersService,
    private readonly cyclesService: CyclesService,
  ) {}

  async getFilteredReports(userId: number, cycleId: number) {
    await this.usersService.getUserById(userId);
    await this.cyclesService.getCycleById(cycleId);

    return await this.reportRepository
      .createQueryBuilder('report')
      .select('report.reportId', 'reportId')
      .addSelect('report.report', 'report')
      .addSelect('report.acknowledged', 'acknowledged')
      .innerJoin('report.user', 'user')
      .innerJoin('report.cycle', 'cycle')
      .where('user.userId = :userId', { userId })
      .andWhere('cycle.cycleId = :cycleId', { cycleId })
      .getRawMany();
  }

  async getReportByUserId(userId: number) {
    await this.usersService.getUserById(userId);

    return await this.reportRepository
      .createQueryBuilder('reports')
      .select('reports.cycleId', 'cycleId')
      .addSelect('c.startDate', 'startDate')
      .innerJoin('cycles', 'c', 'reports.cycleId = c.cycleId')
      .where('reports.userId = :userId', { userId })
      .getRawMany();
  }

  async getReportById(reportId: number) {
    const report = await this.reportRepository.findOne({ where: { reportId } });

    if (!report) {
      throw new NotFoundException(`Report with id = ${reportId} was not found`);
    }

    return report;
  }

  async create(createReportDto: CreateReportDto) {
    const { userId, cycleId, report } = createReportDto;

    const user = await this.usersService.getUserById(userId);
    const cycle = await this.cyclesService.getCycleById(cycleId);

    const newReport = this.reportRepository.create({
      user,
      cycle,
      report,
    });

    const returnedReport = await this.reportRepository.save(newReport);
    return returnedReport;
  }

  // Used to verify that you can do this to user with id
  async updateReportAcknowledgement(
    reportId: number,
    updateReportAcknowledgementDto: UpdateReportAcknowledgementDto,
  ) {
    const report = await this.getReportById(reportId);

    const newReport = this.reportRepository.create({
      ...report,
      acknowledged: true,
    });

    await this.reportRepository.update(reportId, newReport);
  }

  async updateReportContent(
    reportId: number,
    updateReportDto: UpdateReportContentDto,
  ) {
    await this.getReportById(reportId);
    await this.reportRepository.update(reportId, {
      ...updateReportDto,
      acknowledged: false,
    });
  }

  async deleteReport(reportId: number) {
    await this.getReportById(reportId);

    await this.reportRepository.delete(reportId);
  }
}
