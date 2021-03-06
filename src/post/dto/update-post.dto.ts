import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import SpaceExists from '../../space-role/decorator/space-exists.validator';
import PostExists from '../decorator/post-exists.validator';

export class UpdatePostDto {
  @IsString()
  @IsNotEmpty()
  contents: string;

  @IsString()
  @IsOptional()
  attachment?: string;

  @SpaceExists()
  @IsNumber()
  spaceId: number;

  @PostExists()
  @IsNumber()
  postId: number;
}
