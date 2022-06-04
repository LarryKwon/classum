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
import { Chat } from '../chat/entity/chat.entity';
import { Post } from '../post/entity/post.entity';

type Subjects =
  | InferSubjects<
      typeof Space | typeof User | typeof SpaceRole | typeof Post | typeof Chat
    >
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
    const userSpace = await this.userSpaceRepository.findOne({
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
        can(Action.Update, Space);
        can(Action.Delete, Space);

        can(Action.Create, SpaceRole);
        can(Action.Read, SpaceRole);
        can(Action.Update, SpaceRole);
        can(Action.Delete, SpaceRole);

        can(Action.WriteNotice, Post);
        can(Action.WriteQuest, Post, { isAnonymous: false });
        can(Action.Read, Post);
        can(Action.Update, Post, { writer: user });
        can(Action.Delete, Post);

        can(Action.Create, Chat);
        can(Action.Read, Chat);
        can(Action.Update, Chat, { writer: user });
        can(Action.Delete, Chat);
      } else if (spaceRole.role === Role.USER) {
        cannot(Action.Update, Space);
        cannot(Action.Delete, Space);

        cannot(Action.Create, SpaceRole);
        can(Action.Read, SpaceRole);
        cannot(Action.Update, SpaceRole);
        cannot(Action.Delete, SpaceRole);

        cannot(Action.WriteNotice, Post);
        can(Action.WriteQuest, Post);
        can(Action.Read, Post);
        can(Action.Update, Post, { writer: user });
        can(Action.Delete, Post, { writer: user });

        can(Action.Create, Chat);
        can(Action.Read, Chat);
        can(Action.Update, Chat, { writer: user });
        can(Action.Delete, Chat, { writer: user });
      }
    } else {
      cannot(Action.Manage, 'all');
    }
    can(Action.Create, Space);
    can(Action.Read, Space);

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
