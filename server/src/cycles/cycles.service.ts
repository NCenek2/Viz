import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCycleDto } from './dto/create-cycle.dto';
import { CycleEntity } from './entities/cycle.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateCycleDateDto } from './dto/update-cycle-dto';
import { UniqueExceptionFilter } from 'src/Errors/conflict.exception.filters';

@Injectable()
export class CyclesService {
  constructor(
    @InjectRepository(CycleEntity)
    private readonly cycleRepository: Repository<CycleEntity>,
  ) {}
  async getAllCycles() {
    return await this.cycleRepository.find();
  }

  async getCycleById(cycleId: number) {
    const cycle = await this.cycleRepository.findOne({ where: { cycleId } });

    if (!cycle) {
      throw new NotFoundException(`Cycle with id = ${cycleId} was not found`);
    }

    return cycle;
  }

  async createCycle(createCycleDto: CreateCycleDto) {
    const { startDate } = createCycleDto;
    const cycle = await this.cycleRepository.findOne({ where: { startDate } });

    if (!cycle) {
      return await this.cycleRepository.save(createCycleDto);
    } else {
      return cycle;
    }
  }

  async updateCycleDate(
    cycleId: number,
    updateCycleDateDto: UpdateCycleDateDto,
  ) {
    await this.getCycleById(cycleId);
    await this.cycleRepository.update(cycleId, updateCycleDateDto);
  }
  async deleteCycle(cycleId: number) {
    await this.getCycleById(cycleId);
    await this.cycleRepository.delete(cycleId);
  }
}
