import { IPolicyHandler } from '../../../../casl/handlerType';
import { AppAbility } from '../../../../casl/casl-ability.factory';
import { Action } from '../../../enum/Action';
import { SpaceRole } from '../../../../space-role/entity/space-role.entity';

export class CreateSpaceRolePolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Action.Create, SpaceRole);
  }
}
