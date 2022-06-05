import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import SpaceExists from '../../space-role/decorator/space-exists.validator';
import PostExists from '../../post/decorator/post-exists.validator';
import ChatExists from '../decorator/chat-exists.validator';

export class CreateReplyDto {
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

  @ChatExists()
  @IsNumber()
  parentId: number;
}
