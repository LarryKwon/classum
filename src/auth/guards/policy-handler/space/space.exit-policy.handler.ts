import { IPolicyHandler } from '../../../../casl/handlerType';
import { AppAbility } from '../../../../casl/casl-ability.factory';
import { Action } from '../../../enum/Action';
import { Space } from '../../../../space/entity/space.entity';

export class ExitSpacePolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Action.Exit, Space);
  }
}
