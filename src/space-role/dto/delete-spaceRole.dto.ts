import { Role } from '../../auth/enum/role.enum';
import { IsEnum, IsNumber, IsString, ValidateNested } from 'class-validator';
import SpaceExists from '../decorator/space-exists.validator';
import { CreateSpaceRoleDto } from './create-spaceRole.dto';
import { Type } from 'class-transformer';
import ValidSpaceRole from '../../space/decorator/space-role.validator';

export class DeleteSpaceRoleDto {
  @ValidSpaceRole()
  @ValidateNested()
  @Type(() => CreateSpaceRoleDto)
  spaceRole: CreateSpaceRoleDto;

  @SpaceExists()
  @IsNumber()
  spaceId: number;
}
