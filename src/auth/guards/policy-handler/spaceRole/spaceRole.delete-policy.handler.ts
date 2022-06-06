import { AppAbility } from '../../../../casl/casl-ability.factory';
import { Action } from '../../../enum/Action';
import { IPolicyHandler } from '../../../../casl/handlerType';
import { Space } from '../../../../space/entity/space.entity';
import { SpaceRole } from '../../../../space-role/entity/space-role.entity';

export class DeleteSpaceRolePolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Action.Delete, SpaceRole);
  }
}
