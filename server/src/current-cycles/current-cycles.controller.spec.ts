import { Test, TestingModule } from '@nestjs/testing';
import { CurrentCyclesController } from './current-cycles.controller';
import { CurrentCyclesService } from './current-cycles.service';

describe('CurrentCyclesController', () => {
  let controller: CurrentCyclesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CurrentCyclesController],
      providers: [CurrentCyclesService],
    }).compile();

    controller = module.get<CurrentCyclesController>(CurrentCyclesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
