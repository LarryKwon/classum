import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import SpaceExists from '../../space-role/decorator/space-exists.validator';
import { PostType } from '../enum/post-type.enum';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  contents: string;

  @IsEnum(PostType)
  @IsNotEmpty()
  type: PostType;

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
