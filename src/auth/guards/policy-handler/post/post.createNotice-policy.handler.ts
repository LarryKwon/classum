import { IPolicyHandler } from '../../../../casl/handlerType';
import { AppAbility } from '../../../../casl/casl-ability.factory';
import { Action } from '../../../enum/Action';
import { Post } from '../../../../post/entity/post.entity';

export class CreateNoticePolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Action.WriteNotice, Post);
  }
}
