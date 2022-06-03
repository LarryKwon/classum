import { Role } from '../../auth/enum/role.enum';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import SpaceExists from '../decorator/delete.spaceRole.validator';

export class DeleteSpaceRoleDto {
  @IsString()
  name: string;

  @IsEnum(Role)
  role: Role;

  @SpaceExists()
  @IsNumber()
  spaceId: number;
}
