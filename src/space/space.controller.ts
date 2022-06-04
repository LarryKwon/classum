import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
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
import { DeleteSpacePolicyHandler } from '../auth/guards/policy-handler/space.delete-policy.handler';

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
    Logger.log(JSON.stringify(createSpaceDto));
    if (!createSpaceDto.isSelectInSpaceRoles()) {
      throw new BadRequestException('select role must be in role list');
    }
    const { savedSpace, userSpaceRole } = await this.spaceService.createSpace(
      createSpaceDto,
    );
    await this.userSpaceService.createRelations(
      user,
      savedSpace,
      userSpaceRole,
    );
    return savedSpace;
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

  @Get('/:spaceId')
  findSpaceById(@Param('spaceId') id: number) {
    return this.spaceService.searchSpaceById(id);
  }

  @Delete('/:id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new DeleteSpacePolicyHandler())
  deleteSpace(@Param('id') id: number) {
    return this.spaceService.deleteSpaceById(id);
  }
}
