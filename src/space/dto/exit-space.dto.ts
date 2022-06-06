import { IsNotEmpty, IsNumber } from 'class-validator';
import SpaceExists from '../../space-role/decorator/space-exists.validator';

export class ExitSpaceDto {
  @SpaceExists()
  @IsNumber()
  @IsNotEmpty()
  spaceId: number;
}
