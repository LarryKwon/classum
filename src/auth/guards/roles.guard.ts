import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Role } from '../enum/role.enum';
import { ROLES_KEY } from '../decorator/roles.decorator';
import { SpaceService } from '../../space/space.service';
import { UserSpace } from '../../userspace/entity/userspace.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private spaceService: SpaceService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler,
      context.getClass,
    ]);
    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    const userSpaces: UserSpace[] = await user.userSpaces;

    return requiredRoles.some((role) => user.roles?.include(role));
  }
}
