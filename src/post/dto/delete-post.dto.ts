import SpaceExists from '../../space-role/decorator/space-exists.validator';
import { IsNotEmpty, IsNumber } from 'class-validator';
import PostExists from '../decorator/post-exists.validator';

export class DeletePostDto {
  @SpaceExists()
  @IsNumber()
  spaceId: number;

  @PostExists()
  @IsNumber()
  @IsNotEmpty()
  postId: number;
}
