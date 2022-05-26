import { CreateSpaceRoleDto } from '../../space-role/dto/create-spaceRole.dto';
import {
  ArrayUnique,
  IsArray,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import any = jasmine.any;
import ArrayDistinct from '../decorator/array-distinct.validator';
import ValidSpaceRole from '../decorator/space-role.validator';

export class CreateSpaceDto {
  @IsString()
  name: string;

  @IsArray()
  @ArrayDistinct('name')
  @ValidSpaceRole()
  @ValidateNested({ each: true })
  @Type(() => CreateSpaceRoleDto)
  spaceRoles: CreateSpaceRoleDto[];
}
