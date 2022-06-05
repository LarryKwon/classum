import { Role } from '../../auth/enum/role.enum';
import { IsEnum, IsString } from 'class-validator';

export class CreateSpaceRoleDto {
  @IsString()
  name: string;

  @IsEnum(Role)
  role: Role;
}
