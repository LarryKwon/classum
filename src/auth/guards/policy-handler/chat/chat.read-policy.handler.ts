import { AppAbility } from '../../../../casl/casl-ability.factory';
import { Action } from '../../../enum/Action';
import { IPolicyHandler } from '../../../../casl/handlerType';
import { Post } from '../../../../post/entity/post.entity';
import { Chat } from '../../../../chat/entity/chat.entity';

export class ReadChatPolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Action.Read, Chat);
  }
}
