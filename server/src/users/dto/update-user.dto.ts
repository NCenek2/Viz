import { PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsIn, IsInt } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateUsernameDto extends PickType(CreateUserDto, [
  'username',
] as const) {}

export class UpdateUserRoleDto {
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: 'Role must be an integer' })
  @IsIn([1, 2], { message: 'Invalid role value' })
  role: number;
}
