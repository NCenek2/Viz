import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { USERS } from 'src/constants/constants';

export class ResetPasswordDto {
  @IsNotEmpty({ message: 'Username cannot be empty' })
  @IsString({ message: 'Username must be a string' })
  username: string;

  @IsNotEmpty({ message: 'Email cannot be empty' })
  @MaxLength(USERS.EMAIL, {
    message: `Email must be ${USERS.EMAIL} characters or less`,
  })
  email: string;

  @IsNotEmpty({ message: 'Password cannot be empty' })
  @MinLength(USERS.PASSWORD_MIN, {
    message: `Password must be ${USERS.PASSWORD_MIN} characters or more`,
  })
  password: string;
}
