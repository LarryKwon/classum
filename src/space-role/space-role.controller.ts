import { Body, Controller, Delete, Param, UseGuards } from '@nestjs/common';
import { PoliciesGuard } from '../auth/guards/policies.guard';
import { CheckPolicies } from '../auth/decorator/policy.decorator';
import { DeleteSpacePolicyHandler } from '../auth/guards/policy-handler/delete-policy.handler';
import { DeleteSpaceRoleDto } from './dto/delete-spaceRole.dto';
import { SpaceRoleService } from './space-role.service';

@Controller('space-role')
export class SpaceRoleController {
  constructor(private readonly spaceRoleService: SpaceRoleService) {}
  @Delete()
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new DeleteSpacePolicyHandler())
  deleteSpaceRole(@Body() deleteSpaceRoleDto: DeleteSpaceRoleDto) {
    return this.spaceRoleService.deleteSpaceRole(deleteSpaceRoleDto);
  }
}
