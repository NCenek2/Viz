import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
} from '@nestjs/common';
import { CyclesService } from './cycles.service';
import { CreateCycleDto } from './dto/create-cycle.dto';
import { UniqueExceptionFilter } from 'src/Errors/conflict.exception.filters';
import { UpdateCycleDateDto } from './dto/update-cycle-dto';

@Controller('cycles')
export class CyclesController {
  constructor(private readonly cyclesService: CyclesService) {}

  @Get()
  async getAllCycles() {
    return await this.cyclesService.getAllCycles();
  }

  @Get(':cycleId')
  async getCycleById(@Param('cycleId', ParseIntPipe) cycleId: number) {
    return await this.cyclesService.getCycleById(cycleId);
  }

  @Post()
  @HttpCode(201)
  async createCycle(@Body() createCycleDto: CreateCycleDto) {
    try {
      return await this.cyclesService.createCycle(createCycleDto);
    } catch (err) {
      UniqueExceptionFilter(
        err,
        `Cycle with start date ${createCycleDto.startDate} already exists`,
      );
    }
  }

  @Patch(':cycleId')
  @HttpCode(204)
  async updateCycleDate(
    @Param('cycleId', ParseIntPipe) cycleId: number,
    @Body() updateCycleDateDto: UpdateCycleDateDto,
  ) {
    try {
      await this.cyclesService.updateCycleDate(cycleId, updateCycleDateDto);
    } catch (err) {
      UniqueExceptionFilter(
        err,
        `Cycle with start date ${updateCycleDateDto.startDate} already exists`,
      );
    }
  }

  @Delete(':cycleId')
  @HttpCode(204)
  async deleteCycle(@Param('cycleId', ParseIntPipe) cycleId: number) {
    await this.cyclesService.deleteCycle(cycleId);
  }
}
