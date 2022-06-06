import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import ArrayDistinct from '../decorator/array-distinct.validator';
import ValidSpaceRole from '../decorator/space-role.validator';
import { Type } from 'class-transformer';
import { CreateSpaceRoleDto } from '../../space-role/dto/create-spaceRole.dto';
import { Role } from '../../auth/enum/role.enum';
import SpaceExists from '../../space-role/decorator/space-exists.validator';

export class UpdateSpaceDto {
  @SpaceExists()
  @IsNumber()
  @IsNotEmpty()
  spaceId: number;

  @IsString()
  @IsNotEmpty()
  updatedName: string;
}
