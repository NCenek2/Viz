import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { USERS } from 'src/constants/constants';

export class CreateUserDto {
  @MinLength(1, { message: `Username must have 1 or more characters` })
  @MaxLength(USERS.USERNAME, {
    message: `Username must have ${USERS.USERNAME} or fewer characters`,
  })
  username: string;

  @IsNotEmpty()
  @IsEmail({}, { message: `Please provide valid email` })
  @MaxLength(USERS.EMAIL, {
    message: `Email must have ${USERS.EMAIL} or fewer characters`,
  })
  email: string;

  @MinLength(USERS.PASSWORD_MIN, {
    message: `Password must have ${USERS.PASSWORD_MIN} or more characters`,
  })
  @MaxLength(USERS.PASSWORD_MAX, {
    message: `Password must have ${USERS.PASSWORD_MAX} or fewer characters`,
  })
  password: string;
}
