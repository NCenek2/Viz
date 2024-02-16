import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCurrentCycleDto } from './dto/create-current-cycle.dto';
import { UpdateCurrentCycleDto } from './dto/update-current-cycle.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CurrentCycleEntity } from './entities/current-cycle.entity';
import { CyclesService } from 'src/cycles/cycles.service';

@Injectable()
export class CurrentCyclesService {
  constructor(
    @InjectRepository(CurrentCycleEntity)
    private readonly currentCycleRepository: Repository<CurrentCycleEntity>,
    private readonly cyclesService: CyclesService,
  ) {}

  async getCurrentCycles() {
    const currentCycle = await this.currentCycleRepository
      .createQueryBuilder('current_cycles')
      .leftJoinAndSelect('current_cycles.cycle', 'cycles')
      .select([
        'current_cycles.currentCycleId',
        'cycles.cycleId',
        'cycles.startDate',
      ])
      .getOne();

    if (!currentCycle) {
      return [];
    }

    const {
      cycle: { cycleId, startDate },
    } = currentCycle;

    return { cycleId, startDate };
  }

  async createCurrentCycle(createCurrentCycleDto: CreateCurrentCycleDto) {
    const currentCycle = await this.currentCycleRepository.find();
    if (currentCycle.length) {
      throw new ConflictException('A current cycle already exists');
    }

    const { cycleId } = createCurrentCycleDto;
    const cycle = await this.cyclesService.getCycleById(cycleId);

    const newCurrentCycle = this.currentCycleRepository.create({
      cycle,
    });

    return await this.currentCycleRepository.save(newCurrentCycle);
  }

  async updateCurrentCycle(updateCurrentCycleDto: UpdateCurrentCycleDto) {
    const currentCycles = await this.currentCycleRepository.find();

    let currentCycle: CurrentCycleEntity = { cycle: null, currentCycleId: 0 };
    if (currentCycles.length > 0) {
      currentCycle = currentCycles[0];
    } else {
      currentCycle = await this.createCurrentCycle(updateCurrentCycleDto);
    }

    if (!currentCycle.currentCycleId) {
      throw new InternalServerErrorException('Unable to add current cycle');
    }

    const { currentCycleId } = currentCycle;
    const { cycleId } = updateCurrentCycleDto;
    const cycle = await this.cyclesService.getCycleById(cycleId);

    const newCurrentCycle = this.currentCycleRepository.create({
      cycle,
    });

    await this.currentCycleRepository.update(currentCycleId, newCurrentCycle);
  }

  async deleteCurrentCycle() {
    const currentCycle = await this.currentCycleRepository.find();
    if (!currentCycle.length) {
      throw new NotFoundException(`Current cycle was not found`);
    }

    await this.currentCycleRepository.delete(currentCycle[0]);
  }
}
