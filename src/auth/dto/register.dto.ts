import { IsEmail, IsNotEmpty, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

const passwordRegExp =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
const passwordErrorMessage =
  'Passwords must be at least eight characters long and include an uppercase letter, a lowercase letter, a digit, and a special character.';

export class RegisterDto {
  @ApiProperty({ example: 'John', description: 'The first name of the user' })
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({ example: 'Doe', description: 'The last name of the user' })
  @IsNotEmpty()
  last_name: string;

  @ApiProperty({
    example: 'john.doe@gmail.com',
    description: 'The email of the user',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Password@123',
    description: 'The password of the user',
  })
  @IsNotEmpty()
  @Matches(passwordRegExp, { message: passwordErrorMessage })
  password: string;
}
