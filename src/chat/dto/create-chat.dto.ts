import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import SpaceExists from '../../space-role/decorator/space-exists.validator';
import { PostType } from '../../post/enum/post-type.enum';
import PostExists from '../../post/decorator/post-exists.validator';

export class CreateChatDto {
  @IsString()
  @IsNotEmpty()
  contents: string;

  @IsBoolean()
  @IsNotEmpty()
  isAnonymous: boolean;

  @SpaceExists()
  @IsNumber()
  spaceId: number;

  @PostExists()
  @IsNumber()
  postId: number;
}
