import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
} from '@casl/ability';
import { Injectable, Logger } from '@nestjs/common';
import { User } from '../user/entity/user.entity';
import { Action } from '../auth/enum/Action';
import { Space } from '../space/entity/space.entity';
import { SpaceRole } from '../space-role/entity/space-role.entity';
import { UserRepository } from '../user/repository/user.repository';
import { SpaceRepository } from '../space/repository/space.repository';
import { SpaceRoleRepository } from '../space-role/repository/space-role.repository';
import { UserSpaceRepository } from '../userspace/repository/userspace.repository';
import { Role } from '../auth/enum/role.enum';
import { InjectRepository } from '@nestjs/typeorm';

type Subjects =
  | InferSubjects<typeof Space | typeof User | typeof SpaceRole>
  | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    @InjectRepository(SpaceRepository)
    private readonly spaceRepository: SpaceRepository,
    @InjectRepository(SpaceRoleRepository)
    private readonly spaceRoleRepository: SpaceRoleRepository,
    @InjectRepository(UserSpaceRepository)
    private readonly userSpaceRepository: UserSpaceRepository,
  ) {}

  async createForUser(user: User, space: Space) {
    const { can, cannot, build } = new AbilityBuilder<
      Ability<[Action, Subjects]>
    >(Ability as AbilityClass<AppAbility>);

    const userId: number = user.id;
    const spaceId: number = space.id;
    const userSpace = await this.userSpaceRepository.findOneOrFail({
      where: {
        user: userId,
        space: spaceId,
      },
    });

    Logger.log('USER', JSON.stringify(user));
    Logger.log('SPACE', JSON.stringify(space));
    Logger.log('USERSPACE', JSON.stringify(userSpace));

    if (userSpace) {
      const spaceRole = await userSpace.spaceRole;
      Logger.log('SPACEROLE', JSON.stringify(spaceRole));
      if (spaceRole.role === Role.ADMIN) {
        can(Action.Manage, 'all');
      } else if (spaceRole.role === Role.MANAGER) {
        can(Action.Read, Space);
        can(Action.Update, Space);
        can(Action.Delete, Space);

        can(Action.Create, SpaceRole);
        can(Action.Read, SpaceRole);
        can(Action.Update, SpaceRole);
        can(Action.Delete, SpaceRole);
      } else if (spaceRole.role === Role.USER) {
        can(Action.Read, Space);
        cannot(Action.Update, Space);
        cannot(Action.Delete, Space);

        cannot(Action.Create, SpaceRole);
        can(Action.Read, SpaceRole);
        cannot(Action.Update, SpaceRole);
        cannot(Action.Delete, SpaceRole);
      }
    } else {
      console.log('null???');
      cannot(Action.Manage, 'all');
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
