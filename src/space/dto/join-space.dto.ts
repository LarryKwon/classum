import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Matches,
  ValidateNested,
} from 'class-validator';
import { CreateSpaceRoleDto } from '../../space-role/dto/create-spaceRole.dto';
import { Type } from 'class-transformer';

export class JoinSpaceDto {
  @IsNumber()
  @IsNotEmpty()
  spaceId: number;

  @IsString()
  @Matches(/^[0-9a-zA-Z]+$/, {
    message: '코드는 영문 및 숫자로 이루어져있습니다.',
  })
  @Length(8, 8)
  @IsNotEmpty()
  code: string;

  @ValidateNested()
  @Type(() => CreateSpaceRoleDto)
  @IsNotEmpty()
  selectedSpaceRole: CreateSpaceRoleDto;
}
