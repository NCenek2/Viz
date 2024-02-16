import { Controller, Get, HttpCode } from '@nestjs/common';
import { LogoutService } from './logout.service';
import { SkipAuth } from 'src/auth/skip-auth';

@Controller('logout')
export class LogoutController {
  constructor(private readonly logoutService: LogoutService) {}

  @SkipAuth()
  @Get()
  @HttpCode(204)
  async logout() {
    await this.logoutService.logout();
  }
}
