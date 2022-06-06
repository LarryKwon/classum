import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PoliciesGuard } from '../auth/guards/policies.guard';
import { CheckPolicies } from '../auth/decorator/policy.decorator';
import { DeleteSpacePolicyHandler } from '../auth/guards/policy-handler/space/space.delete-policy.handler';
import { DeleteSpaceRoleDto } from './dto/delete-spaceRole.dto';
import { SpaceRoleService } from './space-role.service';
import { DeleteSpaceRolePolicyHandler } from '../auth/guards/policy-handler/spaceRole/spaceRole.delete-policy.handler';
import { CreateSpaceRoleDto } from './dto/create-spaceRole.dto';
import { CreateSpaceRolePolicyHandler } from '../auth/guards/policy-handler/spaceRole/spaceRole.create-policy.handler';
import { UpdateSpaceRolePolicyHandler } from '../auth/guards/policy-handler/spaceRole/spaceRole.update-policy.handler';

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

  @Post()
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new CreateSpaceRolePolicyHandler())
  insertSpaceRole(
    @Body('spaceRole') createSpaceRoleDto: CreateSpaceRoleDto,
    @Body('spaceId') spaceId: number,
  ) {
    return this.spaceRoleService.createSpaceRole(createSpaceRoleDto, spaceId);
  }
}
