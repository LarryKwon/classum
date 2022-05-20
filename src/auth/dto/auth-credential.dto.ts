import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AuthCredentialDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(4)
  @Matches(/^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).*$/, {
    message: '비밀번호는 숫자, 영문, 특수문자 각 1자리를 포함해야합니다.',
  })
  password: string;
}
