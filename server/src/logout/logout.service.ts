import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class LogoutService {
  constructor(private readonly usersService: UsersService) {}

  async logout() {
    return 'LOGGED OUT';
  }
}
