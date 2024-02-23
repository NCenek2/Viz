import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { hashPassword } from 'src/encryption/bcrpyt';

@Injectable()
export class ProfileService {
  constructor(private readonly usersService: UsersService) {}

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { email, username } = resetPasswordDto;
    let { password } = resetPasswordDto;

    const user = await this.usersService.getUserByEmail(email);

    if (user.username !== username) {
      throw new UnauthorizedException();
    }

    password = await hashPassword(password);

    return this.usersService.changePassword(user, password);
  }
}
