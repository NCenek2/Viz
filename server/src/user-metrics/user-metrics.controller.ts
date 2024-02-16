import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  HttpCode,
  BadRequestException,
} from '@nestjs/common';
import { UserMetricsService } from './user-metrics.service';
import {
  CreateUserMetricDto,
  CreateUserMetricEntriesDto,
} from './dto/create-user-metric.dto';
import {
  UpdateDashboardUserMetricsDto,
  UpdateUserMetricDto,
} from './dto/update-user-metric.dto';
import { UniqueExceptionFilter } from 'src/Errors/conflict.exception.filters';

@Controller('user_metrics')
export class UserMetricsController {
  constructor(private readonly userMetricsService: UserMetricsService) {}

  @Get()
  async getUserCycleMetrics(
    @Query('userId', ParseIntPipe) userId: number,
    @Query('cycleId', ParseIntPipe) cycleId: number,
  ) {
    return await this.userMetricsService.getUserCycleMetrics(userId, cycleId);
  }

  @Get('/user_cycles/:userId')
  async getUserCycles(@Param('userId', ParseIntPipe) userId: number) {
    return await this.userMetricsService.getUserCycles(userId);
  }

  @Get('/cycle_users/:cycleId')
  async getCycleUsers(@Param('cycleId', ParseIntPipe) cycleId: number) {
    return await this.userMetricsService.getCycleUsers(cycleId);
  }

  @Get('/rankings/:cycleId')
  async getRankingData(@Param('cycleId', ParseIntPipe) cycleId: number) {
    return await this.userMetricsService.getRankingData(cycleId);
  }

  @Get(':userMetricId')
  async getUserMetricById(
    @Param('userMetricId', ParseIntPipe) userMetricId: number,
  ) {
    return await this.userMetricsService.getUserMetricById(userMetricId);
  }

  @Post('/createcycle')
  @HttpCode(201)
  async createUserMetricEntries(
    @Body() createUserMetricEntriesDto: CreateUserMetricEntriesDto,
  ) {
    try {
      await this.userMetricsService.createUserMetricEntries(
        createUserMetricEntriesDto,
      );
    } catch (err) {
      UniqueExceptionFilter(err, 'User metric values already exist');
    }
  }

  @Post()
  @HttpCode(201)
  async createUserMetric(@Body() createUserMetricDto: CreateUserMetricDto) {
    try {
      await this.userMetricsService.createUserMetric(createUserMetricDto);
    } catch (err) {
      UniqueExceptionFilter(err, 'User metric values already exist');
    }
  }

  @Patch('/dashboard')
  @HttpCode(204)
  async updateDashboardUserMetrics(
    @Body() updateDashboardUserMetricsDto: UpdateDashboardUserMetricsDto,
  ) {
    await this.userMetricsService.updateDashboardUserMetrics(
      updateDashboardUserMetricsDto,
    );
  }

  @Patch(':userMetricId')
  @HttpCode(204)
  async updateUserMetricValue(
    @Param('userMetricId', ParseIntPipe) userMetricId: number,
    @Body() updateUserMetricDto: UpdateUserMetricDto,
  ) {
    return await this.userMetricsService.updateUserMetricValue(
      userMetricId,
      updateUserMetricDto,
    );
  }

  @Delete(':userMetricId')
  @HttpCode(204)
  async deleteUserMetric(
    @Param('userMetricId', ParseIntPipe) userMetricId: number,
  ) {
    await this.userMetricsService.deleteUserMetric(userMetricId);
  }
}
