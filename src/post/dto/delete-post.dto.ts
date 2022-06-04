import SpaceExists from '../../space-role/decorator/space-exists.validator';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class DeletePostDto {
  @SpaceExists()
  @IsNumber()
  spaceId: number;

  @IsNumber()
  @IsNotEmpty()
  postId: number;
}
