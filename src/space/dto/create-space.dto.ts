import { CreateSpaceRoleDto } from '../../space-role/dto/create-spaceRole.dto';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import ArrayDistinct from '../decorator/array-distinct.validator';
import ValidSpaceRole from '../decorator/space-role.validator';
import { Role } from '../../auth/enum/role.enum';
import { Logger } from '@nestjs/common';

export class CreateSpaceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @ArrayDistinct('name')
  @ValidSpaceRole()
  @ValidateNested({ each: true })
  @Type(() => CreateSpaceRoleDto)
  @IsNotEmpty()
  spaceRoles: CreateSpaceRoleDto[];

  @ValidateNested()
  @Type(() => CreateSpaceRoleDto)
  @IsNotEmpty()
  selectedSpaceRole: CreateSpaceRoleDto;

  isSelectInSpaceRoles(): boolean {
    if (this.selectedSpaceRole.role !== Role.MANAGER) return false;
    const filteredSpaceRoles = this.spaceRoles.filter(
      (spaceRole) =>
        spaceRole.name === this.selectedSpaceRole.name &&
        spaceRole.role === this.selectedSpaceRole.role,
    );
    if (filteredSpaceRoles.length > 1) return false;
    return true;
  }
}
