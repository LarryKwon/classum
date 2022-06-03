import {
  AppAbility,
  CaslAbilityFactory,
} from '../../casl/casl-ability.factory';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { CHECK_POLICIES_KEY } from '../decorator/policy.decorator';
import { PolicyHandler } from '../../casl/handlerType';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSpaceRepository } from '../../userspace/repository/userspace.repository';
import { SpaceRepository } from '../../space/repository/space.repository';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
    @InjectRepository(UserSpaceRepository)
    private userSpaceRepository: UserSpaceRepository,
    @InjectRepository(SpaceRepository)
    private spaceRepository: SpaceRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyHandlers =
      this.reflector.get<PolicyHandler[]>(
        CHECK_POLICIES_KEY,
        context.getHandler(),
      ) || [];

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const spaceId = request.body.spaceId;
    Logger.log('spaceId params: ', spaceId);

    const space = await this.spaceRepository.findOneOrFail(spaceId);
    Logger.log(`search with ${spaceId}`, JSON.stringify(space));
    const ability = await this.caslAbilityFactory.createForUser(user, space);
    return policyHandlers.every((handler) =>
      this.execPolicyHandler(handler, ability),
    );
  }

  private execPolicyHandler(handler: PolicyHandler, ability: AppAbility) {
    if (typeof handler === 'function') {
      return handler(ability);
    }
    return handler.handle(ability);
  }
}
