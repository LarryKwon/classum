import { IsNotEmpty, IsNumber } from 'class-validator';
import SpaceExists from '../../space-role/decorator/space-exists.validator';
import PostExists from '../../post/decorator/post-exists.validator';

export class FindChatsDto {
  @PostExists()
  @IsNumber()
  @IsNotEmpty()
  postId: number;

  @SpaceExists()
  @IsNumber()
  @IsNotEmpty()
  spaceId: number;
}
