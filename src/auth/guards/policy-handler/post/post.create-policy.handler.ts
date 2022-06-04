import { AppAbility } from '../../../../casl/casl-ability.factory';
import { Action } from '../../../enum/Action';
import { IPolicyHandler } from '../../../../casl/handlerType';
import { Space } from '../../../../space/entity/space.entity';
import { SpaceRole } from '../../../../space-role/entity/space-role.entity';
import { Post } from '../../../../post/entity/post.entity';

export class CreatePostPolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Action.Create, Post);
  }
}
