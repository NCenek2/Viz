import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { CurrentCyclesService } from './current-cycles.service';
import { CreateCurrentCycleDto } from './dto/create-current-cycle.dto';
import { UpdateCurrentCycleDto } from './dto/update-current-cycle.dto';

@Controller('current_cycles')
export class CurrentCyclesController {
  constructor(private readonly currentCyclesService: CurrentCyclesService) {}

  @Get()
  async getCurrentCycles() {
    return await this.currentCyclesService.getCurrentCycles();
  }

  @Post()
  @HttpCode(201)
  async createCurrentCycle(
    @Body() createCurrentCycleDto: CreateCurrentCycleDto,
  ) {
    return await this.currentCyclesService.createCurrentCycle(
      createCurrentCycleDto,
    );
  }

  @Patch()
  @HttpCode(204)
  async updateCurrentCycle(
    @Body() updateCurrentCycleDto: UpdateCurrentCycleDto,
  ) {
    await this.currentCyclesService.updateCurrentCycle(updateCurrentCycleDto);
  }

  @Delete()
  @HttpCode(204)
  async deleteCurrentCycle() {
    await this.currentCyclesService.deleteCurrentCycle();
  }
}
