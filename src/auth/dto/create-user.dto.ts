import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { Column } from 'typeorm';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(4)
  @Matches(/^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).*$/, {
    message: '비밀번호는 숫자, 영문, 특수문자 각 1자리를 포함해야합니다.',
  })
  password: string;

  @IsString()
  lastName: string;

  @IsString()
  firstName: string;
}
