import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SpaceService } from './space.service';
import { CreateSpaceDto } from './dto/create-space.dto';
import { SearchSpaceDto } from './dto/search-space.dto';
import { User } from '../user/entity/user.entity';
import { JoinSpaceDto } from './dto/join-space.dto';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { UserSpaceService } from '../userspace/userspace.service';
import { PoliciesGuard } from '../auth/guards/policies.guard';
import { CheckPolicies } from '../auth/decorator/policy.decorator';
import { DeleteSpacePolicyHandler } from '../auth/guards/policy-handler/space/space.delete-policy.handler';
import { UpdateSpaceDto } from './dto/update-space.dto';
import { UpdateSpacePolicyHandler } from '../auth/guards/policy-handler/space/space.update-policy.handler';
import { Check } from 'typeorm';
import { ExitSpaceDto } from './dto/exit-space.dto';
import { ExitSpacePolicyHandler } from '../auth/guards/policy-handler/space/space.exit-policy.handler';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('space')
export class SpaceController {
  constructor(
    private readonly spaceService: SpaceService,
    private readonly userSpaceService: UserSpaceService,
  ) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createSpace(
    @Body() createSpaceDto: CreateSpaceDto,
    @GetUser() user: User,
  ) {
    // Logger.log(JSON.stringify(createSpaceDto));
    if (!createSpaceDto.isSelectInSpaceRoles()) {
      throw new BadRequestException('select role must be in role list');
    }
    return await this.spaceService.createSpace(createSpaceDto, user);
  }

  @Get('/search')
  @UsePipes(ValidationPipe)
  searchSpace(@Body() searchSpaceDto: SearchSpaceDto) {
    return this.spaceService.searchSpace(searchSpaceDto);
  }

  @Post('/join')
  joinSpace(@Body() joinSpaceDto: JoinSpaceDto, @GetUser() user: User) {
    return this.spaceService.joinSpace(joinSpaceDto, user);
  }

  @Post('/exit')
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new ExitSpacePolicyHandler())
  exitSpace(@Body() exitSpaceDto: ExitSpaceDto, @GetUser() user: User) {
    return this.spaceService.exitSpaceById(exitSpaceDto, user);
  }

  @Get('/:spaceId')
  findSpaceById(@Param('spaceId') id: number) {
    return this.spaceService.findSpaceById(id);
  }

  @Patch()
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new UpdateSpacePolicyHandler())
  updateSpace(@Body() updateSpaceDto: UpdateSpaceDto, @GetUser() user: User) {
    return this.spaceService.updateSpaceById(updateSpaceDto);
  }

  @Delete()
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new DeleteSpacePolicyHandler())
  deleteSpace(@Body('spaceId') spaceId: number) {
    return this.spaceService.deleteSpaceById(spaceId);
  }
}
