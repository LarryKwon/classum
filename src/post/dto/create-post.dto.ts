import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import SpaceExists from '../../space-role/decorator/space-exists.validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  contents: string;

  @IsString()
  @IsOptional()
  attachment?: string;

  @IsBoolean()
  @IsNotEmpty()
  isAnonymous: boolean;

  @SpaceExists()
  @IsNumber()
  spaceId: number;
}
