import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PoliciesGuard } from '../auth/guards/policies.guard';
import { CheckPolicies } from '../auth/decorator/policy.decorator';
import { DeleteSpacePolicyHandler } from '../auth/guards/policy-handler/space.delete-policy.handler';
import { DeleteSpaceRoleDto } from './dto/delete-spaceRole.dto';
import { SpaceRoleService } from './space-role.service';
import { DeleteSpaceRolePolicyHandler } from '../auth/guards/policy-handler/spaceRole.delete-policy.handler';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('space-role')
export class SpaceRoleController {
  constructor(private readonly spaceRoleService: SpaceRoleService) {}
  @Delete()
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new DeleteSpaceRolePolicyHandler())
  deleteSpaceRole(@Body() deleteSpaceRoleDto: DeleteSpaceRoleDto) {
    return this.spaceRoleService.deleteSpaceRole(deleteSpaceRoleDto);
  }
}
