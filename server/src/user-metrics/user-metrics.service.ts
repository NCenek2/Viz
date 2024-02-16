import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateUserMetricDto,
  CreateUserMetricEntriesDto,
} from './dto/create-user-metric.dto';
import {
  UpdateDashboardUserMetricsDto,
  UpdateUserMetricDto,
} from './dto/update-user-metric.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserMetricEntity } from './entities/user-metric.entity';
import { UsersService } from 'src/users/users.service';
import { MetricsService } from 'src/metrics/metrics.service';
import { MetricCriteriaService } from 'src/metric-criteria/metric-criteria.service';
import { CyclesService } from 'src/cycles/cycles.service';

@Injectable()
export class UserMetricsService {
  constructor(
    @InjectRepository(UserMetricEntity)
    private readonly userMetricRepository: Repository<UserMetricEntity>,
    private readonly usersService: UsersService,
    private readonly cyclesService: CyclesService,
    private readonly metricsService: MetricsService,
    private readonly metricCriteriaService: MetricCriteriaService,
  ) {}

  async getUserCycleMetrics(userId: number, cycleId: number) {
    await this.usersService.getUserById(userId);
    await this.cyclesService.getCycleById(cycleId);

    return await this.userMetricRepository
      .createQueryBuilder('um')
      .select('um.userMetricId', 'userMetricId')
      .addSelect('um.value', 'userMetricValue')
      .addSelect('c.startDate', 'startDate')
      .addSelect('m.metricId', 'metricId')
      .addSelect('m.metricName', 'metricName')
      .addSelect('m.metricUnit', 'metricUnit')
      .addSelect('mc.weight', 'weight')
      .addSelect('mc.threshold', 'threshold')
      .innerJoin('cycles', 'c', 'um.cycleId = c.cycleId')
      .innerJoin('metrics', 'm', 'um.metricId = m.metricId')
      .innerJoin(
        'metric_criteria',
        'mc',
        'um.metricCriterionId = mc.metricCriterionId',
      )
      .innerJoin('users', 'u', 'um.userId = u.userId')
      .where('u.userId = :userId', { userId })
      .andWhere('c.cycleId = :cycleId', { cycleId })
      .getRawMany();
  }

  async getUserCycles(userId: number) {
    await this.usersService.getUserById(userId);
    return await this.userMetricRepository
      .createQueryBuilder('um')
      .select('um.cycleId', 'cycleId')
      .addSelect('c.startDate', 'startDate')
      .innerJoin('cycles', 'c', 'um.cycleId = c.cycleId')
      .innerJoin('users', 'u', 'um.userId = u.userId')
      .where('u.userId = :userId', { userId })
      .distinct(true)
      .getRawMany();
  }

  async getCycleUsers(cycleId: number) {
    await this.cyclesService.getCycleById(cycleId);
    return await this.userMetricRepository
      .createQueryBuilder('um')
      .select('um.userId', 'userId')
      .addSelect('u.email', 'email')
      .innerJoin('cycles', 'c', 'um.cycleId = c.cycleId')
      .innerJoin('users', 'u', 'um.userId = u.userId')
      .where('c.cycleId = :cycleId', { cycleId })
      .distinct(true)
      .getRawMany();
  }

  async getRankingData(cycleId: number) {
    await this.cyclesService.getCycleById(cycleId);

    return await this.userMetricRepository
      .createQueryBuilder('um')
      .select('um.value', 'value')
      .addSelect('u.email', 'email')
      .addSelect('mc.weight', 'weight')
      .addSelect('mc.threshold', 'threshold')
      .innerJoin('users', 'u', 'um.userId = u.userId')
      .innerJoin(
        'metric_criteria',
        'mc',
        'um.metricCriterionId = mc.metricCriterionId',
      )
      .where('um.cycleId = :cycleId', { cycleId })
      .getRawMany();
  }

  async getUserMetricById(userMetricId: number) {
    const userMetric = await this.userMetricRepository.findOne({
      where: { userMetricId },
    });

    if (!userMetric) {
      throw new NotFoundException(
        `User metric with id = ${userMetricId} was not found`,
      );
    }

    return userMetric;
  }

  async createUserMetricEntries(
    createUserMetricEntriesDto: CreateUserMetricEntriesDto,
  ) {
    const { cycleId, metricItems, userIds } = createUserMetricEntriesDto;
    const cycle = await this.cyclesService.getCycleById(cycleId);
    const users = await Promise.all(
      userIds.map(async (userId) => {
        const user = await this.usersService.getUserById(userId);
        return user;
      }),
    );

    const metricDataEntities = await Promise.all(
      metricItems.map(async (metricItem) => {
        const metricCriterion =
          await this.metricCriteriaService.getMetricCriterionById(
            metricItem.metricCriterionId,
          );
        const metric = await this.metricsService.getMetricById(
          metricItem.metricId,
        );

        return [metricCriterion, metric];
      }),
    );

    for (let user of users) {
      for (let metricDataEntity of metricDataEntities) {
        const [metricCriterion, metric] = metricDataEntity;
        const newUserMetric = this.userMetricRepository.create({
          user,
          cycle,
          metricCriterion,
          metric,
        });

        await this.userMetricRepository.save(newUserMetric);
      }
    }
  }

  async createUserMetric(createUserMetricDto: CreateUserMetricDto) {
    const { userId, cycleId, metricId, metricCriterionId } =
      createUserMetricDto;

    const user = await this.usersService.getUserById(userId);
    const cycle = await this.cyclesService.getCycleById(cycleId);
    const metric = await this.metricsService.getMetricById(metricId);
    const metricCriterion =
      await this.metricCriteriaService.getMetricCriterionById(
        metricCriterionId,
      );

    const newUserMetric = this.userMetricRepository.create({
      user,
      cycle,
      metric,
      metricCriterion,
    });

    await this.userMetricRepository.save(newUserMetric);
  }

  async updateDashboardUserMetrics(
    updateDashboardUserMetricsDto: UpdateDashboardUserMetricsDto,
  ) {
    const { updated } = updateDashboardUserMetricsDto;

    for (let metricItem of updated) {
      const { userMetricId, userMetricValue } = metricItem;
      await this.updateUserMetricValue(userMetricId, { userMetricValue });
    }
  }

  async updateUserMetricValue(
    userMetricId: number,
    updateUserMetricDto: UpdateUserMetricDto,
  ) {
    const userMetric = await this.getUserMetricById(userMetricId);
    const { userMetricValue: value } = updateUserMetricDto;

    return await this.userMetricRepository.update(userMetricId, {
      ...userMetric,
      value,
    });
  }

  async deleteUserMetric(userMetricId: number) {
    await this.getUserMetricById(userMetricId);
    await this.userMetricRepository.delete(userMetricId);
  }
}
