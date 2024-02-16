import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserRoleDto, UpdateUsernameDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers() {
    return await this.usersService.getAllUsers();
  }

  @Get('/access')
  async getAccessUsers() {
    return this.usersService.getAccessUsers();
  }

  @Get('/dashboard')
  async getDashboardUsers() {
    return this.usersService.getDashboardUsers();
  }

  @Get(':userId')
  async getUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.usersService.getUser(userId);
  }

  @Patch('/access/:userId')
  @HttpCode(204)
  async updateUserRole(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
  ) {
    await this.usersService.updateUserRole(userId, updateUserRoleDto);
  }

  @Patch(':userId')
  @HttpCode(204)
  async updateUserUsername(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() updateUsernameDto: UpdateUsernameDto,
  ) {
    await this.usersService.updateUserUsername(userId, updateUsernameDto);
  }

  @Delete(':userId')
  @HttpCode(204)
  async deleteUserById(@Param('userId', ParseIntPipe) userId: number) {
    return this.usersService.deleteUserById(userId);
  }
}
