import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserRoleDto, UpdateUsernameDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { ReturnUserDto } from './dto/return-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getAllUsers() {
    return await this.userRepository.find({
      select: ['userId', 'username', 'email', 'role'],
    });
  }

  async getAccessUsers(): Promise<ReturnUserDto[]> {
    return await this.userRepository.find({
      select: ['userId', 'email', 'role'],
    });
  }

  async getDashboardUsers() {
    return await this.userRepository.find({ select: ['userId', 'email'] });
  }

  async getUser(userId: number) {
    const user = await this.getUserById(userId);

    const { username, email, role } = user;
    return { userId, username, email, role };
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['userId', 'username', 'email', 'password', 'role'],
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }

  async getUserById(userId: number) {
    const user = await this.userRepository.findOne({ where: { userId } });

    if (!user) {
      throw new NotFoundException(`User with id = ${userId} was not found`);
    }

    return user;
  }

  async createUser(createUserDto: CreateUserDto) {
    await this.userRepository.save(createUserDto);
  }

  async updateUserRole(userId: number, updateUserRoleDto: UpdateUserRoleDto) {
    await this.getUserById(userId);
    await this.userRepository.update(userId, updateUserRoleDto);
  }

  async updateUserUsername(
    userId: number,
    updateUsernameDto: UpdateUsernameDto,
  ) {
    await this.getUserById(userId);
    await this.userRepository.update(userId, updateUsernameDto);
  }

  async changePassword(user: UserEntity, password: string) {
    await this.userRepository.update(user, { password });
  }

  async deleteUserById(userId: number) {
    await this.getUserById(userId);
    await this.userRepository.delete(userId);
  }
}
