import { IsString } from 'class-validator';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

export class RegisterUserDto extends CreateUserDto {
  @IsString({ message: 'Company key must be a string' })
  companyKey: string;
}
