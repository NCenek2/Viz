import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { USERS } from 'src/constants/constants';

export class LoginDto {
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
