import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { comparePassword } from 'src/encryption/bcrpyt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.usersService.getUserByEmail(email);
    const { password: storedPassword, userId, role, username } = user;

    const isUser = await comparePassword(password, storedPassword);

    if (!isUser) throw new UnauthorizedException();
    const payload = { userId, email, role, username };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      userInfo: {
        userId,
        username,
        email,
        role,
      },
      accessToken,
    };
  }
}
