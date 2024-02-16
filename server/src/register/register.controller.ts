import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { RegisterService } from './register.service';
import { UniqueExceptionFilter } from 'src/Errors/conflict.exception.filters';
import { RegisterUserDto } from './dto/register-user.dto';
import { SkipAuth } from 'src/auth/skip-auth';

@Controller('register')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @SkipAuth()
  @Post()
  @HttpCode(201)
  async register(@Body() registerUserDto: RegisterUserDto) {
    try {
      await this.registerService.register(registerUserDto);
    } catch (err) {
      UniqueExceptionFilter(err, 'User with that email already exits');
    }
  }
}
