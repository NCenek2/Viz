import { Injectable, UnauthorizedException } from '@nestjs/common';
import { hashPassword } from 'src/encryption/bcrpyt';
import { UsersService } from 'src/users/users.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { KEYS } from 'src/constants/constants';

@Injectable()
export class RegisterService {
  constructor(private readonly usersService: UsersService) {}

  async register(registerUserDto: RegisterUserDto) {
    let { companyKey, ...createUserDto } = registerUserDto;
    if (companyKey !== KEYS.COMPANY_KEY) {
      throw new UnauthorizedException('Invalid company key');
    }

    let { password } = registerUserDto;
    password = await hashPassword(password);

    await this.usersService.createUser({ ...createUserDto, password });
  }
}
