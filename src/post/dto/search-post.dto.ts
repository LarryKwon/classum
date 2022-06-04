import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import SpaceExists from '../../space-role/decorator/space-exists.validator';

export class SearchPostDto {
  @SpaceExists()
  @IsNumber()
  @IsNotEmpty()
  spaceId: number;

  @IsString()
  @IsNotEmpty()
  keyword: string;
}
