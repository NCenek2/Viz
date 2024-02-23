import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SkipAuth } from 'src/auth/skip-auth';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @SkipAuth()
  @HttpCode(204)
  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.profileService.resetPassword(resetPasswordDto);
  }
}
