import { AppAbility } from '../../../../casl/casl-ability.factory';
import { Action } from '../../../enum/Action';
import { IPolicyHandler } from '../../../../casl/handlerType';
import { Space } from '../../../../space/entity/space.entity';

export class DeleteSpacePolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Action.Delete, Space);
  }
}
